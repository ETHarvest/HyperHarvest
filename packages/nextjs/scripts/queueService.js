import amqp from 'amqplib';

class QueueService {
  constructor() {
    this.connection = null;
    this.channel = null;
  }

  async connect() {
    try {
      this.connection = await amqp.connect(process.env.CLOUDAMQP_URL);
      this.channel = await this.connection.createChannel();
      console.log('Connected to CloudAMQP');
    } catch (error) {
      console.error('Error connecting to CloudAMQP:', error);
      throw error;
    }
  }

  async publishMessage(queue, message) {
    if (!this.channel) {
      throw new Error('Channel not initialized');
    }
    await this.channel.assertQueue(queue, { durable: true });
    this.channel.sendToQueue(queue, Buffer.from(JSON.stringify(message)), { persistent: true });
  }

  async consumeMessages(queue, callback) {
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
          this.channel.ack(msg);
        } catch (error) {
          console.error('Error processing message:', error);
          this.channel.nack(msg, false, true);
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