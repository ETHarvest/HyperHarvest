---
cover: >-
  https://images.unsplash.com/photo-1586863065451-6a82fa7e81b9?crop=entropy&cs=srgb&fm=jpg&ixid=M3wxOTcwMjR8MHwxfHNlYXJjaHw0fHx1c2VyJTIwZXhwZXJpZW5jZXxlbnwwfHx8fDE3MjU3ODMxNTV8MA&ixlib=rb-4.0.3&q=85
coverY: 0
---

# 🕸️ Web3 Auth Integration

Our dApp integrates the Web3Auth MPC Core Kit SDK to simplify non-custodial wallet creation, streamlining the onboarding process. With Google Sign-In and custom JWT authentication, users can connect using existing credentials, eliminating the complexities of web3 interaction. This allows them to seamlessly perform key actions such as deposits and withdrawals.

### Key Features:

* **Custom Google Authentication**: Users log in with their Google accounts, and wallet creation happens automatically in the background using Web3Auth MPC-TSS. No additional setup is required.
* **Flexible JWT Flow**: Users can authenticate using either Google or Farcaster (pending full integration), with the option to switch between them, enhancing security and control.
* **Automatic Wallet Generation**: Web3 wallets are generated during the login process, giving users immediate access to features like token transfers without additional steps. Core Technical Execution:
* **MPC-TSS Integration**: We leverage Multi-Party Computation Threshold Signature Scheme (MPC-TSS) for secure key management, completely abstracted from the user.
* **Smart Contract Interaction**: Users can perform transactions, like deposits or withdrawals, by interacting with AAVE and Chainlink-powered vaults using Web3Auth-generated wallets. This includes on-chain actions on Arbitrum and Optimism.
* **Persistent User Sessions**: Using JWTs, we enable continuous user sessions, reducing the need for repeated logins. Data is locally stored for a smooth experience during future logins.

### How It Works:

* Login: Users sign in with Google, triggering a custom JWT process via Web3Auth MPC Core Kit SDK.
* Wallets are automatically created during login.
* Transactions: Users can make deposits or withdrawals via their Web3Auth-generated wallet without dealing with gas fees or blockchain intricacies.
* On-Chain: Transactions like depositing USDC into vaults are facilitated via smart contracts on Arbitrum and Optimism.

### Limitations:

* Farcaster Login: The Farcaster login flow is partially integrated and remains incomplete.
* MFA Sharing: While MFA is enabled, the ability for users to share or export their MFA factor key is not yet available.

### Future Improvements:

* Complete the Farcaster login integration.
* Add functionality for users to share or export their MFA factor key across devices.
* Ensure seamless chain switching in the frontend to allow users to switch between Arbitrum and Optimism effortlessly.
