import assert from "assert";
import { 
  TestHelpers,
  L2Pool_ReserveDataUpdated
} from "generated";
const { MockDb, L2Pool } = TestHelpers;

describe("L2Pool contract ReserveDataUpdated event tests", () => {
  // Create mock db
  const mockDb = MockDb.createMockDb();

  // Creating mock for L2Pool contract ReserveDataUpdated event
  const event = L2Pool.ReserveDataUpdated.createMockEvent({/* It mocks event fields with default values. You can overwrite them if you need */});

  it("L2Pool_ReserveDataUpdated is created correctly", async () => {
    // Processing the event
    const mockDbUpdated = await L2Pool.ReserveDataUpdated.processEvent({
      event,
      mockDb,
    });

    // Getting the actual entity from the mock database
    let actualL2PoolReserveDataUpdated = mockDbUpdated.entities.L2Pool_ReserveDataUpdated.get(
      `${event.chainId}_${event.block.number}_${event.logIndex}`
    );

    // Creating the expected entity
    const expectedL2PoolReserveDataUpdated: L2Pool_ReserveDataUpdated = {
      id: `${event.chainId}_${event.block.number}_${event.logIndex}`,
      reserve: event.params.reserve,
      liquidityRate: event.params.liquidityRate,
      stableBorrowRate: event.params.stableBorrowRate,
      variableBorrowRate: event.params.variableBorrowRate,
      liquidityIndex: event.params.liquidityIndex,
      variableBorrowIndex: event.params.variableBorrowIndex,
    };
    // Asserting that the entity in the mock database is the same as the expected entity
    assert.deepEqual(actualL2PoolReserveDataUpdated, expectedL2PoolReserveDataUpdated, "Actual L2PoolReserveDataUpdated should be the same as the expectedL2PoolReserveDataUpdated");
  });
});
