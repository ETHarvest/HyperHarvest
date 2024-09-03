export const strategyAction=`
    (async () => {
    const resp = await Lit.Actions.decryptAndCombine({
      accessControlConditions,
      ciphertext,
      dataToEncryptHash,
      authSig: null,
      chain: 'ethereum',
    });

    const strategy = JSON.parse(resp);
    console.log("Decrypted strategy:", strategy);

    const { yieldThreshold, minYield, gasThreshold, minTimeBeforeMove, maxMoves } = strategy;

    let shouldMove = false;
    let targetChain = currentChain;
    const currentTimestamp = Date.now();

    const yieldDifference = Math.abs(arbitrumYield - optimismYield);
    const timeSinceLastMove = (currentTimestamp - lastMoveTimestamp) / 1000; // in seconds
    const currentYield = currentChain === "arbitrum" ? arbitrumYield : optimismYield;

    const calculateNetYield = (targetYield, gasCost) => {
      return targetYield - (gasCost / totalAssets);
    };

    if (yieldDifference > yieldThreshold && timeSinceLastMove > minTimeBeforeMove && moveCount < maxMoves) {
      if (currentChain === "arbitrum" && optimismYield > arbitrumYield) {
        const netOptimismYield = calculateNetYield(optimismYield, estimatedGasCost.optimism);
        if (netOptimismYield > currentYield && netOptimismYield > minYield) {
          shouldMove = true;
          targetChain = "optimism";
        }
      } else if (currentChain === "optimism" && arbitrumYield > optimismYield) {
        const netArbitrumYield = calculateNetYield(arbitrumYield, estimatedGasCost.arbitrum);
        if (netArbitrumYield > currentYield && netArbitrumYield > minYield) {
          shouldMove = true;
          targetChain = "arbitrum";
        }
      }
    }

    // Check if gas cost is below the threshold
    if (shouldMove) {
      const gasCost = estimatedGasCost[targetChain];
      if (gasCost / totalAssets > gasThreshold) {
        shouldMove = false;
        targetChain = currentChain;
      }
    }

    // Check if current yield is below minYield
    if (currentYield < minYield) {
      const otherChain = currentChain === "arbitrum" ? "optimism" : "arbitrum";
      const otherYield = currentChain === "arbitrum" ? optimismYield : arbitrumYield;
      const netOtherYield = calculateNetYield(otherYield, estimatedGasCost[otherChain]);
      if (netOtherYield > minYield) {
        shouldMove = true;
        targetChain = otherChain;
      }
    }

    const result = {
      shouldMove,
      targetChain,
      currentChain,
      arbitrumYield,
      optimismYield,
      yieldDifference,
      timeSinceLastMove,
      moveCount,
      estimatedGasCost: estimatedGasCost[targetChain],
    };

    Lit.Actions.setResponse({ response: JSON.stringify(result) });
  })();
    `;


