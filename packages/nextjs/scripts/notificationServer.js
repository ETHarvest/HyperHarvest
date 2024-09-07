// import fetch from 'node-fetch';
import { Client } from '@xmtp/xmtp-js';
import { Wallet } from 'ethers';
import dotenv from 'dotenv';
import { db } from './config/db.js';

dotenv.config();

class NotificationService {
  #xmtpClient;
  #db;
  #envioUrl = 'https://indexer.bigdevenergy.link/a861e6e/v1/graphql';
  #pollingInterval = 5000; // 5 sec
  lastChecked;
  constructor() {
    this.#initializeXmtpClient();
    this.#initializeDatabase();
    this.lastChecked = new Date(0).toISOString(); // Start from the beginning of time
  }

  async #initializeXmtpClient() {
    try {
      // console.log(process.env.XMTP_PRIVATE_KEY)
      const signer = new Wallet(process.env.XMTP_PRIVATE_KEY);
      console.log('Signer address:', signer.address);
      this.#xmtpClient = await Client.create(signer, { env: 'production' });
      console.log('XMTP client initialized');
    } catch (error) {
      console.error('Error initializing XMTP client:', error);
      process.exit(1);
    }
  }

  #initializeDatabase() {
    this.#db = db;
  }

  async start() {
    setInterval(this.#fetchNewEvents.bind(this), this.#pollingInterval);
    console.log('Notification service started and polling for events');
  }

  async #fetchNewEvents() {
    console.log(this.lastChecked)
    const query = `
      query {
        HyperHarvest_UserDeposited(where: { db_write_timestamp: {_gt : "${this.lastChecked}" }}) {
          id
          user
          assets
          shares
          db_write_timestamp
        }
        HyperHarvest_UserWithdrawn(where: { db_write_timestamp: {_gt : "${this.lastChecked}" }}) {
          id
          user
          assets
          shares
          db_write_timestamp
        }
        HyperHarvest_WithdrawBridgeAndSupplied(where: { db_write_timestamp: {_gt : "${this.lastChecked}" }}) {
          db_write_timestamp
          destinationChainSelector
          gasFeesAmount
          id
          receiver
        }
      }
    `;

    try {
      const response = await fetch(this.#envioUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query })
      });

      const { data } = await response.json();
      console.log(data)
      for (const deposit of data.HyperHarvest_UserDeposited) {
        await this.#sendXmtpMessage(deposit.user, `You have deposited ${deposit.assets} assets for ${deposit.shares} shares.`);
      }

      for (const withdrawal of data.HyperHarvest_UserWithdrawn) {
        await this.#sendXmtpMessage(withdrawal.user, `You have withdrawn ${withdrawal.assets} assets for ${withdrawal.shares} shares.`);
      }

      for (const bridgeSupply of data.HyperHarvest_WithdrawBridgeAndSupplied) {
        await this.#notifyAllUsers(bridgeSupply);
      }

      const allEvents = [
        ...data.HyperHarvest_UserDeposited,
        ...data.HyperHarvest_UserWithdrawn,
        ...data.HyperHarvest_WithdrawBridgeAndSupplied
      ];
      this.#updateLastChecked(allEvents);
    } catch (error) {
      console.error('Error fetching events:', error);
    }
  }
    #updateLastChecked(events) {
      if (events.length > 0) {
        this.lastChecked = events.reduce((latest, event) => {
          return event.db_write_timestamp > latest ? event.db_write_timestamp : latest;
        }, this.lastChecked);
      }
      console.log(`Updated last checked timestamp to: ${this.lastChecked}`);
    }
  async #notifyAllUsers(bridgeSupply) {
    const users = this.#db.prepare('SELECT * FROM Xmtp_user_11155420_162').all();
    const notificationMessage = `A WithdrawBridgeAndSupplied event occurred. 
      Receiver: ${bridgeSupply.receiver}
      Gas Fees: ${bridgeSupply.gasFeesAmount}
      Destination Chain Selector: ${bridgeSupply.destinationChainSelector}
      Assets have been moved to increase yield.`;

    for (const user of users) {
      await this.#sendXmtpMessage(user.address, notificationMessage);
    }
  }

  async #sendXmtpMessage(userAddress, messageContent) {
    try {
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
    }
  }

}

// Create and start the notification service
const notificationService = new NotificationService();
notificationService.start().catch((error) => {
  console.error('Fatal error in notification service:', error);
  process.exit(1);
});
