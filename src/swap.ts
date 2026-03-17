import { ethers } from "ethers";
import * as dotenv from "dotenv";
import { fileURLToPath } from "url";
dotenv.config();

const UNISWAP_API = "https://trade-api.gateway.uniswap.org/v1/quote";
const NATIVE_ETH = "0x0000000000000000000000000000000000000000";
const USDC_MAINNET = "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48";

export async function getUniswapQuote(walletAddress: string, amountEth: string = "0.0001"): Promise<any> {
  const amountIn = ethers.parseEther(amountEth).toString();
  console.log("Calling Uniswap Trade API...");
  const res = await fetch(UNISWAP_API, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": process.env.UNISWAP_API_KEY!,
      "x-universal-router-version": "2.0"
    },
    body: JSON.stringify({
      type: "EXACT_INPUT",
      amount: amountIn,
      tokenInChainId: 1,
      tokenOutChainId: 1,
      tokenIn: NATIVE_ETH,
      tokenOut: USDC_MAINNET,
      swapper: walletAddress,
      autoSlippage: "DEFAULT",
      routingPreference: "BEST_PRICE",
      urgency: "urgent"
    })
  });
  const data = await res.json();
  if (!res.ok) throw new Error(`Uniswap API error ${res.status}: ${JSON.stringify(data)}`);
  return data;
}

const isMain = process.argv[1] === fileURLToPath(import.meta.url);
if (isMain) {
  const testWallet = "0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045";
  getUniswapQuote(testWallet, "0.0001")
    .then(data => { console.log("Quote received!"); console.log(JSON.stringify(data, null, 2)); })
    .catch(err => console.error("Error:", err.message));
}