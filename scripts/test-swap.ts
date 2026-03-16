import { swapETHforUSDC } from '../src/swap';

async function main() {
  console.log('Testing Uniswap swap...');
  const txHash = await swapETHforUSDC('0.0001');
  if (txHash) {
    console.log('✅ Success:', txHash);
    console.log(`https://sepolia.etherscan.io/tx/${txHash}`);
  } else {
    console.log('❌ Swap failed');
  }
}

main().catch(console.error);