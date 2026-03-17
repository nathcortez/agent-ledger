import { ethers } from "ethers";
import * as dotenv from "dotenv";
dotenv.config();

const provider = new ethers.JsonRpcProvider("https://public.sepolia.rpc.status.network");
const wallet = new ethers.Wallet(process.env.PRIVATE_KEY!, provider);

console.log("Sending gasless tx on Status Network...");
const tx = await wallet.sendTransaction({
  to: wallet.address,
  value: 0n,
  gasPrice: 0n,
  gasLimit: 21000n
});
console.log("Tx sent:", tx.hash);
const receipt = await tx.wait();
console.log("✅ Status:", receipt?.status === 1 ? "SUCCESS" : "FAILED");
console.log("gasPrice:", receipt?.gasPrice?.toString());
console.log("🔗 https://sepoliascan.status.network/tx/" + receipt?.hash);