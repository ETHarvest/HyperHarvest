# HyperHarvest: Cross-Chain Yield Aggregator 🚀

<p align="center">
  <img src="packages/HH-modified.png" alt="HyperHarvest Logo" width="200" />
</p>

 ## 🪶 Overview 

HyperHarvest is an innovative cross-chain yield aggregator that maximizes USDC returns across Arbitrum Sepolia and Optimism Sepolia testnets. Our platform stands out through its use of private, encrypted yield optimization strategies, providing a unique competitive edge in the DeFi landscape .

Start Harvesting : [HyperHarvest](https://hyperharvest.vercel.app/) \
XMTP Bot (Converse App) : [0x1E7a0E69B39c2A2f7d0D6a0cF4A1D4fCaD8f04ED](0x1E7a0E69B39c2A2f7d0D6a0cF4A1D4fCaD8f04ED)\
Docs : [HyperHarvest Documentation](https://eth-harvest.gitbook.io/hyperharvest)

## ✏️ Key features 

- Deposit USDC on Arbitrum Sepolia or Optimism Sepolia using our webApp or using XMTP bot in converse
- Earn optimized yield through AAVE lending protocols across multiple chains
- Private strategies for enhanced performance and reduced front-running using Lit Protocol
- Automated yield rebalancing for maximum returns
- Secure cross-chain operations via Chainlink's CCIP
- Hyper-responsive yield optimization and event tracking using Envio
- Dual interface: Web3Auth-enabled web app and XMTP bot in Converse app
- Rapid indexing of Aave pool data for real-time yield calculations
- Indexing HyperHarvest contract events to trigger user notifications

While our strategies remain private, we prioritize transparency through real-time XMTP bot notifications for all significant events, including:

- Deposits and withdrawals
- Cross-chain fund transfers
- Yield updates

By combining cutting-edge technology with user-centric design, HyperHarvest offers a secure, efficient, and user-friendly platform for optimizing USDC yields across multiple blockchain networks.

## 🛂 Contract Addresses 

- (Arbitrum Sepolia):
[HyperHarvest Arbitrum](https://sepolia.arbiscan.io/address/0x72e9cf272dab6d97fdb48acbbe67b5b2689f9f91#code)
- (Optimism Sepolia):
[HyperHarvest Optimism](https://sepolia-optimism.etherscan.io/address/0x4cc6cc3a8dbb06e637ca78d93544ccaef2fa1954#code)

## 📇 Envio Indexers 

- [Aave pool indexer](https://envio.dev/app/vasugupta153/envio-indexer/8d0c19e/playground)
- [HyperHarvest Contract Indexer](https://envio.dev/app/vasugupta153/envio-indexer-2/556bce7/playground)

## 🏡 Architecture 
The system consists of a single smart contract:

HyperHarvest Contract (deployed on each supported chain)

This contract interacts with AAVE lending pools on their respective chains and utilizes Chainlink's CCIP for secure inter-chain communications and transfers.

Whole architecture of HyperHarvest :
<p align="center">
  <img src="packages/HH Architecture.png" alt="Hyper Harvest Architecture" width="800" />
</p>

## 📀 Optimized Yield Aggregation 
Our yield aggregator implements several strategies to maximize returns for users:

- Multi-chain Yield Comparison: Continuously monitors yield rates across supported chains.
- Dynamic Rebalancing: Automatically moves funds between chains to capture the highest yield opportunities.
- Gas-Optimized Transfers: Utilizes Chainlink's CCIP for efficient and secure cross-chain operations.
- Risk Management: Diversifies funds across multiple chains to mitigate potential risks.

## 🟦 Chainlink CCIP Integration

### Overview
Our project utilizes Chainlink's Cross-Chain Interoperability Protocol (CCIP) to enable seamless transfer of USDC funds between different blockchain networks. The HyperHarvest contract serves as both a vault and a gateway for receiving CCIP messages and funds.

### Key Features

- **Cross-Chain Fund Transfer**: Ability to move USDC funds between different blockchain networks.
- **Integrated Vault Functionality**: HyperHarvest contract acts as a vault for storing user funds.
- **CCIP Message Handling**: Built-in capability to process incoming CCIP messages and funds.

### Technical Implementation
#### CCIP Router Integration
The contract inherits from CCIPReceiver, which provides the necessary functionality to interact with the CCIP router:
```
contract HyperHarvest is ERC4626, CCIPReceiver, ReentrancyGuard {
    // ...
}
```
#### Cross-Chain Asset Transfer
The bridgeAndSupplyAssetToAave function prepares and sends CCIP messages to transfer assets:
```
function bridgeAndSupplyAssetToAave(
    address _receiver,
    uint256 _gasFeeAmount,
    uint64 _destinationChainSelector
) public onlyAllowed(msg.sender) returns (bytes32 messageId) {
    // ... (Function implementation)
}
```
#### CCIP Message Reception
The _ccipReceive function handles incoming CCIP messages:
```
function _ccipReceive(
    Client.Any2EVMMessage memory message
) internal override nonReentrant {
    // ... (Function implementation)
}
```
### Benefits

- **Interoperability**: Enables seamless movement of funds across different blockchain networks.
- **Enhanced Yield Opportunities**: Allows users to access yield opportunities on multiple chains.
- **Automated Cross-Chain Operations**: Facilitates automated fund transfers and yield farming across chains.

## 🔥 Lit Protocol Integration

### Overview
Our project leverages Lit Protocol to implement private strategies for our cross-chain yield aggregator. This integration allows us to compute over private data, determining optimal fund allocation across different chains while maintaining strategy confidentiality.

### Key Features

- **Private Strategy Computation**: We use Lit Actions to decrypt and compute private strategies.
- **Cross-Chain Yield Optimization**: The system determines the best chain for fund allocation based on current yields and transfer costs.
- **Automated Decision Making**: Our Lit Action script runs periodically to make informed decisions about fund transfers.

### Use Case
We have implemented Lit Protocol for the following purpose:

Strategy Decryption and Execution: 
Decrypt private strategies within Lit Actions and perform computations within lit actions based on the current market yield data on both chains , gas fees required for fund transfers and decrypted strategy parameters.

### Benefits

- **Competitive Advantage**: Private strategies give us an edge over other yield aggregators.
- **Enhanced Security**: Sensitive strategy data remains encrypted and is only decrypted within secure Lit Actions.
- **Optimized Yields**: Regular computations ensure users always get the best possible yields.
- **User Experience**: Automated decision-making provides a seamless experience for users.

### Technical Implementation

#### Lit Action Implementation
Our Strategy Executor script performs the following tasks:

- Decrypts the Encrypted private strategy data within the lit action .
- Computes current yields on different chains (e.g., Optimism Sepolia and Arbitrum Sepolia).
- Calculates total transfer costs, including CCIP and network fees.
- Lit action determines if a fund transfer would result in higher yields for users based on the decrypted strategy .
- Lit action returns the target chain and a boolean indicating whether to move funds.
- Funds get transferred from one chain to other if required according to the result returned by the Lit action.

We have implemented a simple strategy for HyperHarvest but as the number of chains and number of protocol integrations increase the complexity of the strategy would increase significantly and the exclusiveness of the strategy would give us huge competitive advantage while keeping the users aware of the events happening inside HyperHarvest using XMTP notifications for different events such as fund transfers, deposits, withdrawals etc.

The script runs every 4 hours to ensure timely decision-making and highest yield possible .

### Integration with CCIP
Based on the Lit Action's response, we use Chainlink's Cross-Chain Interoperability Protocol (CCIP) to transfer funds between chains when beneficial.

### Code 
For the detailed implementation of our Lit Protocol integration, please refer to:

- [StrategyExecutor Script](https://github.com/ETHarvest/HyperHarvest/blob/main/packages/nextjs/scripts/strategyExecutor.js)
- [Lit Action](https://github.com/ETHarvest/HyperHarvest/blob/main/packages/nextjs/utils/lit-protocol/strategyAction.js)

## 💬 XMTP Integration

### Overview

Our project leverages XMTP (Extensible Message Transport Protocol) to enhance user interaction and provide seamless access to our cross-chain yield aggregator protocol. By integrating XMTP, we've created a user-friendly interface that allows users to interact with our protocol through a messaging app, making it more accessible and convenient.

### Key Features

- **XMTP Bot**: We've developed a bot using the XMTP Message Kit, enabling users to interact with our protocol through the Converse app.
- **Conversational Interface**: Users can have direct conversations with the bot to perform various actions.
- **Asset Management**: Users can deposit assets to and withdraw yields from our cross-chain yield aggregator.
- **Notification Service**: XMTP is used to send real-time notifications about yield changes, deposits, and withdrawals.

### User Interactions

Users can perform the following actions through the XMTP bot:

- Engage in conversations with the bot
- Deposit assets to the cross-chain yield aggregator
- Withdraw their accumulated yield

### Benefits

- **Enhanced Accessibility**: Users can interact with our protocol easily through their mobile devices using the Converse app.
- **Real-time Updates**: Notifications keep users informed about important events and changes in their investments.
- **Simplified User Experience**: The conversational interface makes complex operations more intuitive and user-friendly.

### Technical Implementation

#### Bot Creation
We utilized the Message Kit provided by XMTP to create our bot. The Message Kit simplifies the process of building messaging applications on the XMTP network.

**Resource**: [XMTP Message Kit](https://message-kit.vercel.app/)

#### Command Implementation
We implemented specific commands for deposit and withdrawal operations, allowing users to manage their assets through simple text commands.

#### Transaction Processing
To handle transactions securely and efficiently, we integrated OpenFrames, which provides a framework for creating and processing blockchain transactions within the XMTP ecosystem.

**Resource**: [XMTP Open Frames Documentation](https://docs.xmtp.org/open-frames/open-frames)

#### AI Agent Integration
To enhance the user experience and provide more intelligent interactions, we incorporated an AI agent into our XMTP bot. This allows for more natural language processing and context-aware responses.

### Conclusion

By integrating XMTP into our project, we've created a more accessible and user-friendly interface for our cross-chain yield aggregator. This integration allows users to manage their assets, receive important notifications, and interact with our protocol seamlessly through a messaging app, significantly lowering the barrier to entry for blockchain-based financial services.


## 📅 Envio Integration

### Overview

Our project utilizes Envio's HyperIndex to efficiently index blockchain data and serve it to our application. HyperIndex is designed to deliver superior performance and provide a seamless developer experience, which in turn optimizes the user experience of our application.

### Key Features

- **Real-time Data Indexing**: We use HyperIndex to index smart contract data in real-time.
- **High-Performance API**: HyperIndex allows us to build a real-time API for our blockchain application quickly and efficiently.
- **Seamless Integration**: The indexed data is seamlessly integrated into our application, enhancing its functionality and user experience.

### Use Cases

We have implemented Envio's HyperIndex for the following purposes:

- **Aave Contract Indexing**: We index Aave contracts to monitor real-time liquidity changes in Aave.
- **HyperHarvest Contract Indexing**: We index our HyperHarvest contract to power a real-time notification system, which works in conjunction with XMTP.

### Benefits

- **Enhanced Performance**: HyperIndex optimizes data retrieval, leading to faster and more responsive application behavior.
- **Real-time Updates**: Our application can provide users with up-to-the-minute information on liquidity and other critical data points.
- **Improved User Experience**: The combination of real-time data and efficient indexing results in a smoother, more informative user interface.

### Technical Implementation

#### Setup and Indexing

We followed Envio's quick and easy guide to set up and index the contracts:

**Resource**: [Envio HyperIndex Documentation](https://docs.envio.dev/docs/HyperIndex/overview)

#### Subgraph Deployment

We have deployed two subgraphs as part of our Envio integration:

1. Aave yield API: [https://indexer.bigdevenergy.link/93d433c/v1/graphql](https://indexer.bigdevenergy.link/93d433c/v1/graphql)
2. HyperHarvest Notifications API: [https://indexer.bigdevenergy.link/a861e6e/v1/graphql](https://indexer.bigdevenergy.link/a861e6e/v1/graphql)

These subgraphs serve as the backbone for our data querying and retrieval system, allowing us to efficiently access indexed blockchain data.

### Integration with XMTP

The Envio integration complements our XMTP implementation by providing the backend data infrastructure needed for real-time notifications and updates. When significant events occur (such as liquidity changes in Aave or updates in our HyperHarvest contract), the Envio-indexed data triggers notifications that are then sent to users via the XMTP messaging system.

### Conclusion

By integrating Envio's HyperIndex into our project, we've significantly enhanced our ability to provide real-time, accurate blockchain data to our users. This integration works hand-in-hand with our XMTP implementation to create a responsive, informative, and user-friendly application that keeps users updated on critical changes and events in real-time.



## 🕸️ Web3Auth MPC Core Kit Integration

Our dApp integrates the Web3Auth [Web3Auth MPC Core Kit SDK](https://github.com/ETHarvest/HyperHarvest/blob/main/packages/nextjs/helpers/web3Auth.ts#L9) to simplify non-custodial wallet creation, streamlining the onboarding process. With [Google Sign-In](https://github.com/ETHarvest/HyperHarvest/blob/main/packages/nextjs/context/Web3Context.tsx#L99) and [custom JWT authentication](https://github.com/ETHarvest/HyperHarvest/blob/main/packages/nextjs/context/Web3Context.tsx#L111), users can connect using existing credentials, eliminating the complexities of web3 interaction. This allows them to seamlessly perform key actions such as [deposits](https://github.com/ETHarvest/HyperHarvest/blob/main/packages/nextjs/components/hyperharvest/Harvest.tsx#L70) and [withdrawals](https://github.com/ETHarvest/HyperHarvest/blob/main/packages/nextjs/components/hyperharvest/Harvest.tsx#L88).

### Key Features:

- [**Custom Google Authentication**](https://github.com/ETHarvest/HyperHarvest/blob/main/packages/nextjs/context/Web3Context.tsx#L99): Users log in with their Google accounts, and wallet creation happens automatically in the background using Web3Auth MPC-TSS. No additional setup is required.
- [**Flexible JWT Flow**](https://github.com/ETHarvest/HyperHarvest/blob/main/packages/nextjs/context/Web3Context.tsx#L111): Users can authenticate using either Google or Farcaster (pending full integration), with the option to switch between them, enhancing security and control.
- **Automatic Wallet Generation**: Web3 wallets are generated during the login process, giving users immediate access to features like token transfers without additional steps.
Core Technical Execution:
- [**MPC-TSS Integration**](https://github.com/ETHarvest/HyperHarvest/blob/main/packages/nextjs/helpers/web3Auth.ts#L9): We leverage Multi-Party Computation Threshold Signature Scheme (MPC-TSS) for secure key management, completely abstracted from the user.
- [**Smart Contract Interaction**](https://github.com/ETHarvest/HyperHarvest/blob/main/packages/nextjs/utils/contract.ts#L11): Users can perform transactions, like deposits or withdrawals, by interacting with AAVE and Chainlink-powered vaults using Web3Auth-generated wallets. This includes on-chain actions on Arbitrum and Optimism.
- [**Persistent User Sessions**]()https://github.com/ETHarvest/HyperHarvest/blob/main/packages/nextjs/context/Web3Context.tsx#L53: Using JWTs, we enable continuous user sessions, reducing the need for repeated logins. Data is locally stored for a smooth experience during future logins.

### How It Works:

- Login: Users sign in with Google, triggering a custom JWT process via Web3Auth MPC Core Kit SDK.
- Wallets are automatically created during login.
- Transactions: Users can make deposits or withdrawals via their Web3Auth-generated wallet without dealing with gas fees or blockchain intricacies.
- On-Chain: Transactions like depositing USDC into vaults are facilitated via smart contracts on Arbitrum and Optimism.

### Limitations:

- Farcaster Login: The Farcaster login flow is partially integrated and remains incomplete.
- [MFA Sharing](https://github.com/ETHarvest/HyperHarvest/blob/main/packages/nextjs/app/settings/page.tsx#L38): While MFA is enabled, the ability for users to share or export their MFA factor key is not yet available.

### Future Improvements:

- Complete the Farcaster login integration.
- Add functionality for users to share or export their MFA factor key across devices.
- Ensure seamless chain switching in the frontend to allow users to switch between Arbitrum and Optimism effortlessly.

## 🙂 User Experience

HyperHarvest offers two primary ways for users to interact with the platform:

### XMTP Bot in Converse App:

- Deposit and withdraw using chat commands 
- Receive real-time notifications for user deposits, user withdrawal, Cross chain fund transfer and yield updates .

### Web Interface with Web3Auth:

- Log in using social accounts
- User-friendly deposit and withdraw interface
- Yield tracking and analytics

This dual approach ensures that both crypto-native users and newcomers can easily access and benefit from our yield optimization platform.

## 🧮 Smart Contract Functions

- `userDeposit`
Allows users to deposit assets into the contract.
Mints shares to represent the user's deposit.

- `userWithdraw`
Enables users to withdraw assets from the contract.
Burns shares and returns the corresponding assets to the user.

- `supplyAssetToAave`
Supplies the contract's token balance to Aave for yield generation.

- `withdrawAssetFromAave`
Withdraws all supplied tokens from Aave back to the contract.

- `bridgeAndSupplyAssetToAave`
Bridges tokens to another chain and supplies them to Aave on that chain.
Prepares and sends a CCIP message for cross-chain transfer.

- `withdrawBridgeAndSupplyAssetToAave`
Combines withdrawal from Aave, bridging to another chain, and supplying to Aave on the destination chain.

- `_ccipReceive`
Handles the reception of CCIP messages.
Transfers received tokens to the contract and executes the received message.

- `totalAssets`
Calculates the total amount of assets managed by the protocol.
Includes assets in the contract, supplied to Aave, and on other chains.

- `convertToShares` and `convertToAssets`
Utility functions for converting between asset amounts and share amounts.

- `setOwner` and `setAllowance`
Administrative functions to manage contract ownership and allowed addresses.

These functions collectively enable the core functionality of the HyperHarvest contract, including user deposits and withdrawals, cross-chain asset transfers, yield farming with Aave, and overall asset management.

## 🔮 Future Developments

- Integration with additional DeFi protocols beyond AAVE
- Expansion to more blockchain networks
- Implementation of advanced yield optimization strategies and algorithms
- Enhanced governance features for protocol parameters



## Requirements

Before you begin, you need to install the following tools:

- [Node (>= v18.17)](https://nodejs.org/en/download/)
- Yarn ([v1](https://classic.yarnpkg.com/en/docs/install/) or [v2+](https://yarnpkg.com/getting-started/install))
- [Git](https://git-scm.com/downloads)


## Quickstart

To get started with HyperHarvest, follow the steps below:

1. **Clone this repo & install dependencies**

   ```
   git clone https://github.com/ETHarvest/HyperHarvest.git
   cd HyperHarvest
   yarn install
   ```

2. **Start your NextJS app**
  ```
  yarn start
  ```


Visit http://localhost:3000. to interact with the app. Adjust the app configuration in packages/nextjs/helpers/config.ts


## Contributing to HyperHarvest

We welcome contributions to HyperHarvest!

Please see [CONTRIBUTING.MD](https://github.com/ETHarvest/HyperHarvest/blob/main/CONTRIBUTING.md) for more information and guidelines for contributing to HyperHarvest.

