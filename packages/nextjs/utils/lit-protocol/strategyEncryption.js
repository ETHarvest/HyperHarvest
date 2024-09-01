import * as LitJsSdk from "@lit-protocol/lit-node-client-nodejs";
import { LitAccessControlConditionResource, LitActionResource, LitAbility } from "@lit-protocol/auth-helpers";

const chain = 'ethereum';
const accessControlConditions = [
  {
    contractAddress: '',
    standardContractType: '',
    chain,
    method: '',
    parameters: [':currentActionIpfsId'],
    returnValueTest: {
      comparator: '=',
      value: '<YOUR_LIT_ACTION_IPFS_CID>', // Replace with your Lit Action IPFS CID
    },
  },
];

export async function encryptStrategy(strategy) {
  const client = new LitJsSdk.LitNodeClientNodeJs({
    litNetwork: "datil-test"
  });
  await client.connect();
  
  const { ciphertext, dataToEncryptHash } = await LitJsSdk.encryptString(
    {
      accessControlConditions, 
      dataToEncrypt: strategy,
    },
    client
  );

  const accsResourceString = await LitAccessControlConditionResource.generateResourceString(accessControlConditions, dataToEncryptHash);

  return { ciphertext, dataToEncryptHash, accsResourceString };
}