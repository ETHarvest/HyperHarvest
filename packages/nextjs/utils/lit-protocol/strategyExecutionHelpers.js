export const getStrategy = {
    yieldThreshold: 0.005, // 0.5% minimum yield difference to consider moving
    minYield: 0.02, // 2% minimum yield to stay on a chain
    gasThreshold: 0.001, // 0.1% of total assets as max acceptable gas cost
    minTimeBeforeMove: 7 * 24 * 60 * 60, // 7 days in seconds
    maxMoves: 2, // Maximum number of moves per month
  };
