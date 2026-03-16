import { ethers } from "ethers";
import * as fs from "fs";
import * as dotenv from "dotenv";
dotenv.config();

async function main() {
  const provider = new ethers.JsonRpcProvider(
    "https://public.sepolia.rpc.status.network"
  );
  const wallet = new ethers.Wallet(process.env.PRIVATE_KEY!, provider);
  const artifact = JSON.parse(
    fs.readFileSync("./artifacts/contracts/AgentLedger.sol/AgentLedger.json", "utf8")
  );
  const factory = new ethers.ContractFactory(artifact.abi, artifact.bytecode, wallet);
  console.log("Deploying AgentLedger to Status Network...");
  const contract = await factory.deploy();
  await contract.waitForDeployment();
  const address = await contract.getAddress();
  console.log("✅ AgentLedger deployed to Status Network:", address);
}

main().catch(console.error);