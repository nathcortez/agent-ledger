import { createWalletClient, createPublicClient, http, parseAbi } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { sepolia } from "viem/chains";
import * as dotenv from "dotenv";
dotenv.config();

const account = privateKeyToAccount(
  process.env.PRIVATE_KEY as `0x${string}`
);

const CONTRACT_ADDRESS = "0x751BbC1f476e1e4988C8B47C1BFA31A39C6Fe237";

const abi = parseAbi([
  "function logAction(string agentId, string action, int256 price, int256 rsi) public",
  "function totalLogs() public view returns (uint256)",
]);

const walletClient = createWalletClient({
  account,
  chain: sepolia,
  transport: http("https://ethereum-sepolia-rpc.publicnode.com"),
});

const publicClient = createPublicClient({
  chain: sepolia,
  transport: http("https://ethereum-sepolia-rpc.publicnode.com"),
});

export async function logActionOnchain(
  agentId: string,
  action: string,
  price: number,
  rsi: number
) {
  const hash = await walletClient.writeContract({
    address: CONTRACT_ADDRESS as `0x${string}`,
    abi,
    functionName: "logAction",
    args: [agentId, action, BigInt(Math.round(price * 100)), BigInt(Math.round(rsi * 10))],
  });
  console.log(`✅ Onchain log: ${action} | TxHash: ${hash}`);
  return hash;
}