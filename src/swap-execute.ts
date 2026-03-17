import { ethers } from "ethers";
import * as dotenv from "dotenv";
import { fileURLToPath } from "url";
dotenv.config();

const SWAP_ROUTER = "0x68b3465833fb72A70ecDF485E0e4C7bD8665Fc45";
const WETH = "0xfFf9976782d46CC05630D1f6eBAb18b2324d6B14";
const USDC = "0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238";
const ABI = ["function exactInputSingle((address tokenIn, address tokenOut, uint24 fee, address recipient, uint256 amountIn, uint256 amountOutMinimum, uint160 sqrtPriceLimitX96) params) external payable returns (uint256 amountOut)"];

const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);
const wallet = new ethers.Wallet(process.env.PRIVATE_KEY!, provider);
const router = new ethers.Contract(SWAP_ROUTER, ABI, wallet);
const amountIn = ethers.parseEther("0.001");

console.log("Swapping 0.001 ETH -> USDC on Sepolia...");
console.log("Wallet:", wallet.address);

router.exactInputSingle({
  tokenIn: WETH, tokenOut: USDC, fee: 3000,
  recipient: wallet.address, amountIn, amountOutMinimum: 0, sqrtPriceLimitX96: 0
}, { value: amountIn })
.then((tx: any) => { console.log("Tx hash:", tx.hash); return tx.wait(); })
.then((r: any) => console.log("SUCCESS TxHash:", r.hash))
.catch((e: any) => console.error("ERROR:", e.message));