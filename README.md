# HyperHarvest: Cross-Chain Yield Aggregator 🚀

 ## 🪶 Overview 

HyperHarvest is an innovative cross-chain yield aggregator that maximizes USDC returns across Arbitrum Sepolia and Optimism Sepolia testnets. Our platform stands out through its use of private, encrypted yield optimization strategies, providing a unique competitive edge in the DeFi landscape .

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

## Envio Indexer API Endpoints 


## 🏡 Architecture 
The system consists of a single smart contract:

HyperHarvest Contract (deployed on each supported chain)

This contract interacts with AAVE lending pools on their respective chains and utilizes Chainlink's CCIP for secure inter-chain communications and transfers.
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

We leverage Chainlink's Cross-Chain Interoperability Protocol (CCIP) for managing cross-chain fund transfers with industry-leading security.

## 🔥 Lit Protocol Integration

### Overview
Our project leverages Lit Protocol to implement private strategies for our cross-chain yield aggregator. This integration allows us to compute over private data, determining optimal fund allocation across different chains while maintaining strategy confidentiality.
Key Features

Private Strategy Computation: We use Lit Actions to decrypt and compute private strategies.
Cross-Chain Yield Optimization: The system determines the best chain for fund allocation based on current yields and transfer costs.
Automated Decision Making: Our Lit Action script runs periodically to make informed decisions about fund transfers.

### Use Case
We have implemented Lit Protocol for the following purpose:

Strategy Decryption and Execution: 
Decrypt private strategies within Lit Actions and perform computations within lit actions based on the current market yield data on both chains , gas fees required for fund transfers and decrypted strategy parameters.

### Benefits

- Competitive Advantage: Private strategies give us an edge over other yield aggregators.
- Enhanced Security: Sensitive strategy data remains encrypted and is only decrypted within secure Lit Actions.
- Optimized Yields: Regular computations ensure users always get the best possible yields.
- User Experience: Automated decision-making provides a seamless experience for users.

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
[StrategyExecutor Script](https://github.com/ETHarvest/HyperHarvest/blob/main/packages/nextjs/scripts/strategyExecutor.js)

## 💬 XMTP Integration

### Overview

Our project leverages XMTP (Extensible Message Transport Protocol) to enhance user interaction and provide seamless access to our cross-chain yield aggregator protocol. By integrating XMTP, we've created a user-friendly interface that allows users to interact with our protocol through a messaging app, making it more accessible and convenient.

### Key Features

1. **XMTP Bot**: We've developed a bot using the XMTP Message Kit, enabling users to interact with our protocol through the Converse app.
2. **Conversational Interface**: Users can have direct conversations with the bot to perform various actions.
3. **Asset Management**: Users can deposit assets to and withdraw yields from our cross-chain yield aggregator.
4. **Notification Service**: XMTP is used to send real-time notifications about yield changes, deposits, and withdrawals.

### User Interactions

Users can perform the following actions through the XMTP bot:

1. Engage in conversations with the bot
2. Deposit assets to the cross-chain yield aggregator
3. Withdraw their accumulated yield

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

1. **Real-time Data Indexing**: We use HyperIndex to index smart contract data in real-time.
2. **High-Performance API**: HyperIndex allows us to build a real-time API for our blockchain application quickly and efficiently.
3. **Seamless Integration**: The indexed data is seamlessly integrated into our application, enhancing its functionality and user experience.

### Use Cases

We have implemented Envio's HyperIndex for the following purposes:

1. **Aave Contract Indexing**: We index Aave contracts to monitor real-time liquidity changes in Aave.
2. **HyperHarvest Contract Indexing**: We index our HyperHarvest contract to power a real-time notification system, which works in conjunction with XMTP.

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

1. Subgraph 1: [https://indexer.bigdevenergy.link/93d433c/v1/graphql](https://indexer.bigdevenergy.link/93d433c/v1/graphql)
2. Subgraph 2: [https://indexer.bigdevenergy.link/a861e6e/v1/graphql](https://indexer.bigdevenergy.link/a861e6e/v1/graphql)

These subgraphs serve as the backbone for our data querying and retrieval system, allowing us to efficiently access indexed blockchain data.

### Integration with XMTP

The Envio integration complements our XMTP implementation by providing the backend data infrastructure needed for real-time notifications and updates. When significant events occur (such as liquidity changes in Aave or updates in our HyperHarvest contract), the Envio-indexed data triggers notifications that are then sent to users via the XMTP messaging system.

### Conclusion

By integrating Envio's HyperIndex into our project, we've significantly enhanced our ability to provide real-time, accurate blockchain data to our users. This integration works hand-in-hand with our XMTP implementation to create a responsive, informative, and user-friendly application that keeps users updated on critical changes and events in real-time.



## 🕸️ Web3Auth MPC Core Kit Integration

Our dApp integrates the Web3Auth MPC Core Kit SDK to simplify non-custodial wallet creation, streamlining the onboarding process. With Google Sign-In and custom JWT authentication, users can connect using existing credentials, eliminating the complexities of web3 interaction. This allows them to seamlessly perform key actions such as deposits and withdrawals.

### Key Features:

- Custom Google Authentication: Users log in with their Google accounts, and wallet creation happens automatically in the background using Web3Auth MPC-TSS. No additional setup is required.
- Flexible JWT Flow: Users can authenticate using either Google or Farcaster (pending full integration), with the option to switch between them, enhancing security and control.
- Automatic Wallet Generation: Web3 wallets are generated during the login process, giving users immediate access to features like token transfers without additional steps.
Core Technical Execution:
- MPC-TSS Integration: We leverage Multi-Party Computation Threshold Signature Scheme (MPC-TSS) for secure key management, completely abstracted from the user.
- Smart Contract Interaction: Users can perform transactions, like deposits or withdrawals, by interacting with AAVE and Chainlink-powered vaults using Web3Auth-generated wallets. This includes on-chain actions on Arbitrum and Optimism.
- Persistent User Sessions: Using JWTs, we enable continuous user sessions, reducing the need for repeated logins. Data is locally stored for a smooth experience during future logins.

### How It Works:

- Login: Users sign in with Google, triggering a custom JWT process via Web3Auth MPC Core Kit SDK.
- Wallets are automatically created during login.
- Transactions: Users can make deposits or withdrawals via their Web3Auth-generated wallet without dealing with gas fees or blockchain intricacies.
- On-Chain: Transactions like depositing USDC into vaults are facilitated via smart contracts on Arbitrum and Optimism.

### Limitations:

- Farcaster Login: The Farcaster login flow is partially integrated and remains incomplete.
- MFA Sharing: While MFA is enabled, the ability for users to share or export their MFA factor key is not yet available.

### Future Improvements:

- Complete the Farcaster login integration.
- Add functionality for users to share or export their MFA factor key across devices.
- Ensure seamless chain switching in the frontend to allow users to switch between Arbitrum and Optimism effortlessly.

## 🙂 User Experience

HyperHarvest offers two primary ways for users to interact with the platform:

### XMTP Bot in Converse App:

- Deposit and withdraw using chat commands
- Receive real-time notifications


### Web Interface with Web3Auth:

- Log in using social accounts
- User-friendly deposit and withdraw interface
- Yield tracking and analytics

This dual approach ensures that both crypto-native users and newcomers can easily access and benefit from our yield optimization platform.

## 🧮 Smart Contract Functions
[TODO: Add key smart contract functions and their descriptions]

## 🔮 Future Developments

- Integration with additional DeFi protocols beyond AAVE
- Expansion to more blockchain networks
- Implementation of advanced yield optimization algorithms
- Enhanced governance features for protocol parameters


