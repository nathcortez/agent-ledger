import { ethers } from 'ethers';
import * as dotenv from 'dotenv';
dotenv.config();

// Uniswap V3 on Sepolia
const SWAP_ROUTER = '0x3bFA4769FB09eefC5a80d6E87c3B9C650f7Ae48E';
const WETH       = '0xfFf9976782d46CC05630D1f6eBAb18b2324d6B14';
const USDC       = '0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238';

const ROUTER_ABI = [
  'function exactInputSingle((address tokenIn, address tokenOut, uint24 fee, address recipient, uint256 amountIn, uint256 amountOutMinimum, uint160 sqrtPriceLimitX96)) external payable returns (uint256 amountOut)'
];

export async function swapETHforUSDC(amountEth: string = '0.0001'): Promise<string | null> {
  try {
   const provider = new ethers.JsonRpcProvider(
  process.env.SEPOLIA_RPC_URL || 'https://ethereum-sepolia-rpc.publicnode.com'
);
    const wallet = new ethers.Wallet(process.env.PRIVATE_KEY!, provider);
    const router = new ethers.Contract(SWAP_ROUTER, ROUTER_ABI, wallet);

    const amountIn = ethers.parseEther(amountEth);

    const params = {
      tokenIn: WETH,
      tokenOut: USDC,
      fee: 3000,
      recipient: wallet.address,
      amountIn: amountIn,
      amountOutMinimum: 0,
      sqrtPriceLimitX96: 0
    };

    console.log(`🔄 Swapping ${amountEth} ETH → USDC on Uniswap V3...`);
    const tx = await router.exactInputSingle(params, { value: amountIn });
    const receipt = await tx.wait();
    console.log(`✅ Swap TxHash: ${receipt.hash}`);
    return receipt.hash;
  } catch (err: any) {
    console.error('⚠️ Swap failed:', err.shortMessage || err.message);
    return null;
  }
}
