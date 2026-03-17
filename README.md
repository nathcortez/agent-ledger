# ⛓ AgentLedger

> On-chain reputation infrastructure for autonomous agents.

**Live Dashboard:** https://agent-ledger-alpha.vercel.app  
**Agent Address:** `0xDfa93dE358BDA440D74811aD03fAf7808e9968C7`  
**ERC-8004 Registration:** [View on BaseScan](https://basescan.org/tx/0x235511b0ff66a9b6073fc98892239adc807cc2ccfda3fd181e4adbbb9e01f09e)

---

## The Problem

Autonomous agents are making real decisions — trading, transacting, negotiating — but there's no way to verify their track record. You can't trust an agent you can't audit.

## The Solution

AgentLedger is a public infrastructure layer that lets any autonomous agent log its actions on-chain. Every decision becomes a verifiable, permanent record. Agents build reputation over time. Humans can audit, compare, and trust.

**Think: GitHub for agent behavior — but immutable and on-chain.**

---

## How It Works

Agent runs → analyzes market data (Binance API + RSI) → makes decision (BUY/SELL/HOLD) → calls logAction() on AgentLedger smart contract → decision stored on-chain (permanent, public) → Dashboard reads events → shows reputation score + history


---

## Live Demo

→ **[View Dashboard](https://agent-ledger-alpha.vercel.app)**

The trading agent monitors ETH price in real-time, calculates RSI, and logs every decision on-chain with a verified TxHash.

**Sample onchain decisions:**
- `0x40449e8d...` — HOLD @ $2291.35, RSI 52.4
- `0x0a640860...` — BUY @ $2296.53, RSI 60.8 (Uptrend)
- `0xdef5e573...` — BUY @ $2299.44, RSI 62.4 (Uptrend)

---

## Smart Contracts

| Network | Address | Explorer |
|---------|---------|----------|
| Ethereum Sepolia | `0x751BbC1f476e1e4988C8B47C1BFA31A39C6Fe237` | [Etherscan](https://sepolia.etherscan.io/address/0x751BbC1f476e1e4988C8B47C1BFA31A39C6Fe237) |
| Status Network Testnet | `0x7f7752bdfdbd5d015A03d300fDE0DA51712726cc` | [Status Explorer](https://sepoliascan.status.network/address/0x7f7752bdfdbd5d015A03d300fDE0DA51712726cc) |

```solidity
function logAction(
    address agentId,
    string memory action,   // "BUY" | "SELL" | "HOLD"
    uint256 price,          // ETH price in USD (×100)
    uint256 rsi             // RSI value (×100)
) external
Tech Stack
| Layer | Tech | |-------|------| | Smart Contract | Solidity 0.8.24, Hardhat 3 | | Networks | Ethereum Sepolia + Status Network Testnet | | Agent | TypeScript, Node.js, ethers.js v6 | | Market Data | Binance public API | | Dashboard | Next.js 16, Tailwind CSS | | Deploy | Vercel |

Agent Identity (ERC-8004)
{
  "standard": "ERC-8004",
  "operator": "0xDfa93dE358BDA440D74811aD03fAf7808e9968C7",
  "participantId": "2119d56555a044e694e17fa9e9a6ff3b",
  "registrationTxn": "0x235511b0ff66a9b6073fc98892239adc807cc2ccfda3fd181e4adbbb9e01f09e"
}
🛡️ Safety & Guardrails
The agent includes multiple safety mechanisms to prevent runaway behavior:

Error handling on every API call — if Binance API fails, the cycle skips and retries next interval
No execution without valid RSI — agent requires minimum 14 candles to calculate RSI before acting
Testnet only — testnet_only: true enforced in agent.json; no mainnet funds at risk
Max position size — hardcoded max_position_size_usd: 100 in agent config
Onchain log required — requires_onchain_log: true; agent won't count a decision without a receipt
try/catch on all blockchain writes — failed transactions are logged locally without crashing the agent loop
⏱️ Compute Budget
The agent is designed to be sustainable and non-spammy:

5-minute cycle interval — one decision loop every 5 minutes; no API flooding
Single API call per cycle — one Binance request per cycle to fetch latest candles
Lightweight computation — RSI calculation is pure math, no external compute
No LLM calls in the hot path — decisions are deterministic (RSI + trend), not AI inference
Gas-aware — only logs onchain when confidence score justifies the gas cost
Run Locally
# Clone
git clone https://github.com/nathcortez/agent-ledger
cd agent-ledger

# Install
npm install

# Configure
cp .env.example .env
# Add PRIVATE_KEY and SEPOLIA_RPC_URL

# Run agent
npx tsx src/agent.ts

# Run dashboard
cd agent-ledger-dashboard
npm install
npm run dev
Reputation Score
Each agent gets a score based on the % of decisions logged on-chain vs total decisions. A score of 100% means full transparency — every action is publicly verifiable.

🏆 Bounty Coverage
| Bounty | Why We Qualify | |--------|---------------| | Protocol Labs — Let the Agent Cook ($8,000) | Full autonomous loop: fetch → analyze → decide → log onchain. Real ERC-8004 identity. agent.json + agent_log.json with 30+ real TxHashes. Safety guardrails documented. | | Protocol Labs — Agents With Receipts ($8,004) | ERC-8004 identity registered on Base Mainnet. Every decision logged onchain. Verifiable via Etherscan. DevSpot compatible with agent.json + agent_log.json. | | Status Network ($2,000) | AgentLedger deployed on Status Network Testnet at 0x7f7752bdfdbd5d015A03d300fDE0DA51712726cc. Agent logs decisions cross-chain. AI agent component + onchain proof. | | Synthesis Open Track ($14,500) | Technically coherent agent system with real-world utility, cross-sponsor compatibility (identity + execution + reputation). |

Roadmap
[ ] Multi-agent explorer (search any agent by address)
[ ] ENS integration (human-readable agent names)
[ ] Cross-chain support (Base, Arbitrum)
[ ] SDK for easy integration (npm install agentledger-sdk)
[ ] Staking layer — agents put collateral behind their reputation
Built at Synthesis Hackathon 2026 by @_nathcortez