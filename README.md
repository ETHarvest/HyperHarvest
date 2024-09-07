# HyperHarvest: Cross-Chain Yield Aggregator 🚀

## Overview

HyperHarvest is an innovative cross-chain yield aggregator that maximizes USDC returns across Arbitrum Sepolia and Optimism Sepolia testnets. Our platform stands out through its use of private, encrypted yield optimization strategies, providing a unique competitive edge in the DeFi landscape .

## Key features:

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

## Contract Addresses

- (Arbitrum Sepolia):
[HyperHarvest Arbitrum](https://sepolia.arbiscan.io/address/0x72e9cf272dab6d97fdb48acbbe67b5b2689f9f91#code)
- (Optimism Sepolia):
[HyperHarvest Optimism](https://sepolia-optimism.etherscan.io/address/0x4cc6cc3a8dbb06e637ca78d93544ccaef2fa1954#code)

## Envio Indexer API Endpoints


## Architecture
The system consists of a single smart contract:

HyperHarvest Contract (deployed on each supported chain)

This contract interacts with AAVE lending pools on their respective chains and utilizes Chainlink's CCIP for secure inter-chain communications and transfers.
<p align="center">
  <img src="packages/HH Architecture.png" alt="Hyper Harvest Architecture" width="600" />
</p>

## Optimized Yield Aggregation
Our yield aggregator implements several strategies to maximize returns for users:

- Multi-chain Yield Comparison: Continuously monitors yield rates across supported chains.
- Dynamic Rebalancing: Automatically moves funds between chains to capture the highest yield opportunities.
- Gas-Optimized Transfers: Utilizes Chainlink's CCIP for efficient and secure cross-chain operations.
- Risk Management: Diversifies funds across multiple chains to mitigate potential risks.

## Chainlink CCIP Integration

We leverage Chainlink's Cross-Chain Interoperability Protocol (CCIP) for managing cross-chain fund transfers with industry-leading security.

## Lit Protocol Integration

We use Lit Protocol to encrypt and securely execute our private yield optimization strategies, ensuring our competitive edge remains protected.

## Envio Integration
Envio's hyperindexing capabilities allow us to process blockchain data and react to market changes in real-time, ensuring our yield calculations and event tracking are always up-to-date.

## XMTP Integration
We've developed an XMTP bot that integrates with the Converse app, allowing users to:

- Deposit and withdraw funds directly through chat commands
- Receive real-time notifications for deposits, withdrawals, cross-chain transfers, and significant yield updates

## Web3Auth Integration
Our web interface uses Web3Auth to provide a seamless onboarding experience:

- Users can log in using social accounts (Google, Farcaster, etc.)
- No need for a separate Web3 wallet
- Perform deposits and withdrawals with ease

## User Experience

HyperHarvest offers two primary ways for users to interact with the platform:

### XMTP Bot in Converse App:

- Deposit and withdraw using chat commands
- Receive real-time notifications


### Web Interface with Web3Auth:

- Log in using social accounts
- User-friendly deposit and withdraw interface
- Yield tracking and analytics

This dual approach ensures that both crypto-native users and newcomers can easily access and benefit from our yield optimization platform.

## Smart Contract Functions
[TODO: Add key smart contract functions and their descriptions]

## Future Developments

- Integration with additional DeFi protocols beyond AAVE
- Expansion to more blockchain networks
- Implementation of advanced yield optimization algorithms
- Enhanced governance features for protocol parameters


