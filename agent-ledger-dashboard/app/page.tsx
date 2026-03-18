'use client';

import { useEffect, useState } from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, ReferenceDot
} from 'recharts';

interface LogEntry {
  timestamp: string;
  action: 'BUY' | 'SELL' | 'HOLD';
  price: number;
  rsi: number;
  onchain_tx?: string;
  swap_tx?: string;
  agent?: string;
  reason?: string;
  score?: number;
}

const AGENT_ADDRESS = '0xDfa93dE358BDA440D74811aD03fAf7808e9968C7';
const CONTRACT_SEPOLIA = '0x751BbC1f476e1e4988C8B47C1BFA31A39C6Fe237';
const CONTRACT_STATUS  = '0x7f7752bdfdbd5d015A03d300fDE0DA51712726cc';
const ERC8004_TX = '0x235511b0ff66a9b6073fc98892239adc807cc2ccfda3fd181e4adbbb9e01f09e';

function actionLabel(action: string, rsi: number) {
  if (action === 'BUY')  return `BUY — RSI Uptrend Signal`;
  if (action === 'SELL') return `SELL — RSI Downtrend Signal`;
  return `HOLD — Insufficient Signal`;
}

function actionBg(action: string) {
  if (action === 'BUY')  return 'bg-green-900/60 text-green-300 border border-green-700';
  if (action === 'SELL') return 'bg-red-900/60 text-red-300 border border-red-700';
  return 'bg-yellow-900/60 text-yellow-300 border border-yellow-700';
}

function cognitionReason(action: string, rsi: number, price: number) {
  const rsiStr = typeof rsi === 'number' ? rsi.toFixed(1) : rsi;
  if (action === 'BUY')  return `RSI=${rsiStr} → uptrend confirmed → BUY logged on-chain`;
  if (action === 'SELL') return `RSI=${rsiStr} → downtrend confirmed → SELL logged on-chain`;
  return `RSI=${rsiStr} → no clear signal → HOLD, no action taken`;
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-gray-900 border border-gray-700 rounded-lg p-3 text-xs">
        <p className="text-gray-400">{new Date(label).toLocaleString()}</p>
        <p className="text-white font-bold">${payload[0].value.toFixed(2)}</p>
      </div>
    );
  }
  return null;
};

export default function Home() {
  const [logs, setLogs]       = useState<LogEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [ensNames, setEnsNames] = useState<Record<string, string>>({});

  useEffect(() => {
    fetch('https://raw.githubusercontent.com/nathcortez/agent-ledger/main/agent_log.json')
      .then(r => r.json())
      .then(data => { setLogs(Array.isArray(data) ? [...data] : []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  useEffect(() => {
    const addresses = [...new Set(logs.map(l => l.agent).filter(Boolean))] as string[];
    addresses.forEach(async (addr) => {
      try {
        const res  = await fetch(`/api/ens?address=${addr}`);
        const data = await res.json();
        if (data.name) setEnsNames(prev => ({ ...prev, [addr]: data.name }));
      } catch {}
    });
  }, [logs]);

  const reversed  = [...logs].reverse();
  const buys      = logs.filter(l => l.action === 'BUY').length;
  const sells     = logs.filter(l => l.action === 'SELL').length;
  const holds     = logs.filter(l => l.action === 'HOLD').length;
  const onchain   = logs.filter(l => l.onchain_tx).length;
  const swaps     = logs.filter(l => l.swap_tx).length;
  const reputationScore = logs.length > 0
    ? Math.min(100, Math.round((onchain / logs.length) * 100)) : 0;

  const chartData  = logs.map(l => ({ time: l.timestamp, price: l.price, action: l.action }));
  const buyPoints  = chartData.filter(d => d.action === 'BUY');
  const sellPoints = chartData.filter(d => d.action === 'SELL');

  return (
    <main className="min-h-screen bg-[#0a0a0f] text-white">

      {/* Header */}
      <div className="border-b border-gray-800 px-8 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-2xl">⛓</span>
          <div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              AgentLedger — Proof of Cognition
            </h1>
            <p className="text-gray-500 text-xs">Every agent decision, permanently on-chain</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <a
            href={`https://basescan.org/tx/${ERC8004_TX}`}
            target="_blank" rel="noopener noreferrer"
            className="flex items-center gap-1.5 bg-purple-950/60 border border-purple-700/60 rounded-lg px-3 py-1.5 text-xs text-purple-300 hover:bg-purple-900/60 transition-colors"
          >
            <span>🪪</span>
            <span className="font-semibold">ERC-8004 Identity ✅</span>
          </a>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
            <span className="text-green-400 text-xs font-semibold">LIVE</span>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-8">

        {/* Proof of Cognition Hero */}
        <div className="bg-gradient-to-r from-purple-950/50 to-blue-950/50 border border-purple-800/40 rounded-2xl p-6 mb-6">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-2xl">🧠</span>
                <h2 className="text-lg font-bold text-white">Proof of Cognition</h2>
              </div>
              <p className="text-gray-400 text-sm max-w-xl">
                AgentLedger doesn't just log <em>what</em> the agent did —
                it logs the <em>signals</em> that triggered the decision, creating an auditable
                decision trail for any autonomous agent. In this implementation: RSI value,
                price momentum, and trend direction — all stamped on-chain before execution.
              </p>
              <p className="text-purple-400/80 text-xs mt-2 font-mono">
                Agent Identity: ERC-8004 ✅ &nbsp;|&nbsp; Operator: {AGENT_ADDRESS.slice(0,8)}...{AGENT_ADDRESS.slice(-6)}
              </p>
            </div>
            {/* Transparency Score */}
            <div className="bg-black/40 border border-purple-700/40 rounded-xl p-5 text-center min-w-[160px]">
              <p className="text-4xl font-black text-purple-300">{reputationScore}%</p>
              <p className="text-purple-400/80 text-xs mt-1 font-semibold">Transparency Score</p>
              <p className="text-gray-600 text-xs mt-1">{onchain}/{logs.length} decisions logged on-chain</p>
            </div>
          </div>
        </div>

        {/* Agent Card */}
        <div className="bg-gray-900/50 rounded-2xl p-5 mb-6 border border-gray-800">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div>
              <p className="text-gray-500 text-xs mb-1">AGENT ADDRESS</p>
              <p className="text-white font-mono text-xs">
                {ensNames[AGENT_ADDRESS]
                  ? <span className="text-purple-400 font-bold">{ensNames[AGENT_ADDRESS]}</span>
                  : AGENT_ADDRESS}
              </p>
            </div>
            <div>
              <p className="text-gray-500 text-xs mb-1">CONTRACT — SEPOLIA</p>
              <a
                href={`https://sepolia.etherscan.io/address/${CONTRACT_SEPOLIA}`}
                target="_blank" rel="noopener noreferrer"
                className="text-blue-400 font-mono text-xs hover:underline"
              >
                {CONTRACT_SEPOLIA.slice(0,10)}...{CONTRACT_SEPOLIA.slice(-6)}
              </a>
            </div>
            <div>
              <p className="text-gray-500 text-xs mb-1">CONTRACT — STATUS NETWORK</p>
              <a
                href={`https://sepoliascan.status.network/address/${CONTRACT_STATUS}`}
                target="_blank" rel="noopener noreferrer"
                className="text-purple-400 font-mono text-xs hover:underline"
              >
                {CONTRACT_STATUS.slice(0,10)}...{CONTRACT_STATUS.slice(-6)}
              </a>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-6">
          {[
            { label: 'Total Decisions', value: logs.length,  color: 'text-white',     icon: '📊' },
            { label: 'BUY Signals',     value: buys,          color: 'text-green-400', icon: '🟢' },
            { label: 'SELL Signals',    value: sells,         color: 'text-red-400',   icon: '🔴' },
            { label: 'HOLD Signals',    value: holds,         color: 'text-yellow-400',icon: '🟡' },
            { label: 'Uniswap Swaps',   value: swaps,         color: 'text-blue-400',  icon: '💱' },
          ].map(stat => (
            <div key={stat.label} className="bg-gray-900/50 rounded-xl p-3 border border-gray-800 text-center">
              <p className="text-lg mb-0.5">{stat.icon}</p>
              <p className={`text-xl font-bold ${stat.color}`}>{stat.value}</p>
              <p className="text-gray-600 text-xs">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Price Chart */}
        <div className="bg-gray-900/50 rounded-2xl p-5 mb-6 border border-gray-800">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="font-semibold text-white">ETH Price + Decision Signals</h2>
              <p className="text-gray-500 text-xs">🟢 BUY &nbsp; 🔴 SELL — each dot = one on-chain verified decision</p>
            </div>
            {logs.length > 0 && (
              <div className="text-right">
                <p className="text-2xl font-bold text-white">
                  ${logs[logs.length - 1]?.price?.toFixed(2)}
                </p>
                <p className="text-gray-500 text-xs">Latest price</p>
              </div>
            )}
          </div>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
              <XAxis dataKey="time"
                tickFormatter={(t) => new Date(t).toLocaleDateString('es', { day: '2-digit', month: '2-digit' })}
                tick={{ fill: '#6b7280', fontSize: 10 }} axisLine={{ stroke: '#374151' }} />
              <YAxis domain={['auto', 'auto']}
                tick={{ fill: '#6b7280', fontSize: 10 }} axisLine={{ stroke: '#374151' }}
                tickFormatter={(v) => `$${v}`} width={60} />
              <Tooltip content={<CustomTooltip />} />
              <Line type="monotone" dataKey="price" stroke="#3b82f6" strokeWidth={2}
                dot={false} activeDot={{ r: 4, fill: '#3b82f6' }} />
              {buyPoints.map((p, i) => (
                <ReferenceDot key={`buy-${i}`} x={p.time} y={p.price} r={5} fill="#4ade80" stroke="#166534" />
              ))}
              {sellPoints.map((p, i) => (
                <ReferenceDot key={`sell-${i}`} x={p.time} y={p.price} r={5} fill="#f87171" stroke="#991b1b" />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Badges */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-6">
          <div className="bg-purple-950/40 border border-purple-800/50 rounded-xl p-4 flex items-center gap-3">
            <span className="text-2xl">🪪</span>
            <div>
              <p className="text-purple-300 font-semibold text-sm">ERC-8004 Registered</p>
              <a href={`https://basescan.org/tx/${ERC8004_TX}`} target="_blank" rel="noopener noreferrer"
                className="text-purple-400/70 text-xs hover:underline">View on BaseScan ↗</a>
            </div>
          </div>
          <div className="bg-blue-950/40 border border-blue-800/50 rounded-xl p-4 flex items-center gap-3">
            <span className="text-2xl">🌐</span>
            <div>
              <p className="text-blue-300 font-semibold text-sm">Multi-Chain Deployed</p>
              <p className="text-blue-400/70 text-xs">Ethereum Sepolia + Status Network (gasless)</p>
            </div>
          </div>
          <div className="bg-green-950/40 border border-green-800/50 rounded-xl p-4 flex items-center gap-3">
            <span className="text-2xl">💱</span>
            <div>
              <p className="text-green-300 font-semibold text-sm">Uniswap v3 Swap</p>
              <a href="https://sepolia.etherscan.io/tx/0xf91842a53ebd610e5c93d0d46e044b6adbf95a90bd230581a26a067e0ccc6662"
                target="_blank" rel="noopener noreferrer"
                className="text-green-400/70 text-xs hover:underline">ETH→USDC on Sepolia ↗</a>
            </div>
          </div>
        </div>

        {/* Decision Ledger Table */}
        <div className="bg-gray-900/50 rounded-2xl border border-gray-800">
          <div className="p-5 border-b border-gray-800 flex items-center justify-between">
            <div>
              <h2 className="font-semibold text-white">🧠 Cognition Ledger</h2>
              <p className="text-gray-500 text-xs">
                Every decision logged on-chain · verified on Etherscan · full input signals preserved immutably
              </p>
            </div>
            <span className="text-xs text-gray-600">{logs.length} on-chain decisions</span>
          </div>

          {loading ? (
            <div className="p-10 text-center text-gray-500">Loading decision records...</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-gray-500 text-xs uppercase border-b border-gray-800">
                    <th className="text-left p-4">Timestamp</th>
                    <th className="text-left p-4">Decision</th>
                    <th className="text-left p-4">ETH Price</th>
                    <th className="text-left p-4">RSI</th>
                    <th className="text-left p-4">Input Signals</th>
                    <th className="text-left p-4">On-Chain Proof</th>
                    <th className="text-left p-4">Swap</th>
                  </tr>
                </thead>
                <tbody>
                  {reversed.map((log, i) => (
                    <tr key={i} className="border-b border-gray-800/50 hover:bg-gray-800/30 transition-colors">
                      <td className="p-4 text-gray-400 font-mono text-xs">
                        {new Date(log.timestamp).toLocaleString()}
                      </td>
                      <td className="p-4">
                        <span className={`px-2 py-0.5 rounded-md text-xs font-bold ${actionBg(log.action)}`}>
                          {log.action}
                        </span>
                      </td>
                      <td className="p-4 text-white font-mono">
                        ${typeof log.price === 'number' ? log.price.toFixed(2) : log.price}
                      </td>
                      <td className="p-4 font-mono text-gray-300 text-xs">
                        {typeof log.rsi === 'number' ? log.rsi.toFixed(1) : log.rsi}
                      </td>
                      <td className="p-4 text-gray-400 text-xs max-w-[220px]">
                        <span className="italic">
                          {log.reason || cognitionReason(log.action, log.rsi, log.price)}
                        </span>
                      </td>
                      <td className="p-4">
                        {log.onchain_tx ? (
                          <a href={`https://sepolia.etherscan.io/tx/${log.onchain_tx}`}
                            target="_blank" rel="noopener noreferrer"
                            className="text-blue-400 font-mono text-xs hover:underline">
                            🔗 {log.onchain_tx.slice(0,8)}...
                          </a>
                        ) : <span className="text-gray-700 text-xs">—</span>}
                      </td>
                      <td className="p-4">
                        {log.swap_tx ? (
                          <a href={`https://sepolia.etherscan.io/tx/${log.swap_tx}`}
                            target="_blank" rel="noopener noreferrer"
                            className="text-green-400 font-mono text-xs hover:underline">
                            💱 {log.swap_tx.slice(0,8)}...
                          </a>
                        ) : <span className="text-gray-700 text-xs">—</span>}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="mt-6 text-center text-gray-600 text-xs">
          Built at Synthesis Hackathon 2026 ·{' '}
          <a href="https://github.com/nathcortez/agent-ledger" target="_blank" rel="noopener noreferrer"
            className="hover:text-gray-400">GitHub</a>
          {' '}·{' '}
          <a href={`https://basescan.org/tx/${ERC8004_TX}`} target="_blank" rel="noopener noreferrer"
            className="hover:text-gray-400">ERC-8004 Identity</a>
        </div>

      </div>
    </main>
  );
}