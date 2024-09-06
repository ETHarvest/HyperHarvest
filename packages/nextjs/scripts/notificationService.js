import { Client } from '@xmtp/xmtp-js';
import { queueService } from './queueService';
import { Wallet } from 'ethers';
import dotenv from 'dotenv';

dotenv.config();

class NotificationService {
  #xmtpClient;
  #hexPrivateKey;

  constructor() {
    this.#hexPrivateKey = `0x${process.env.XMTP_PRIVATE_KEY}`;
    console.log(this.#hexPrivateKey)
    this.#initializeXmtpClient();
  }

  async #initializeXmtpClient() {
    try {
      const signer = new Wallet(process.env.XMTP_PRIVATE_KEY);
      this.#xmtpClient = await Client.create(signer, { env: 'production' });
      console.log('XMTP client initialized');
    } catch (error) {
      console.error('Error initializing XMTP client:', error);
      process.exit(1);
    }
  }

  async start() {
    try {
      await queueService.connect();
      console.log('Connected to CloudAMQP');

      await queueService.consumeMessages('blockchain-events', this.#handleMessage.bind(this));
      console.log('Notification service started and listening for messages');
    } catch (error) {
      console.error('Error starting notification service:', error);
      process.exit(1);
    }
  }

  async #handleMessage(message) {
    console.log('Received message:', message);

    try {
      switch (message.type) {
        case 'UserDeposited':
          await this.#sendXmtpMessage(message.user, `You have deposited ${message.assets} assets.`);
          break;
        case 'UserWithdrawn':
          await this.#sendXmtpMessage(message.user, `You have withdrawn ${message.assets} assets.`);
          break;
        case 'WithdrawBridgeAndSupplied':
          await this.#sendXmtpMessage(message.receiver, `Your withdraw and bridge operation is complete. Gas fees: ${message.gasFeesAmount}`);
          break;
        default:
          console.log(`Unknown event type: ${message.type}`);
      }
    } catch (error) {
      console.error('Error processing message:', error);
      throw error; // Rethrow to allow message to be nacked and requeued
    }
  }

  async #sendXmtpMessage(userAddress, messageContent) {
    try {
      // Check if the recipient address is XMTP enabled
      const canMessage = await this.#xmtpClient.canMessage(userAddress);
      if (!canMessage) {
        console.log(`User ${userAddress} is not XMTP enabled. Skipping message.`);
        return;
      }

      const conversation = await this.#xmtpClient.conversations.newConversation(userAddress);
      await conversation.send(messageContent);
      console.log(`Message sent to ${userAddress}: ${messageContent}`);
    } catch (error) {
      console.error(`Error sending XMTP message to ${userAddress}:`, error);
      throw error; // Rethrow to allow message to be nacked and requeued
    }
  }

  // New method to demonstrate XMTP message bot interaction
  async testXmtpMessageBot() {
    const WALLET_TO = "0x937C0d4a6294cdfa575de17382c7076b579DC176"; // gm.xmtp.eth
    const isOnProdNetwork = await this.#xmtpClient.canMessage(WALLET_TO);
    console.log("Can message: " + isOnProdNetwork);

    if (isOnProdNetwork) {
      await this.#sendXmtpMessage(WALLET_TO, "Hello, XMTP message bot!");
    }
  }
}

// Create and start the notification service
const notificationService = new NotificationService();
notificationService.start().catch((error) => {
  console.error('Fatal error in notification service:', error);
  process.exit(1);
});
