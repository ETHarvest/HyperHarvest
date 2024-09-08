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
import { strategyAction } from "../utils/lit-protocol/strategyAction.js";
import {getStrategy,calculateGasCost} from "../utils/lit-protocol/strategyExecutionHelpers.js"
import {getArbAPY, getOPAPY} from "../utils/envio/apyInfo.js"
import {getArbitrumATokenBalance,getOptimismATokenBalance,chainParams, rpcUrls, hyperHarvestAddresses} from "../utils/aave/aaveHelper.js"
import dotenv from 'dotenv';


async function main() {

  const strategy = getStrategy;

  const strategyString=JSON.stringify(strategy);
  const ONE_WEEK_FROM_NOW = new Date(
    Date.now() + 1000 * 60 * 60 * 24 * 7
  ).toISOString();

  const wallet = new ethers.Wallet(
    Process.env.PRIVATE_KEY,
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

  // Here _aToken balance is same as the undelying USDC balance of both chain's contracts

  const arbitrumBalance = await getArbitrumATokenBalance();
  const optimismBalance = await getOptimismATokenBalance();



  console.log("arbitrumBalance",arbitrumBalance);
  console.log("optimismBalance",optimismBalance);
    

  const amount={
    arbitrumBalance:arbitrumBalance,
    optimismBalance:optimismBalance
  }
  const estimatedGasCost = await calculateGasCost("arbitrumSepolia", "optimismSepolia", amount);

  const arbitrumYield = await getArbAPY(); 
  console.log(arbitrumYield,"arbitrumYield");

  const optimismYield = await getOPAPY(); 
  console.log(optimismYield,"optimismYield");

  const code = strategyAction;
  

  const res = await client.executeJs({
    sessionSigs,
    code,
    jsParams: {
      accessControlConditions,
      ciphertext,
      dataToEncryptHash,
      arbitrumYield,
      optimismYield,
      estimatedGasCost,
      arbitrumBalance,
      optimismBalance
    },
  });

  console.log("Result:", res);

  const result=JSON.parse(res.response);

  if (result.shouldMove) {
    const sourceChain = result.targetChain === "arbitrum" ? "optimism" : "arbitrum";
    const sourceBalance = sourceChain === "arbitrum" ? result.arbitrumBalance : result.optimismBalance;

    if (sourceBalance > 0) {
      console.log(`Moving funds from ${sourceChain} to ${result.targetChain}`);

      // Set up the contract interaction
      const provider = new ethers.providers.JsonRpcProvider(rpcUrls[sourceChain]);
      const signer = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
      const hyperHarvest = new ethers.Contract(hyperHarvestAddresses[sourceChain], ['function withdrawBridgeAndSupplyAssetToAave(address _receiver, uint256 _gasFeeAmount, uint64 _destinationChainSelector)'], signer);

      const params = chainParams[result.targetChain];

      // CCIP gasFeeAmount
      const gasFeeAmount = ethers.utils.parseEther('0.0002'); 

      try {
        const tx = await hyperHarvest.withdrawBridgeAndSupplyAssetToAave(
          params.receiver,
          gasFeeAmount,
          params.destinationChainSelector
        );
        await tx.wait();
        console.log(`Transaction successful: ${tx.hash}`);
      } catch (error) {
        console.error("Error executing strategy:", error);
      }
    } else {
      console.log(`No funds available on ${sourceChain} to move. Skipping transfer.`);
    }
  } else {
    console.log(`Funds are already on the most optimal chain (${result.targetChain}). No action needed.`);
  }


}
main().catch((error) => {
  console.error(error);
  process.exit(1);
});
