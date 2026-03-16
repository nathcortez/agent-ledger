import { fetchCandles, analyzeSignals, Signal } from './signals';
import { getAgentAddress } from '../blockchain/client';
import { swapETHforUSDC } from '../swap';
import * as fs from 'fs';
import * as dotenv from 'dotenv';
dotenv.config();

import { logActionOnchain } from './logOnchain';

const LOG_FILE = 'agent_log.json';
const INTERVAL_MS = 5 * 60 * 1000;

interface LogEntry {
  id: number;
  timestamp: string;
  agent: string;
  action: string;
  score: number;
  price: number;
  reason: string;
  rsi: number;
  trend: string;
  onchain_tx: string | null;
  swap_tx: string | null;
}

function loadLog(): LogEntry[] {
  try {
    const data = fs.readFileSync(LOG_FILE, 'utf-8');
    return JSON.parse(data) || [];
  } catch {
    return [];
  }
}

function saveLog(entries: LogEntry[]): void {
  fs.writeFileSync(LOG_FILE, JSON.stringify(entries, null, 2));
}

async function runCycle(cycleId: number): Promise<void> {
  console.log(`\n🤖 [AgentLedger] Cycle #${cycleId} — ${new Date().toISOString()}`);

  const candles = await fetchCandles('ETHUSDT', '5m', 100);
  const signal: Signal = analyzeSignals(candles);
  const agentAddress = getAgentAddress();

  console.log(`📊 Price: $${signal.price.toFixed(2)}`);
  console.log(`📈 RSI: ${signal.rsi.toFixed(1)} | Trend: ${signal.trend}`);
  console.log(`🎯 Decision: ${signal.action} (score: ${signal.score})`);
  console.log(`💬 Reason: ${signal.reason}`);
  console.log(`🔑 Agent: ${agentAddress}`);

  const entry: LogEntry = {
    id: cycleId,
    timestamp: new Date().toISOString(),
    agent: agentAddress,
    action: signal.action,
    score: signal.score,
    price: signal.price,
    reason: signal.reason,
    rsi: signal.rsi,
    trend: signal.trend,
    onchain_tx: null,
    swap_tx: null,
  };

  // Log onchain
  let txHash: string | null = null;
  try {
    txHash = await logActionOnchain(
      agentAddress,
      signal.action,
      signal.price,
      signal.rsi
    );
  } catch (e) {
    console.log('⚠️ Onchain log failed');
  }
  entry.onchain_tx = txHash;

  // Execute swap on BUY signal
  if (signal.action === 'BUY') {
    console.log('💱 BUY signal — executing Uniswap V3 swap...');
    try {
      const swapTx = await swapETHforUSDC('0.00005');
      entry.swap_tx = swapTx;
      if (swapTx) {
        console.log(`✅ Swap executed: https://sepolia.etherscan.io/tx/${swapTx}`);
      }
    } catch (e) {
      console.log('⚠️ Swap failed, continuing...');
    }
  }

  const log = loadLog();
  log.push(entry);
  saveLog(log);

  console.log(`✅ Decision logged (${log.length} total decisions)`);
}

async function main(): Promise<void> {
  console.log('🚀 AgentLedger starting...');
  console.log('🔗 Network: Ethereum Sepolia');
  console.log('📡 Data source: Binance API');
  console.log('⏱️ Interval: 5 minutes\n');

  let cycleId = 1;
  await runCycle(cycleId++);

  setInterval(async () => {
    await runCycle(cycleId++);
  }, INTERVAL_MS);
}

main().catch(console.error);