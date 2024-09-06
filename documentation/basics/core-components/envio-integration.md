# Envio Integration

Envio is a key component that enables real-time data processing and event tracking:

1. **Aave Data Indexing**: We use Envio to index Aave contract data, allowing us to calculate the latest yield rates with minimal delay.
2. **HyperHarvest Event Tracking**: Envio indexes events from our HyperHarvest contract, including deposits, withdrawals, and cross-chain transfers.
3. **Notification Triggering**: The indexed data is used to trigger XMTP notifications, ensuring users are promptly informed of important events.
