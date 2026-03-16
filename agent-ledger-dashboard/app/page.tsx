'use client';

import { useEffect, useState } from 'react';

interface LogEntry {
  timestamp: string;
  action: 'BUY' | 'SELL' | 'HOLD';
  price: number;
  rsi: number;
  onchain_tx?: string;
  agent?: string;
  reason?: string;
  score?: number;
}

const AGENT_ADDRESS = '0x7E5F4552091A69125d5DfCb7b8C2659029395Bdf';
const CONTRACT_ADDRESS = '0x751BbC1f476e1e4988C8B47C1BFA31A39C6Fe237';

function actionBg(action: string) {
  if (action === 'BUY') return 'bg-green-900 text-green-300';
  if (action === 'SELL') return 'bg-red-900 text-red-300';
  return 'bg-yellow-900 text-yellow-300';
}

function actionColor(action: string) {
  if (action === 'BUY') return 'text-green-400';
  if (action === 'SELL') return 'text-red-400';
  return 'text-yellow-400';
}

export default function Home() {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/logs')
      .then(r => r.json())
      .then(data => {
        setLogs(Array.isArray(data) ? [...data].reverse() : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const buys = logs.filter(l => l.action === 'BUY').length;
  const sells = logs.filter(l => l.action === 'SELL').length;
  const holds = logs.filter(l => l.action === 'HOLD').length;
  const onchain = logs.filter(l => l.onchain_tx).length;
  const reputationScore = logs.length > 0
    ? Math.min(100, Math.round((onchain / logs.length) * 100))
    : 0;

  return (
    <main className="min-h-screen bg-gray-950 text-white p-8">
      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white">⛓ AgentLedger</h1>
          <p className="text-gray-400 mt-1">On-chain reputation infrastructure for autonomous agents</p>
        </div>

        {/* Agent Info */}
        <div className="bg-gray-900 rounded-xl p-5 mb-6 border border-gray-800">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-3 h-3 rounded-full bg-green-400 animate-pulse"></div>
            <span className="text-sm font-semibold text-green-400 uppercase tracking-widest">Agent Online</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
            <div>
              <span className="text-gray-500">Agent Address</span>
              <p className="text-white font-mono text-xs mt-1">{AGENT_ADDRESS}</p>
            </div>
            <div>
              <span className="text-gray-500">Contract (Sepolia)</span>
              <a
                href={`https://sepolia.etherscan.io/address/${CONTRACT_ADDRESS}`}
                target="_blank"
                rel="noopener noreferrer"
                className="block text-blue-400 font-mono text-xs mt-1 hover:underline"
              >
                {CONTRACT_ADDRESS}
              </a>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
          {[
            { label: 'Total Decisions', value: logs.length, color: 'text-white' },
            { label: 'BUY', value: buys, color: 'text-green-400' },
            { label: 'SELL', value: sells, color: 'text-red-400' },
            { label: 'HOLD', value: holds, color: 'text-yellow-400' },
            { label: 'Reputation Score', value: `${reputationScore}%`, color: 'text-blue-400' },
          ].map(stat => (
            <div key={stat.label} className="bg-gray-900 rounded-xl p-4 border border-gray-800 text-center">
              <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
              <p className="text-gray-500 text-xs mt-1">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Log Table */}
        <div className="bg-gray-900 rounded-xl border border-gray-800">
          <div className="p-5 border-b border-gray-800">
            <h2 className="font-semibold text-white">Decision Log</h2>
            <p className="text-gray-500 text-sm">Every action logged on-chain to Sepolia</p>
          </div>

          {loading ? (
            <div className="p-10 text-center text-gray-500">Loading...</div>
          ) : logs.length === 0 ? (
            <div className="p-10 text-center text-gray-500">No logs yet. Run the agent first.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-gray-500 text-xs uppercase border-b border-gray-800">
                    <th className="text-left p-4">Timestamp</th>
                    <th className="text-left p-4">Action</th>
                    <th className="text-left p-4">ETH Price</th>
                    <th className="text-left p-4">RSI</th>
                    <th className="text-left p-4">Reason</th>
                    <th className="text-left p-4">TxHash</th>
                  </tr>
                </thead>
                <tbody>
                  {logs.map((log, i) => (
                    <tr key={i} className="border-b border-gray-800 hover:bg-gray-800 transition-colors">
                      <td className="p-4 text-gray-400 font-mono text-xs">
                        {new Date(log.timestamp).toLocaleString()}
                      </td>
                      <td className="p-4">
                        <span className={`px-2 py-1 rounded text-xs font-bold ${actionBg(log.action)}`}>
                          {log.action}
                        </span>
                      </td>
                      <td className="p-4 text-white">
                        ${typeof log.price === 'number' ? log.price.toFixed(2) : log.price}
                      </td>
                      <td className={`p-4 font-mono ${actionColor(log.action)}`}>
                        {typeof log.rsi === 'number' ? log.rsi.toFixed(1) : log.rsi}
                      </td>
                      <td className="p-4 text-gray-400 text-xs max-w-[180px] truncate">
                        {log.reason || '—'}
                      </td>
                      <td className="p-4">
                        {log.onchain_tx ? (
                          <a
                            href={`https://sepolia.etherscan.io/tx/${log.onchain_tx}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-400 font-mono text-xs hover:underline"
                          >
                            {log.onchain_tx.slice(0, 8)}...{log.onchain_tx.slice(-6)}
                          </a>
                        ) : (
                          <span className="text-gray-600 text-xs">—</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
