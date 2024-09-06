# HyperHarvest Smart Contract

Our system revolves around a single smart contract, HyperHarvest.sol, which serves multiple purposes:

1. **Vault Functionality**: Handles deposits and withdrawals, minting HH shares to represent user deposits.
2. **Cross-Chain Gateway**: Acts as the entry and exit point for cross-chain messages via Chainlink's CCIP.
3. **Strategy Execution**: Interacts with Aave for yield generation and executes the yield optimization strategy.
