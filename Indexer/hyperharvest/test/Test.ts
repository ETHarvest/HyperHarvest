import assert from "assert";
import { 
  TestHelpers,
  HyperHarvest_UserDeposited
} from "generated";
const { MockDb, HyperHarvest } = TestHelpers;

describe("HyperHarvest contract UserDeposited event tests", () => {
  // Create mock db
  const mockDb = MockDb.createMockDb();

  // Creating mock for HyperHarvest contract UserDeposited event
  const event = HyperHarvest.UserDeposited.createMockEvent({/* It mocks event fields with default values. You can overwrite them if you need */});

  it("HyperHarvest_UserDeposited is created correctly", async () => {
    // Processing the event
    const mockDbUpdated = await HyperHarvest.UserDeposited.processEvent({
      event,
      mockDb,
    });

    // Getting the actual entity from the mock database
    let actualHyperHarvestUserDeposited = mockDbUpdated.entities.HyperHarvest_UserDeposited.get(
      `${event.chainId}_${event.block.number}_${event.logIndex}`
    );

    // Creating the expected entity
    const expectedHyperHarvestUserDeposited: HyperHarvest_UserDeposited = {
      id: `${event.chainId}_${event.block.number}_${event.logIndex}`,
      user: event.params.user,
      assets: event.params.assets,
      shares: event.params.shares,
    };
    // Asserting that the entity in the mock database is the same as the expected entity
    assert.deepEqual(actualHyperHarvestUserDeposited, expectedHyperHarvestUserDeposited, "Actual HyperHarvestUserDeposited should be the same as the expectedHyperHarvestUserDeposited");
  });
});
