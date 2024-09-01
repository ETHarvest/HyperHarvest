import { ethers } from 'ethers';
import { encryptStrategy } from '../utils/lit-protocol/strategyEncryption.js';
import strategyAction from '../utils/lit-protocol/strategyAction.js';
import * as LitJsSdk from "@lit-protocol/lit-node-client-nodejs";
import { LitAccessControlConditionResource,createSiweMessageWithRecaps, LitActionResource, LitAbility, generateAuthSig } from "@lit-protocol/auth-helpers";

async function main() {
  const strategy = {
    threshold: 0.5
  };
  const ONE_WEEK_FROM_NOW = new Date(
    Date.now() + 1000 * 60 * 60 * 24 * 7
  ).toISOString();

  const client = new LitJsSdk.LitNodeClientNodeJs({
    litNetwork: "datil-test"
  });
  await client.connect();

  const { ciphertext, dataToEncryptHash, accsResourceString } = await encryptStrategy(JSON.stringify(strategy));
  console.log("Strategy Encrypted");

  const wallet = new ethers.Wallet('6e5903d22b6717cc4d809b07f2df78f22ffe24a0568f1f8d099a2bd54a91327a', new ethers.providers.JsonRpcProvider('https://yellowstone-rpc.litprotocol.com/'));
  
  console.log(wallet.address,"wallet address");
  
  let blockHash = await client.getLatestBlockhash();
  const message = await createSiweMessageWithRecaps({
      walletAddress: wallet.address,
      nonce: blockHash,
      litNodeClient: client,
      expiration:ONE_WEEK_FROM_NOW,
  })
  const authSig = await generateAuthSig({
      signer: wallet,
      toSign: message,
      address: wallet.address
  });

  console.log(authSig, "authSig");

  const sessionSigs = await client.getSessionSigs({
    chain: "ethereum",
    resourceAbilityRequests: [
      {
        resource: new LitActionResource('*'),
        ability: LitAbility.LitActionExecution,
      },
      {
        resource: new LitAccessControlConditionResource('*'),
        ability: LitAbility.AccessControlConditionDecryption,
      }
    ],
    authNeededCallback : async (params) => {
      return authSig;
    }

  });

  console.log(sessionSigs, "sessionSigs");

  const results = await client.executeJs({
    code: strategyAction,
    sessionSigs,
    jsParams: {
      ciphertext,
      dataToEncryptHash,
      arbitrumYield: await getArbitrumYield(),
      optimismYield: await getOptimismYield(),
      currentChain: await getCurrentChain()
    }
  });

  const { shouldMove, targetChain } = JSON.parse(results.response);

  // if (shouldMove) {
  //   // Execute the strategy on the contract
  //   const provider = new ethers.providers.JsonRpcProvider('YOUR_RPC_URL');
  //   const signer = new ethers.Wallet('YOUR_PRIVATE_KEY', provider);
  //   // const hyperHarvest = new ethers.Contract('YOUR_CONTRACT_ADDRESS', HyperHarvest.abi, signer);

  //   // const destinationChainSelector = getChainSelector(targetChain);
  //   const receiver = 'RECEIVER_ADDRESS_ON_TARGET_CHAIN';
  //   const gasFeeAmount = 'ESTIMATED_GAS_FEE';

  //   // await hyperHarvest.executeStrategy(receiver, gasFeeAmount, destinationChainSelector);
  // }
}
main().catch((error) => {
  console.error(error);
  process.exit(1);
});
