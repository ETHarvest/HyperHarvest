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
    const { yieldThreshold, minYield, gasThreshold } = strategy;

    const calculateNetYield = (yield, balance, gasCost) => {
      return balance > 0 ? (yield * balance - gasCost) / balance : 0;
    };

    const arbitrumNetYield = calculateNetYield(arbitrumYield, arbitrumBalance, estimatedGasCost.arbitrumSepolia);
    const optimismNetYield = calculateNetYield(optimismYield, optimismBalance, estimatedGasCost.optimismSepolia);

    let targetChain = arbitrumNetYield > optimismNetYield ? "arbitrum" : "optimism";
    let shouldMove = false;

    const yieldDifference = Math.abs(arbitrumNetYield - optimismNetYield);

    if (yieldDifference > yieldThreshold) {
      const sourceChain = targetChain === "arbitrum" ? "optimism" : "arbitrum";
      const sourceBalance = sourceChain === "arbitrum" ? arbitrumBalance : optimismBalance;
      const targetBalance = targetChain === "arbitrum" ? arbitrumBalance : optimismBalance;
      const sourceYield = sourceChain === "arbitrum" ? arbitrumNetYield : optimismNetYield;
      const targetYield = targetChain === "arbitrum" ? arbitrumNetYield : optimismNetYield;
      
      if (sourceBalance > 0 && targetYield > minYield) {
        let gasCost;
        if(targetChain=='arbitrum'){
          gasCost=estimatedGasCost[arbitrumSepolia]
        }
        else{
          gasCost=estimatedGasCost[optimismSepolia];
        }
        const gasCostPercentage = gasCost / sourceBalance;
        
        if (gasCostPercentage < gasThreshold) {
          const currentTotalYield = (sourceYield * sourceBalance) + (targetYield * targetBalance);
          const newTotalYield = targetYield * (sourceBalance + targetBalance - gasCost);
          
          if (newTotalYield > currentTotalYield) {
            shouldMove = true;
          }
        }
      }
    }

    if (!shouldMove) {
      targetChain = arbitrumBalance > optimismBalance ? "arbitrum" : "optimism";
    }

    const result = {
      targetChain,
      shouldMove
    };

    Lit.Actions.setResponse({ response: JSON.stringify(result) });
  })();
    `;


