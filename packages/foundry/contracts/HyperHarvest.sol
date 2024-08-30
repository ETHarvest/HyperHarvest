// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;

import {IERC20} from "./interfaces/IERC20.sol";
import {IPoolAddressesProvider} from "./interfaces/aave/IPoolAddressesProvider.sol";
import {IPool} from "./interfaces/aave/IPool.sol";
import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";

import {IRouterClient} from "@chainlink/contracts-ccip/src/v0.8/ccip/interfaces/IRouterClient.sol";
import {Client} from "@chainlink/contracts-ccip/src/v0.8/ccip/libraries/Client.sol";
import {LinkTokenInterface} from "@chainlink/contracts/src/v0.8/shared/interfaces/LinkTokenInterface.sol";
import {CCIPReceiver} from "@chainlink/contracts-ccip/src/v0.8/ccip/applications/CCIPReceiver.sol";
import {ReentrancyGuard} from "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

error HyperHarvest__FailedToReceived();
error HyperHarvest__AmountCantBeZero();
error HyperHarvest__AddressCantBeZero();
error HyperHarvest__NotEnoughShares();
error HyperHarvest__OnlyOwnerCanCall(address caller, address owner);
error HyperHarvest__OnlyWhitelistedAddr(address caller);
error HyperHarvest__NotEnoughLinkBalance(
    uint256 currentBalance,
    uint256 calculatedFees
);
error HyperHarvest__FailedToSendEther();
error HyperHarvest__CcipReceiveError();
error HyperHarvest__LiquidityIssue();

contract HyperHarvest is ERC20, CCIPReceiver, ReentrancyGuard {
    IPoolAddressesProvider private immutable addressesProvider;
    IPool private immutable pool;
    uint256 public totalProtocolValue;
    address private owner;
    address private immutable i_link;
    uint8 private constant DECIMALS = 6;
    address public immutable i_tokenAddr;

    mapping(address => bool) public isWhitelisted;

    event SetOwner(address oldOwner, address NewOwner);
    event LendMessageSent(
        bytes32 messageId,
        address token,
        uint256 amount,
        uint64 destinationChainSelector,
        address receiver,
        uint256 gasFeeAmount
    );
    event UpdatedProtocolValue(uint256 TotalProtocolValue);
    event SuppliedToDefi(address Token, uint256 TotalTokenBalance);
    event WithdrawedFromDefi(address Token, uint256 totalAtokenBalance);
    event WithdrawBridgeAndSupplied(
        address Token,
        address Receiver,
        uint256 GasFeesAmount,
        uint64 DestinationChainSelector
    );

    modifier onlyOwner() {
        if (msg.sender != owner)
            revert HyperHarvest__OnlyOwnerCanCall(msg.sender, owner);
        _;
    }

    modifier onlyWhiteListed(address _caller) {
        if (isWhitelisted[_caller] != true)
            revert HyperHarvest__OnlyWhitelistedAddr(msg.sender);
        _;
    }

     constructor(
        address _owner,
        address _ccipRouter,
        address _link,
        address _addressProvider,
        address _tokenAddr
    ) ERC20("HyperHarvest", "CAP") CCIPReceiver(_ccipRouter) {
        owner = _owner;
        i_ccipRouter = _ccipRouter;
        i_link = _link;
        addressesProvider = IPoolAddressesProvider(_addressProvider);
        pool = IPool(addressesProvider.getPool());
        i_tokenAddr = _tokenAddr;
    }

    /**
     * @notice function to set the new owner
     * @param _owner address of the owner
     */
    function setOwner(address _owner) external onlyOwner {
        if (_owner == address(0)) revert HyperHarvest__AddressCantBeZero();
        owner = _owner;
        emit SetOwner(msg.sender, _owner);
    }

    /**
     * @notice function to set whitelisted addresses
     */
    function setWhitelist(address _whitelist) external onlyOwner {
        isWhitelisted[_whitelist] = true;
    }

    /**
     * @notice function to receive USDC from the user. User will get back protocol shares
     * @param _token address of the USDC
     * @param _amount amount to be deposited
     * @param _affiliateAddr address of the affiliate
     */
    function userDeposit(
        address _token,
        uint256 _amount,
        address _affiliateAddr
    ) external payable {
        if (_amount == 0) revert HyperHarvest__AmountCantBeZero();
        bool receiveToken = IERC20(_token).transferFrom(
            msg.sender,
            address(this),
            _amount
        );
        if (!receiveToken) revert HyperHarvest__FailedToReceived();

        uint256 sharesToMint;

        if (totalSupply() == 0) {
            // If this is the first deposit, mint 1:1 shares
            sharesToMint = _amount;
        } else {
            // Calculate shares based on the current pool size
            sharesToMint = (_amount * totalSupply()) / totalProtocolValue;
        }

        // Update the total pool size
        totalProtocolValue += _amount;

        // Mint shares to the user
        _mint(msg.sender, sharesToMint);

        (bool sent, ) = _affiliateAddr.call{value: msg.value}("");
        if (!sent) revert HyperHarvest__FailedToSendEther();
    }

    /**
     * @notice function to update the totalProtocolValue
     * @dev This function is need to be updated by beckend server
     * @param _newPoolSize new totalProtocolValue
     */
    function updateProtocolValue(
        uint256 _newPoolSize
    ) external onlyWhiteListed(msg.sender) {
        totalProtocolValue = _newPoolSize;
        emit UpdatedProtocolValue(totalProtocolValue);
    }

    /**
     * @notice function to burn our protocol shares and give user USDC
     * @param _token address of USDC
     * @param _aToken address of aUSDC
     * @param _shares amount of shares
     */
    function userWithdraw(
        address _token,
        address _aToken,
        uint256 _shares
    ) external returns (uint256) {
        if (_shares == 0) revert HyperHarvest__AmountCantBeZero();
        if (balanceOf(msg.sender) < _shares)
            revert HyperHarvest__NotEnoughShares();

        uint256 amountToWithdraw = (_shares * totalProtocolValue) /
            totalSupply();

        // Burn the user's shares
        _burn(msg.sender, _shares);

        // Update the total pool size
        totalProtocolValue -= amountToWithdraw;

        if (amountToWithdraw <= IERC20(_token).balanceOf(address(this))) {
            // Transfer USDC back to the user
            IERC20(_token).transfer(msg.sender, amountToWithdraw);
        } else if (
            amountToWithdraw <= IERC20(_aToken).balanceOf(address(this))
        ) {
            pool.withdraw(_token, amountToWithdraw, address(this));
            IERC20(_token).transfer(msg.sender, amountToWithdraw);
        } else {
            revert HyperHarvest__LiquidityIssue();
        }

        return amountToWithdraw;
    }

    /**
     * @notice function to supply Protocol USDC to the Defi protocol (currently only aave)
     * @param _token address of the token
     */
    function supplyToDefi(address _token) public {
        uint totalTokenBalance = IERC20(_token).balanceOf(address(this));

        // Approve pool to use token
        IERC20(_token).approve(address(pool), totalTokenBalance);

        // Supply to Pool onbehalf of user
        pool.supply(_token, totalTokenBalance, address(this), 0);

        emit SuppliedToDefi(_token, totalTokenBalance);
    }

    /**
     * @notice function to withdraw Protocol USDC from the Defi protocol (currently only aave)
     * @param _token address of the USDC
     * @param _aTokenAddr address of aToken / Lend Token
     */
    function withdrawFromDefi(address _token, address _aTokenAddr) public {
        uint totalAtokenBalance = IERC20(_aTokenAddr).balanceOf(address(this));
        pool.withdraw(_token, totalAtokenBalance, address(this));
        emit WithdrawedFromDefi(_token, totalAtokenBalance);
    }

    /**
     * @notice function to bridge the tokens to different chain and call the SupplyToDefi function on that chain.
     * @dev This function will work when our Protocol have token
     * @param _token address of usdc on the source chain
     * @param _destinationToken address of usdc on the destination chain
     * @param _receiver address of the receiver contract address (HyperHarvestGateway)
     * @param _gasFeeAmount gas required to execute this function
     * @param _destinationChainSelector ccip-chain ID of destination chain
     * NOTES: need onlyWhiteListed() address can call
     */
    function bridgeAndSupplyToDefi(
        address _token,
        address _destinationToken,
        address _receiver,
        uint256 _gasFeeAmount,
        uint64 _destinationChainSelector
    ) public returns (bytes32 messageId) {
        // get the balance of USDC in this protocol
        uint256 totalBalance = getContractErc20Balance(_token);

        // Create an EVM2AnyMessage struct in memory
        Client.EVMTokenAmount[] memory tokenAmounts = getTokenAmountMessage(
            _token,
            totalBalance
        );

        // create client message
        Client.EVM2AnyMessage memory message = Client.EVM2AnyMessage({
            receiver: abi.encode(_receiver),
            data: abi.encodeWithSignature(
                "supplyToDefi(address)",
                _destinationToken
            ),
            tokenAmounts: tokenAmounts,
            extraArgs: Client._argsToBytes(
                Client.EVMExtraArgsV1({gasLimit: _gasFeeAmount})
            ),
            feeToken: i_link
        });

        // calculate fees
        uint256 fee = IRouterClient(i_ccipRouter).getFee(
            _destinationChainSelector,
            message
        );

        if (fee > IERC20(i_link).balanceOf(address(this)))
            revert HyperHarvest__NotEnoughLinkBalance(
                IERC20(i_link).balanceOf(address(this)),
                fee
            );

        // bytes32 messageId;

        // approve router contract to use LINK token
        LinkTokenInterface(i_link).approve(i_ccipRouter, fee);

        // approve router contract to use USDC token
        IERC20(_token).approve(i_ccipRouter, totalBalance);

        // execute the action
        messageId = IRouterClient(i_ccipRouter).ccipSend(
            _destinationChainSelector,
            message
        );

        emit LendMessageSent(
            messageId,
            _token,
            totalBalance,
            _destinationChainSelector,
            _receiver,
            _gasFeeAmount
        );

        // Return the message ID
        return messageId;
    }

    /**
     * @notice function to withdraw the tokens from AAVE protocol, bridge the tokens to different chain and call the SupplyToDefi function on that chain.
     * @dev This function will work when our selected defi Protocol have tokens
     * @param _token address of usdc on source chain
     * @param _destinationToken address of usdc on the destination chain
     * @param _receiver address of the receiver contract address (HyperHarvestGateway on destination chains)
     * @param _gasFeeAmount gas required to execute this function
     * @param _destinationChainSelector ccip-chain ID of destination chain
     * NOTES: need onlyWhiteListed() address can call
     */
    function withdrawBridgeAndSupply(
        address _token,
        address _destinationToken,
        address _receiver,
        uint256 _gasFeeAmount,
        uint64 _destinationChainSelector,
        address _aToken
    ) public {
        withdrawFromDefi(_token, _aToken);
        bridgeAndSupplyToDefi(
            _token,
            _destinationToken,
            _receiver,
            _gasFeeAmount,
            _destinationChainSelector
        );
        emit WithdrawBridgeAndSupplied(
            _token,
            _receiver,
            _gasFeeAmount,
            _destinationChainSelector
        );
    }

     function _ccipReceive(
        Client.Any2EVMMessage memory message
    ) internal override nonReentrant {
        // Transfer the received token to this contract
        IERC20(i_tokenAddr).transfer(
            address(this),
            IERC20(i_tokenAddr).balanceOf(address(this))
        );

        // Call the supplyToDefi function
        (bool success, ) = address(this).call(message.data);
        if (!success) revert HyperHarvest__CcipReceiveError();
    }

    function getTokenAmountMessage(
        address _token,
        uint256 _amount
    ) public pure returns (Client.EVMTokenAmount[] memory) {
        Client.EVMTokenAmount[]
            memory tokenAmounts = new Client.EVMTokenAmount[](1);
        tokenAmounts[0] = Client.EVMTokenAmount({
            token: _token,
            amount: _amount
        });
        return tokenAmounts;
    }

    /// @notice function to withdraw Link from the smart contract
    function WithdrawLink() external onlyOwner {
        LinkTokenInterface(i_link).transfer(
            msg.sender,
            LinkTokenInterface(i_link).balanceOf(address(this))
        );
    }

    /// @notice function to set decimal of our protocol tokens / shares
    function decimals() public pure override returns (uint8) {
        return DECIMALS;
    }

    // ----------------------------------- //
    //      GETTER FUNCTIONS               //
    // ----------------------------------  //

    ///@notice function to get the total protocol value
    function getTotalPool() external view returns (uint256) {
        return totalProtocolValue;
    }

    ///@notice function to get owner address
    function getOwnerAddr() external view returns (address) {
        return owner;
    }

    ///@notice function to get the address of CCIP Router
    function getRouterAddress() public view returns (address) {
        return i_ccipRouter;
    }

    ///@notice function to get the address of LINK Token
    function getLinkAddress() public view returns (address) {
        return i_link;
    }

    /**
     * @notice get the ERC20 token balance of the contract
     * @param _token address of the token
     */
    function getContractErc20Balance(
        address _token
    ) public view returns (uint256) {
        return IERC20(_token).balanceOf(address(this));
    }

    /**
     * @notice get the user shares
     * @param _user address of the user
     */
    function getUserShares(address _user) public view returns (uint256) {
        return balanceOf(_user);
    }

    /**
     * @notice function to get the ERC20 token balance of the user
     * @param _user address of the user
     * @param _token address of the token
     */
    function getUserErc20Balance(
        address _user,
        address _token
    ) public view returns (uint256) {
        return IERC20(_token).balanceOf(_user);
    }
}

