// import { ethers } from 'ethers';
// import { encryptStrategy } from '../utils/lit-protocol/strategyEncryption.js';
// import strategyAction from '../utils/lit-protocol/strategyAction.js';
// import * as LitJsSdk from "@lit-protocol/lit-node-client-nodejs";
// import { LitAccessControlConditionResource,LitPKPResource,createSiweMessageWithRecaps, LitActionResource, LitAbility, generateAuthSig } from "@lit-protocol/auth-helpers";
// import { LitContracts } from "@lit-protocol/contracts-sdk";
// import { LitNetwork } from "@lit-protocol/constants";
// import { LitNodeClient } from "@lit-protocol/lit-node-client";

// async function main() {
//   const strategy = {
//     threshold: 0.5
//   };
//   const ONE_WEEK_FROM_NOW = new Date(
//     Date.now() + 1000 * 60 * 60 * 24 * 7
//   ).toISOString();

//   const wallet = new ethers.Wallet('6e5903d22b6717cc4d809b07f2df78f22ffe24a0568f1f8d099a2bd54a91327a', new ethers.providers.JsonRpcProvider('https://yellowstone-rpc.litprotocol.com/'));
//   console.log(wallet.address,"wallet address");
//   const client = new LitNodeClient({
//     litNetwork: LitNetwork.DatilTest,
//     debug: false,
//   });
//   await client.connect();

//   console.log("clientConnected");

//   const litContractClient = new LitContracts({
//     signer: wallet,
//     network: LitNetwork.DatilTest,
//   });
//   await litContractClient.connect();

//   console.log("litContractClientConnected");
//   const capacityCreditInfo = await litContractClient.mintCapacityCreditsNFT({
//     requestsPerKilosecond: 80,
//     // requestsPerDay: 14400,
//     // requestsPerSecond: 10,
//     daysUntilUTCMidnightExpiration: 10,
//   });
//   console.log(capacityCreditInfo, "capacityCreditInfo");
//   console.log(capacityCreditInfo.capacityTokenId, "capacityCreditInfo.capacityTokenId");

//   const { capacityDelegationAuthSig } = await client.createCapacityDelegationAuthSig({
//     dAppOwnerWallet: wallet,
//     capacityTokenId: capacityCreditInfo.capacityTokenIdStr,
//     delegateeAddresses: [wallet.address],
//     uses: "1",
//     expiration: new Date(Date.now() + 1000 * 60 * 30).toISOString(), // 10 minutes
//   });

//   console.log(capacityDelegationAuthSig, "capacityDelegationAuthSig");

//   const { ciphertext, dataToEncryptHash, accsResourceString } = await encryptStrategy(JSON.stringify(strategy));
//   console.log("Strategy Encrypted");


  
//   let blockHash = await client.getLatestBlockhash();
//   const message = await createSiweMessageWithRecaps({
//       walletAddress: wallet.address,
//       nonce: blockHash,
//       litNodeClient: client,
//       expiration:ONE_WEEK_FROM_NOW,
//       resources: [{
//         resource: new LitActionResource("*"),
//         ability: LitAbility.LitActionExecution,
//       },{
//           resource: new LitAccessControlConditionResource("*"),
//           ability: LitAbility.AccessControlConditionDecryption,
//       }],
//       litNodeClient: client,
//   })
//   const authSig = await generateAuthSig({
//       signer: wallet,
//       toSign: message,

//   });

//   console.log(authSig, "authSig");

//   const sessionSigs = await client.getLitActionSessionSigs({
//     chain: "ethereum",
//     resourceAbilityRequests: [
//     {
//         resource: new LitActionResource('*'),
//         ability: LitAbility.LitActionExecution,
//       },
//     {
//         resource: new LitAccessControlConditionResource("*"),
//         ability: LitAbility.AccessControlConditionDecryption,
//     },
//     {
//       resource: new LitPKPResource("*"),
//       ability: LitAbility.PKPSigning,
//     },
//     ],
//     authNeededCallback : async (params) => {
//       return authSig;
//     },

//     capabilityAuthSigs:[capacityDelegationAuthSig],

//     litActionCode : `(async () => {console.log("This is my Lit Action!");})();`,
//     jsParams: {}
      
//   });

//   console.log(sessionSigs, "sessionSigs");

//   await client.executeJs({
//     sessionSigs,
//     code:`(async () => {console.log("This is my Lit Action!");})();`,
// });

//   // const results = await client.executeJs({
//   //   code: strategyAction,
//   //   sessionSigs,
//   //   jsParams: {
//   //     ciphertext,
//   //     dataToEncryptHash,
//   //     arbitrumYield: await getArbitrumYield(),
//   //     optimismYield: await getOptimismYield(),
//   //     currentChain: await getCurrentChain()
//   //   }
//   // });

//   // const { shouldMove, targetChain } = JSON.parse(results.response);

//   // if (shouldMove) {
//   //   // Execute the strategy on the contract
//   //   const provider = new ethers.providers.JsonRpcProvider('YOUR_RPC_URL');
//   //   const signer = new ethers.Wallet('YOUR_PRIVATE_KEY', provider);
//   //   // const hyperHarvest = new ethers.Contract('YOUR_CONTRACT_ADDRESS', HyperHarvest.abi, signer);

//   //   // const destinationChainSelector = getChainSelector(targetChain);
//   //   const receiver = 'RECEIVER_ADDRESS_ON_TARGET_CHAIN';
//   //   const gasFeeAmount = 'ESTIMATED_GAS_FEE';

//   //   // await hyperHarvest.executeStrategy(receiver, gasFeeAmount, destinationChainSelector);
//   // }
// }
// main().catch((error) => {
//   console.error(error);
//   process.exit(1);
// });

import * as ethers from "ethers";
import {
  LitAccessControlConditionResource,
  createSiweMessage,
  LitActionResource,
  LitAbility,
  generateAuthSig,
} from "@lit-protocol/auth-helpers";
import { LitContracts } from "@lit-protocol/contracts-sdk";
import { LitNetwork } from "@lit-protocol/constants";
import { LitNodeClient } from "@lit-protocol/lit-node-client";
import { encryptString } from "@lit-protocol/encryption";

async function main() {
  const strategy = {
    threshold: 0.005,
  };

  const strategyString=JSON.stringify(strategy);
  const ONE_WEEK_FROM_NOW = new Date(
    Date.now() + 1000 * 60 * 60 * 24 * 7
  ).toISOString();

  const wallet = new ethers.Wallet(
    "f6b82019ef782c18b67f33f096111d12f5dce74817df4faf56cf399dcb4df2ef",
    new ethers.providers.JsonRpcProvider(
      "https://yellowstone-rpc.litprotocol.com/"
    )
  );
  console.log(wallet.address, "wallet address");
  const client = new LitNodeClient({
    litNetwork: LitNetwork.DatilTest,
    debug: false,
  });
  await client.connect();

  console.log("clientConnected");

  const litContractClient = new LitContracts({
    signer: wallet,
    network: LitNetwork.DatilTest,
  });
  await litContractClient.connect();

  console.log("litContractClientConnected");
  const capacityCreditInfo = await litContractClient.mintCapacityCreditsNFT({
    requestsPerKilosecond: 80,
    // requestsPerDay: 14400,
    // requestsPerSecond: 10,
    daysUntilUTCMidnightExpiration: 10,
  });
  console.log(capacityCreditInfo, "capacityCreditInfo");
  console.log(
    capacityCreditInfo.capacityTokenId,
    "capacityCreditInfo.capacityTokenId"
  );

  const { capacityDelegationAuthSig } =
    await client.createCapacityDelegationAuthSig({
      dAppOwnerWallet: wallet,
      capacityTokenId: capacityCreditInfo.capacityTokenIdStr,
      delegateeAddresses: [wallet.address],
      uses: "1",
      expiration: new Date(Date.now() + 1000 * 60 * 30).toISOString(), // 10 minutes
    });

  console.log(capacityDelegationAuthSig, "capacityDelegationAuthSig");

  const accessControlConditions = [
    {
      contractAddress: "",
      standardContractType: "",
      chain: "ethereum",
      method: "eth_getBalance",
      parameters: [":userAddress", "latest"],
      returnValueTest: {
        comparator: ">=",
        value: "0",
      },
    },
  ];

  const { ciphertext, dataToEncryptHash } = await encryptString(
    {
      accessControlConditions,
      dataToEncrypt:strategyString,
        // "f6b82019ef782c18b67f33f096111d12f5dce74817df4faf56cf399dcb4df2ef",
    },
    client
  );
  console.log("Strategy Encrypted");

  console.log("🔄 Getting Session Sigs via an Auth Sig...");
  const sessionSigs = await client.getSessionSigs({
    chain: "ethereum",
    expiration: new Date(Date.now() + 1000 * 60 * 10).toISOString(), // 10 minutes
    capabilityAuthSigs: [capacityDelegationAuthSig],
    resourceAbilityRequests: [
      {
        resource: new LitAccessControlConditionResource("*"),
        ability: LitAbility.AccessControlConditionDecryption,
      },
      {
        resource: new LitActionResource("*"),
        ability: LitAbility.LitActionExecution,
      },
    ],
    authNeededCallback: async ({
      uri,
      expiration,
      resourceAbilityRequests,
    }) => {
      const toSign = await createSiweMessage({
        uri,
        expiration,
        resources: resourceAbilityRequests,
        walletAddress: wallet.address,
        nonce: await client.getLatestBlockhash(),
        litNodeClient: client,
      });

      return await generateAuthSig({
        signer: wallet,
        toSign,
      });
    },
  });
  console.log("✅ Got Session Sigs via an Auth Sig");

    // Example values for yields and current chain
    const arbitrumYield = 0.05; // 5% yield on Arbitrum
    const optimismYield = 0.06; // 6% yield on Optimism
    const currentChain = "ethereum"; // Current chain where funds are
  

    const code = `
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
  
      const { threshold } = strategy;
  
      let shouldMove = false;
      let targetChain = currentChain;
  
      if (currentChain === "ethereum") {
        if (arbitrumYield > optimismYield && arbitrumYield > threshold) {
          shouldMove = true;
          targetChain = "arbitrum";
        } else if (optimismYield > arbitrumYield && optimismYield > threshold) {
          shouldMove = true;
          targetChain = "optimism";
        }
      } else if (currentChain === "arbitrum") {
        if (optimismYield > arbitrumYield && optimismYield > threshold) {
          shouldMove = true;
          targetChain = "optimism";
        } else if (arbitrumYield < threshold) {
          shouldMove = true;
          targetChain = "ethereum";
        }
      } else if (currentChain === "optimism") {
        if (arbitrumYield > optimismYield && arbitrumYield > threshold) {
          shouldMove = true;
          targetChain = "arbitrum";
        } else if (optimismYield < threshold) {
          shouldMove = true;
          targetChain = "ethereum";
        }
      }
  
      const result = {
        shouldMove,
        targetChain,
        currentChain,
        arbitrumYield,
        optimismYield
      };
  
      Lit.Actions.setResponse({ response: JSON.stringify(result) });
    })();
    `;
  

  const res = await client.executeJs({
    sessionSigs,
    code,
    jsParams: {
      accessControlConditions,
      ciphertext,
      dataToEncryptHash,
      arbitrumYield,
      optimismYield,
      currentChain
    },
  });

  console.log("Result:", res);
}
main().catch((error) => {
  console.error(error);
  process.exit(1);
});