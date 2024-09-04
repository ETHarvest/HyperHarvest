/*
 * Please refer to https://docs.envio.dev for a thorough guide on all Envio indexer features
 */
import {
  L2Pool,
  L2Pool_ReserveDataUpdated,
  OpSepoliaUsdcReserve,
  arbSepoliaUsdcReserve
} from "generated";

const OP_SEPOLIA_USDC_RESERVE_ADDRESS = "0x5fd84259d66Cd46123540766Be93DFE6D43130D7";
const ARB_SEPOLIA_USDC_RESERVE_ADDRESS = "0x75faf114eafb1BDbe2F0316DF893fd58CE46AA4d";

L2Pool.ReserveDataUpdated.handler(async ({ event, context }) => {
  const entity: L2Pool_ReserveDataUpdated = {
    id: `${event.chainId}_${event.block.number}_${event.logIndex}`,
    reserve: event.params.reserve,
    liquidityRate: event.params.liquidityRate,
    stableBorrowRate: event.params.stableBorrowRate,
    variableBorrowRate: event.params.variableBorrowRate,
    liquidityIndex: event.params.liquidityIndex,
    variableBorrowIndex: event.params.variableBorrowIndex,
  };

  context.L2Pool_ReserveDataUpdated.set(entity);

  if (event.chainId == 11155420 && event.params.reserve.toLowerCase() === OP_SEPOLIA_USDC_RESERVE_ADDRESS.toLowerCase()) {
    const entity2: OpSepoliaUsdcReserve = {
      id: `usdc_reserve`,
      liquidityRate: event.params.liquidityRate,
      lastUpdateTimestamp: BigInt(event.block.timestamp),
    };
    context.L2Pool_ReserveDataUpdated.set(entity);
    context.OpSepoliaUsdcReserve.set(entity2);
  }
  if(event.chainId == 421614 && event.params.reserve.toLowerCase() === ARB_SEPOLIA_USDC_RESERVE_ADDRESS.toLowerCase()) {
    const entity2: arbSepoliaUsdcReserve = {
      id: `usdc_reserve`,
      liquidityRate: event.params.liquidityRate,
      lastUpdateTimestamp: BigInt(event.block.timestamp),
    };
    context.L2Pool_ReserveDataUpdated.set(entity);
    context.arbSepoliaUsdcReserve.set(entity2);
  }
});

