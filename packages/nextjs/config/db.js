import { Database } from "@tableland/sdk";
import { Wallet, getDefaultProvider } from "ethers";
import dotenv from 'dotenv';
dotenv.config();
const privateKey = process.env.TABLELAND_PRIVATE_KEY;
const wallet = new Wallet(privateKey);

const provider = getDefaultProvider(process.env.PROVIDER);
const signer = wallet.connect(provider);
// Connect to the database
export const db = new Database({ signer });