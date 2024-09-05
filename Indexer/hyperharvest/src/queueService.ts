import amqp, { Channel, Connection } from 'amqplib';
import dotenv from 'dotenv';

dotenv.config();

class QueueService {
  private connection: Connection | null = null;
  private channel: Channel | null = null;

  async connect() {
    try {
      this.connection = await amqp.connect(process.env.CLOUDAMQP_URL!);
      this.channel = await this.connection.createChannel();
      console.log('Connected to CloudAMQP');
    } catch (error) {
      console.error('Error connecting to CloudAMQP:', error);
      throw error;
    }
  }

  async publishMessage(queue: string, message: any) {
    if (!this.channel) {
      throw new Error('Channel not initialized');
    }
    await this.channel.assertQueue(queue, { durable: true });
    this.channel.sendToQueue(queue, Buffer.from(JSON.stringify(message)), { persistent: true });
  }

  async consumeMessages(queue: string, callback: (message: any) => Promise<void>) {
    if (!this.channel) {
      throw new Error('Channel not initialized');
    }
    await this.channel.assertQueue(queue, { durable: true });
    this.channel.prefetch(1);
    this.channel.consume(queue, async (msg) => {
      if (msg) {
        const content = JSON.parse(msg.content.toString());
        try {
          await callback(content);
          this.channel!.ack(msg);
        } catch (error) {
          console.error('Error processing message:', error);
          this.channel!.nack(msg, false, true);
        }
      }
    });
  }

  async closeConnection() {
    if (this.channel) await this.channel.close();
    if (this.connection) await this.connection.close();
  }
}

export const queueService = new QueueService();