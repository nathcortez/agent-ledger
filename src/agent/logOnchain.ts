import { createWalletClient, createPublicClient, http, parseAbi } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { hardhat } from "viem/chains";

// Cuenta de prueba de Hardhat (tiene ETH infinito)
const account = privateKeyToAccount(
  "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80"
);

const CONTRACT_ADDRESS = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

const abi = parseAbi([
  "function logAction(string agentId, string action, int256 price, int256 rsi) public",
  "function totalLogs() public view returns (uint256)",
]);

const walletClient = createWalletClient({
  account,
  chain: hardhat,
  transport: http("http://127.0.0.1:8545"),
});

const publicClient = createPublicClient({
  chain: hardhat,
  transport: http("http://127.0.0.1:8545"),
});

export async function logActionOnchain(
  agentId: string,
  action: string,
  price: number,
  rsi: number
) {
  const hash = await walletClient.writeContract({
    address: CONTRACT_ADDRESS,
    abi,
    functionName: "logAction",
    args: [agentId, action, BigInt(Math.round(price * 100)), BigInt(Math.round(rsi * 10))],
  });

  console.log(`✅ Onchain log: ${action} | TxHash: ${hash}`);
  return hash;
}