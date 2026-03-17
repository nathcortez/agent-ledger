import { ethers } from "ethers";
import * as dotenv from "dotenv";
dotenv.config();

const STATUS_RPC = "https://public.sepolia.rpc.status.network";
const CONTRACT = "0x7f7752bdfdbd5d015A03d300fDE0DA51712726cc";
const ABI = ["function logAction(address agentId, string memory action, uint256 price, uint256 rsi) external"];

async function main() {
  const provider = new ethers.JsonRpcProvider(STATUS_RPC);
  const wallet = new ethers.Wallet(process.env.PRIVATE_KEY!, provider);
  const contract = new ethers.Contract(CONTRACT, ABI, wallet);

  console.log("Executing GASLESS transaction on Status Network...");
  console.log("Wallet:", wallet.address);
  console.log("Contract:", CONTRACT);

  const tx = await contract.logAction(
    wallet.address,
    "HOLD",
    BigInt(233823),
    BigInt(6240),
    { 
      gasPrice: 0,
      gasLimit: 200000
    }
  );

  console.log("Tx sent:", tx.hash);
  const receipt = await tx.wait();
  console.log("✅ GASLESS TxHash:", receipt.hash);
  console.log("Gas used:", receipt.gasUsed.toString());
  console.log("Verify: https://sepoliascan.status.network/tx/" + receipt.hash);
}

main().catch(console.error);