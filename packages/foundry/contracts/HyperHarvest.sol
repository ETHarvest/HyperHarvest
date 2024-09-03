// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;

import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {ERC4626} from "@openzeppelin/contracts/token/ERC20/extensions/ERC4626.sol";
import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import {SafeERC20} from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import {IPoolAddressesProvider} from "./interfaces/aave/IPoolAddressesProvider.sol";
import {IPool} from "./interfaces/aave/IPool.sol";
import {IRouterClient} from "@chainlink/contracts-ccip/src/v0.8/ccip/interfaces/IRouterClient.sol";
import {Client} from "@chainlink/contracts-ccip/src/v0.8/ccip/libraries/Client.sol";
import {LinkTokenInterface} from "@chainlink/contracts/src/v0.8/shared/interfaces/LinkTokenInterface.sol";
import {CCIPReceiver} from "@chainlink/contracts-ccip/src/v0.8/ccip/applications/CCIPReceiver.sol";
import {ReentrancyGuard} from "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

// Custom error declarations

error HyperHarvest__FailedToReceived();
error HyperHarvest__AmountCantBeZero();
error HyperHarvest__AddressCantBeZero();
error HyperHarvest__OnlyOwnerCanCall(address caller, address owner);
error HyperHarvest__OnlyAllowedAddr(address caller);
error HyperHarvest__NotEnoughLinkBalance(uint256 currentBalance, uint256 calculatedFees);
error HyperHarvest__FailedToSendEther();
error HyperHarvest__CcipReceiveError();
error HyperHarvest__InsufficientBalance();
error HyperHarvest__InsufficientShares();

/**
 * @title HyperHarvest
 * @dev A contract for cross-chain yield farming using AAVE and Chainlink CCIP
 */
contract HyperHarvest is ERC4626, CCIPReceiver, ReentrancyGuard {
    using SafeERC20 for IERC20;

    IPoolAddressesProvider private immutable addressesProvider;
    IPool private immutable pool;
    address private owner;
    address private immutable i_link;
    address public immutable i_tokenAddr;
    uint256 private crossChainAssets;

    mapping(address => bool) public isAllowed;

    // Events
    event SetOwner(address oldOwner, address NewOwner);
    event LendMessageSent(
        bytes32 messageId,
        uint256 amount,
        uint64 destinationChainSelector,
        address receiver,
        uint256 gasFeeAmount
    );
    event SuppliedToDefi(uint256 TotalTokenBalance);
    event WithdrawedFromDefi(uint256 totalAtokenBalance);
    event WithdrawBridgeAndSupplied(
        address Receiver,
        uint256 GasFeesAmount,
        uint64 DestinationChainSelector
    );
    event CrossChainAssetsUpdated(uint256 oldValue, uint256 newValue);
    event UserDeposited(address indexed user, uint256 assets, uint256 shares);
    event UserWithdrawn(address indexed user, uint256 assets, uint256 shares);


    // Modifiers
    modifier onlyOwner() {
        if (msg.sender != owner)
            revert HyperHarvest__OnlyOwnerCanCall(msg.sender, owner);
        _;
    }

    modifier onlyAllowed(address _caller) {
        if (isAllowed[_caller] != true)
            revert HyperHarvest__OnlyAllowedAddr(msg.sender);
        _;
    }

    /**
     * @dev Constructor to initialize the HyperHarvest contract
     * @param _asset The address of the ERC20 token to be used as the underlying asset
     * @param _owner The address of the contract owner
     * @param _ccipRouter The address of the Chainlink CCIP router
     * @param _link The address of the LINK token
     * @param _addressProvider The address of the AAVE Pool Addresses Provider
     */
    constructor(
        IERC20 _asset,
        address _owner,
        address _ccipRouter,
        address _link,
        address _addressProvider
    ) ERC4626(_asset) ERC20("HyperHarvest", "HH") CCIPReceiver(_ccipRouter) {
        owner = _owner;
        i_link = _link;
        addressesProvider = IPoolAddressesProvider(_addressProvider);
        pool = IPool(addressesProvider.getPool());
        i_tokenAddr = address(_asset);
    }

    /**
     * @dev Sets a new owner for the contract
     * @param _owner The address of the new owner
     */
    function setOwner(address _owner) external onlyOwner {
        if (_owner == address(0)) revert HyperHarvest__AddressCantBeZero();
        address oldOwner = owner;
        owner = _owner;
        emit SetOwner(oldOwner, _owner);
    }

    /**
     * @dev Adds an address to the Allowance
     * @param _allowedAddress The address to be Allowed
     */
    function setAllowance(address _allowedAddress) external onlyOwner {
        isAllowed[_allowedAddress] = true;
    }

    /**
     * @dev Updates the cross-chain assets balance
     * @param _newCrossChainAssets The new balance of assets on other chains
     */
    function setCrossChainAssets(uint256 _newCrossChainAssets) external onlyOwner {
        uint256 oldValue = crossChainAssets;
        crossChainAssets = _newCrossChainAssets;
        emit CrossChainAssetsUpdated(oldValue, _newCrossChainAssets);
    }

    /**
     * @dev Allows users to deposit assets into the contract
     * @param assets The amount of assets to deposit
     * @return The number of shares minted
     */
    function userDeposit(uint256 assets) external nonReentrant returns (uint256) {
        if (assets == 0) revert HyperHarvest__AmountCantBeZero();
        uint256 shares = previewDeposit(assets);
        _deposit(msg.sender, msg.sender, assets, shares);
        emit UserDeposited(msg.sender, assets, shares); 
        return shares;
    }

    /**
     * @dev Allows users to withdraw assets from the contract
     * @param shares The number of shares to redeem
     * @return The amount of assets withdrawn
     */
    function userWithdraw(uint256 shares) external nonReentrant returns (uint256) {
        if (shares == 0) revert HyperHarvest__AmountCantBeZero();
        if (balanceOf(msg.sender) < shares) revert HyperHarvest__InsufficientShares();
        
        uint256 assets = previewRedeem(shares);
        _withdraw(msg.sender, msg.sender, msg.sender, assets, shares);
        
        // Check if there are enough assets in the contract
        uint256 availableBalance = IERC20(asset()).balanceOf(address(this));
        if (assets > availableBalance) {
            // If not enough assets, withdraw the shortfall from Aave
            uint256 shortfall = assets - availableBalance;
            pool.withdraw(address(asset()), shortfall, address(this));
        }
        
        // Transfer the assets to the user
        IERC20(asset()).safeTransfer(msg.sender, assets);
        emit UserWithdrawn(msg.sender, assets, shares);
        return assets;
    }

    /**
     * @dev Supplies the contract's token balance to AAVE
     */
    function supplyAssetToAave() public onlyAllowed(msg.sender) {
        uint256 totalTokenBalance = IERC20(asset()).balanceOf(address(this));
        // Approve Aave pool to spend tokens
        IERC20(asset()).approve(address(pool), totalTokenBalance);
        // Supply tokens to Aave
        pool.supply(address(asset()), totalTokenBalance, address(this), 0);
        emit SuppliedToDefi(totalTokenBalance);
    }

    /**
     * @dev Withdraws all supplied tokens from AAVE
     */
    function withdrawAssetFromAave() public onlyAllowed(msg.sender) {
        address aTokenAddr = pool.getReserveData(address(asset())).aTokenAddress;
        uint256 totalAtokenBalance = IERC20(aTokenAddr).balanceOf(address(this));
        // Withdraw all supplied tokens from Aave
        pool.withdraw(address(asset()), type(uint256).max, address(this));
        emit WithdrawedFromDefi(totalAtokenBalance);
    }

    /**
     * @dev Bridges tokens to another chain and supplies them to AAVE on that chain
     * @param _receiver The address of the receiver on the destination chain
     * @param _gasFeeAmount The amount of gas fee to be paid
     * @param _destinationChainSelector The selector of the destination chain
     * @return messageId The ID of the CCIP message
     */
    function bridgeAndSupplyAssetToAave(
        address _receiver,
        uint256 _gasFeeAmount,
        uint64 _destinationChainSelector
    ) public onlyAllowed(msg.sender) returns (bytes32 messageId) {
        uint256 totalBalance = totalAssets();

        // Prepare token amounts for CCIP message
        Client.EVMTokenAmount[] memory tokenAmounts = new Client.EVMTokenAmount[](1);
        tokenAmounts[0] = Client.EVMTokenAmount({
            token: address(asset()),
            amount: totalBalance
        });

        // Prepare CCIP message
        Client.EVM2AnyMessage memory message = Client.EVM2AnyMessage({
            receiver: abi.encode(_receiver),
            data: abi.encodeWithSignature(
                "supplyAssetToAave()"
            ),
            tokenAmounts: tokenAmounts,
            extraArgs: Client._argsToBytes(
                Client.EVMExtraArgsV1({gasLimit: _gasFeeAmount})
            ),
            feeToken: i_link
        });

        // Calculate and check CCIP fees
        uint256 fee = IRouterClient(i_ccipRouter).getFee(
            _destinationChainSelector,
            message
        );

        if (fee > IERC20(i_link).balanceOf(address(this)))
            revert HyperHarvest__NotEnoughLinkBalance(
                IERC20(i_link).balanceOf(address(this)),
                fee
            );

        // Approve CCIP router to spend LINK and asset tokens
        LinkTokenInterface(i_link).approve(i_ccipRouter, fee);
        IERC20(asset()).approve(i_ccipRouter, totalBalance);

        // Send CCIP message
        messageId = IRouterClient(i_ccipRouter).ccipSend(
            _destinationChainSelector,
            message
        );

        emit LendMessageSent(
            messageId,
            totalBalance,
            _destinationChainSelector,
            _receiver,
            _gasFeeAmount
        );

        return messageId;
    }

    /**
     * @dev Withdraws from AAVE, bridges tokens to another chain, and supplies them to AAVE on that chain
     * @param _receiver The address of the receiver on the destination chain
     * @param _gasFeeAmount The amount of gas fee to be paid
     * @param _destinationChainSelector The selector of the destination chain
     */
    function withdrawBridgeAndSupplyAssetToAave(
        address _receiver,
        uint256 _gasFeeAmount,
        uint64 _destinationChainSelector
    ) public onlyAllowed(msg.sender) {
        withdrawAssetFromAave();
        bridgeAndSupplyAssetToAave(
            _receiver,
            _gasFeeAmount,
            _destinationChainSelector
        );
        emit WithdrawBridgeAndSupplied(
            _receiver,
            _gasFeeAmount,
            _destinationChainSelector
        );
    }

    /**
     * @dev Handles the reception of CCIP messages
     * @param message The CCIP message received
     */
    function _ccipReceive(
        Client.Any2EVMMessage memory message
    ) internal override nonReentrant {
        
        // Transfer received tokens to this contract
        IERC20(asset()).safeTransfer(
            address(this),
            IERC20(asset()).balanceOf(address(this))
        );

        // Execute the received message
        (bool success, ) = address(this).call(message.data);
        if (!success) revert HyperHarvest__CcipReceiveError();
    }

    /**
     * @dev Withdraws all LINK tokens from the contract
     */
    function withdrawLink() external onlyOwner {
        LinkTokenInterface(i_link).transfer(
            msg.sender,
            LinkTokenInterface(i_link).balanceOf(address(this))
        );
    }

    // ERC4626 overrides
    
    /**
     * @dev Returns the total amount of assets managed by the Protocol
     * @return The total assets
     */
    function totalAssets() public view override returns (uint256) {
        address aTokenAddr = pool.getReserveData(address(asset())).aTokenAddress;
        // Sum of assets in the contract, supplied to Aave, and on other chains
        return IERC20(asset()).balanceOf(address(this)) + 
               IERC20(aTokenAddr).balanceOf(address(this)) + 
               crossChainAssets;
    }

    /**
     * @dev Converts a given amount of assets to shares
     * @param assets The amount of assets to convert
     * @return The equivalent amount of shares
     */
    function convertToShares(uint256 assets) public view override returns (uint256) {
        uint256 supply = totalSupply();
        return supply == 0 ? assets : assets * supply / totalAssets();
    }

    /**
     * @dev Converts a given amount of shares to assets
     * @param shares The amount of shares to convert
     * @return The equivalent amount of assets
     */
    function convertToAssets(uint256 shares) public view override returns (uint256) {
        uint256 supply = totalSupply();
        return supply == 0 ? shares : shares * totalAssets() / supply;
    }
}