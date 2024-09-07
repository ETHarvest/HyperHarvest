import {
  HyperHarvest,
  HyperHarvest_UserDeposited,
  HyperHarvest_UserWithdrawn,
  HyperHarvest_WithdrawBridgeAndSupplied,
} from "generated";


HyperHarvest.UserDeposited.handler(async ({ event, context }) => {
  const entity: HyperHarvest_UserDeposited = {
    id: `${event.chainId}_${event.block.number}_${event.logIndex}`,
    user: event.params.user,
    assets: event.params.assets,
    shares: event.params.shares,
  };

  context.HyperHarvest_UserDeposited.set(entity);
});

HyperHarvest.UserWithdrawn.handler(async ({ event, context }) => {
  const entity: HyperHarvest_UserWithdrawn = {
    id: `${event.chainId}_${event.block.number}_${event.logIndex}`,
    user: event.params.user,
    assets: event.params.assets,
    shares: event.params.shares,
  };

  context.HyperHarvest_UserWithdrawn.set(entity);
});

HyperHarvest.WithdrawBridgeAndSupplied.handler(async ({ event, context }) => {
  const entity: HyperHarvest_WithdrawBridgeAndSupplied = {
    id: `${event.chainId}_${event.block.number}_${event.logIndex}`,
    receiver: event.params.Receiver,
    gasFeesAmount: event.params.GasFeesAmount,
    destinationChainSelector: event.params.DestinationChainSelector,
  };

  context.HyperHarvest_WithdrawBridgeAndSupplied.set(entity);
  
});