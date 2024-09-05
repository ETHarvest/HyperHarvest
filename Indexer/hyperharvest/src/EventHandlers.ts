import {
  HyperHarvest,
  HyperHarvest_UserDeposited,
  HyperHarvest_UserWithdrawn,
  HyperHarvest_WithdrawBridgeAndSupplied,
} from "generated";
import { queueService } from './queueService';

// Ensure the queue service is connected before processing events
let queueConnected = false;

async function ensureQueueConnection() {
  // console.log('hi')
  if (!queueConnected) {
    await queueService.connect();
    queueConnected = true;
  }
}

HyperHarvest.UserDeposited.handler(async ({ event, context }) => {
  const entity: HyperHarvest_UserDeposited = {
    id: `${event.chainId}_${event.block.number}_${event.logIndex}`,
    user: event.params.user,
    assets: event.params.assets,
    shares: event.params.shares,
  };

  context.HyperHarvest_UserDeposited.set(entity);

  // Publish event to CloudAMQP
  await ensureQueueConnection();
  await queueService.publishMessage('blockchain-events', {
    type: 'UserDeposited',
    user: event.params.user,
    assets: event.params.assets.toString(),
    shares: event.params.shares.toString(),
  });
});

HyperHarvest.UserWithdrawn.handler(async ({ event, context }) => {
  const entity: HyperHarvest_UserWithdrawn = {
    id: `${event.chainId}_${event.block.number}_${event.logIndex}`,
    user: event.params.user,
    assets: event.params.assets,
    shares: event.params.shares,
  };

  context.HyperHarvest_UserWithdrawn.set(entity);

  // Publish event to CloudAMQP
  await ensureQueueConnection();
  await queueService.publishMessage('blockchain-events', {
    type: 'UserWithdrawn',
    user: event.params.user,
    assets: event.params.assets.toString(),
    shares: event.params.shares.toString(),
  });
});

HyperHarvest.WithdrawBridgeAndSupplied.handler(async ({ event, context }) => {
  const entity: HyperHarvest_WithdrawBridgeAndSupplied = {
    id: `${event.chainId}_${event.block.number}_${event.logIndex}`,
    receiver: event.params.Receiver,
    gasFeesAmount: event.params.GasFeesAmount,
    destinationChainSelector: event.params.DestinationChainSelector,
  };

  context.HyperHarvest_WithdrawBridgeAndSupplied.set(entity);

  // Publish event to CloudAMQP
  await ensureQueueConnection();
  await queueService.publishMessage('blockchain-events', {
    type: 'WithdrawBridgeAndSupplied',
    receiver: event.params.Receiver,
    gasFeesAmount: event.params.GasFeesAmount.toString(),
    destinationChainSelector: event.params.DestinationChainSelector.toString(),
  });
});