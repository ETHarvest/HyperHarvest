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



async function main() {

  const strategy = getStrategy;

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

  const amount = 100; // Amount of USDC to transfer
  const message = "Transfer USDC"; // Optional message
  const estimatedGasCost = await calculateGasCost("arbitrumSepolia", "optimismSepolia", amount, message);

    // Example values for yields and current chain
  const arbitrumYield = await getArbAPY(); // 4.5% yield on Arbitrum
  console.log(arbitrumYield,"arbitrumYield");
  const optimismYield = await getOPAPY(); // 5.5% yield on Optimism
  console.log(optimismYield,"optimismYield");
  const currentChain = "arbitrum"; // Current chain where funds are
  const totalAssets = 100000; // Total assets in USD
  const lastMoveTimestamp = Date.now() - 5 * 24 * 60 * 60 * 1000; // Last move was 5 days ago
  const moveCount = 1;
  

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
      currentChain,
      totalAssets,
      estimatedGasCost,
      lastMoveTimestamp,
      moveCount
    },
  });

  console.log("Result:", res);

  const result=JSON.parse(res.response);

  if (result.shouldMove) {
    console.log(`Moving funds to ${result.targetChain}`);

    // Set up the contract interaction
    const provider = new ethers.providers.JsonRpcProvider('YOUR_RPC_URL');
    const signer = new ethers.Wallet('YOUR_PRIVATE_KEY', provider);
    const hyperHarvest = new ethers.Contract('YOUR_CONTRACT_ADDRESS', ['function withdrawBridgeAndSupplyAssetToAave(address _receiver, uint256 _gasFeeAmount, uint64 _destinationChainSelector)'], signer);

    // Define chain-specific parameters
    const chainParams = {
      arbitrum: {
        receiver: 'ARBITRUM_RECEIVER_ADDRESS',
        destinationChainSelector: 'ARBITRUM_CHAIN_SELECTOR',
      },
      optimism: {
        receiver: 'OPTIMISM_RECEIVER_ADDRESS',
        destinationChainSelector: 'OPTIMISM_CHAIN_SELECTOR',
      },
    };

    const params = chainParams[result.targetChain];
    const gasFeeAmount = ethers.utils.parseEther('0.1'); // Adjust as needed

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
    console.log("No action needed. Keeping funds in the current chain.");
  }

}
main().catch((error) => {
  console.error(error);
  process.exit(1);
});