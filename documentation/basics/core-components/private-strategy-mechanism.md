# Private Strategy Mechanism

Our private strategy is the secret sauce that gives our platform its edge. Here's how it works:

1. The strategy logic is encrypted and stored off-chain.
2. When needed, the encrypted strategy is sent to a Lit Action for decryption and execution.
3. The Lit Action processes current market data (yields, gas costs, etc.) using the decrypted strategy.
4. The output is a simple "move/don't move" signal or instructions on where to allocate funds.

This approach ensures that our yield optimization logic remains confidential while still being executable in a decentralized manner.