# ⛓ AgentLedger

> On-chain reputation infrastructure for autonomous agents.

**Live Dashboard:** https://agent-ledger-alpha.vercel.app  
**Contract (Sepolia):** `0x751BbC1f476e1e4988C8B47C1BFA31A39C6Fe237`  
**Agent Address:** `0x7E5F4552091A69125d5DfCb7b8C2659029395Bdf`

---

## The Problem

Autonomous agents are making real decisions — trading, transacting, negotiating — but there's no way to verify their track record. You can't trust an agent you can't audit.

## The Solution

AgentLedger is a public infrastructure layer that lets any autonomous agent log its actions on-chain. Every decision becomes a verifiable, permanent record. Agents build reputation over time. Humans can audit, compare, and trust.

Think: **GitHub for agent behavior** — but immutable and on-chain.

---

## How It Works

Agent runs → makes a decision (BUY/SELL/HOLD) ↓ Calls logAction() on AgentLedger smart contract ↓ Decision stored on Ethereum Sepolia (permanent, public) ↓ Dashboard reads all events → shows reputation score + history


---

## Live Demo

The trading agent monitors ETH price in real-time, calculates RSI, and logs every decision on-chain with a verified TxHash.

→ **[View Dashboard](https://agent-ledger-alpha.vercel.app)**

---

## Tech Stack

| Layer | Tech |
|-------|------|
| Smart Contract | Solidity 0.8.24, Hardhat 3 |
| Network | Ethereum Sepolia testnet |
| Agent | TypeScript, Node.js, ethers.js v6 |
| Market Data | Binance public API |
| Dashboard | Next.js 16, Tailwind CSS |
| Deploy | Vercel |

---

## Smart Contract

**`AgentLedger.sol`** — deployed on Sepolia at `0x751BbC1f476e1e4988C8B47C1BFA31A39C6Fe237`

```solidity
function logAction(
    address agentId,
    string memory action,   // "BUY" | "SELL" | "HOLD"
    uint256 price,          // ETH price in USD (×100)
    uint256 rsi             // RSI value (×100)
) external
Any agent can call this contract. Each log is a permanent on-chain receipt.

Agent Identity (ERC-8004)
{
  "agent": "AgentLedger Trading Bot",
  "version": "1.0.0",
  "address": "0x7E5F4552091A69125d5DfCb7b8C2659029395Bdf",
  "capabilities": ["trade", "log", "report"],
  "standard": "ERC-8004"
}
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

Roadmap
[ ] Multi-agent explorer (search any agent by address)
[ ] ENS integration (human-readable agent names)
[ ] Cross-chain support (Base, Arbitrum, Status Network)
[ ] SDK for easy integration (npm install agentledger-sdk)
[ ] Staking layer — agents put collateral behind their reputation
Bounties
Protocol Labs — Agents With Receipts: On-chain verifiable agent actions with ERC-8004 identity
- **ENS — Agent Identity**: Human-readable names for autonomous agents. 
  The dashboard resolves any agent's wallet address to its ENS name automatically. 
  Agents can register `agentname.eth` and appear with their identity across the ecosystem.
Status Network: Cross-chain reputation infrastructure
Uniswap — Agentic Finance: Autonomous trading with on-chain audit trail
Built at Synthesis Hackathon 2026 by @_nathcortez

