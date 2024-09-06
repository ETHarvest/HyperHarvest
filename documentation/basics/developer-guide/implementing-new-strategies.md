# Implementing New Strategies

To create a new yield strategy:

1. Create a new strategy contract in `contracts/strategies/`.
2. Implement the required interface (IStrategy).
3. Add the strategy to the controller in `contracts/Controller.sol`.
4. Update the Lit Action code to include logic for the new strategy.
5. Encrypt the updated strategy using Lit Protocol's encryption tools.
