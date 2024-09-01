const strategyAction = `
const go = async () => {
  const { ciphertext, dataToEncryptHash, arbitrumYield, optimismYield, currentChain } = params;

  // Decrypt the strategy
  const decryptedStrategy = await Lit.Actions.decryptAndCombine({
    accessControlConditions,
    ciphertext,
    dataToEncryptHash,
    authSig: null,
    chain: 'ethereum',
  });

  // Parse the strategy and make a decision
  const strategy = JSON.parse(decryptedStrategy);
  const yieldDifference = Math.abs(arbitrumYield - optimismYield);
  
  let shouldMove = false;
  let targetChain = '';

  if (yieldDifference > strategy.threshold) {
    if (arbitrumYield > optimismYield && currentChain !== 'arbitrum') {
      shouldMove = true;
      targetChain = 'arbitrum';
    } else if (optimismYield > arbitrumYield && currentChain !== 'optimism') {
      shouldMove = true;
      targetChain = 'optimism';
    }
  }

  // Return the decision
  Lit.Actions.setResponse({ response: JSON.stringify({ shouldMove, targetChain }) });
};

go();
`;

export default strategyAction;
