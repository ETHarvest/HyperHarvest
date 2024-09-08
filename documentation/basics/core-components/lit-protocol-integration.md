---
cover: >-
  https://images.unsplash.com/photo-1536374863418-41d096a7e679?crop=entropy&cs=srgb&fm=jpg&ixid=M3wxOTcwMjR8MHwxfHNlYXJjaHw0fHxsaXR8ZW58MHx8fHwxNzI1NzgyODAzfDA&ixlib=rb-4.0.3&q=85
coverY: 0
---

# 🔥 Lit Protocol Integration

### Overview

Our project leverages Lit Protocol to implement private strategies for our cross-chain yield aggregator. This integration allows us to compute over private data, determining optimal fund allocation across different chains while maintaining strategy confidentiality.

### Key Features

* **Private Strategy Computation**: We use Lit Actions to decrypt and compute private strategies.
* **Cross-Chain Yield Optimization**: The system determines the best chain for fund allocation based on current yields and transfer costs.
* **Automated Decision Making**: Our Lit Action script runs periodically to make informed decisions about fund transfers.

### Use Case

We have implemented Lit Protocol for the following purpose:

Strategy Decryption and Execution: Decrypt private strategies within Lit Actions and perform computations within lit actions based on the current market yield data on both chains , gas fees required for fund transfers and decrypted strategy parameters.

### Benefits

* **Competitive Advantage**: Private strategies give us an edge over other yield aggregators.
* **Enhanced Security**: Sensitive strategy data remains encrypted and is only decrypted within secure Lit Actions.
* **Optimized Yields**: Regular computations ensure users always get the best possible yields.
* **User Experience**: Automated decision-making provides a seamless experience for users.

### Technical Implementation

**Lit Action Implementation**

Our Strategy Executor script performs the following tasks:

* Decrypts the Encrypted private strategy data within the lit action .
* Computes current yields on different chains (e.g., Optimism Sepolia and Arbitrum Sepolia).
* Calculates total transfer costs, including CCIP and network fees.
* Lit action determines if a fund transfer would result in higher yields for users based on the decrypted strategy .
* Lit action returns the target chain and a boolean indicating whether to move funds.
* Funds get transferred from one chain to other if required according to the result returned by the Lit action.

We have implemented a simple strategy for HyperHarvest but as the number of chains and number of protocol integrations increase the complexity of the strategy would increase significantly and the exclusiveness of the strategy would give us huge competitive advantage while keeping the users aware of the events happening inside HyperHarvest using XMTP notifications for different events such as fund transfers, deposits, withdrawals etc.

The script runs every 4 hours to ensure timely decision-making and highest yield possible .

#### Integration with CCIP

Based on the Lit Action's response, we use Chainlink's Cross-Chain Interoperability Protocol (CCIP) to transfer funds between chains when beneficial.

### Code

For the detailed implementation of our Lit Protocol integration, please refer to:

* [StrategyExecutor Script](https://github.com/ETHarvest/HyperHarvest/blob/main/packages/nextjs/scripts/strategyExecutor.js)
* [Lit Action](https://github.com/ETHarvest/HyperHarvest/blob/main/packages/nextjs/utils/lit-protocol/strategyAction.js)
