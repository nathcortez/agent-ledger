# AgentLedger — Human × AI Conversation Log
**Hackathon:** Synthesis 2026
**Human:** @_nathcortez
**AI Agent:** Joaqui (Claude-based autonomous agent)
**Period:** March 14–17, 2026

---

## Day 1 — Ideation & Architecture (March 14)

**Human:** I want to build something for this hackathon that combines AI agents with blockchain. Something real, not just a demo.

**AI:** Let's think about what agents actually need that doesn't exist yet. The core problem: AI agents are making real decisions — trading, transacting — but there's no way to verify their track record. What if every agent decision was logged onchain? Immutable, public, verifiable. Like a GitHub commit history, but for agent behavior.

**Human:** I like that. What would it look like technically?

**AI:** A Solidity contract with a `logAction()` function. The agent calls it after every decision with: action type (BUY/SELL/HOLD), price, RSI value. The contract emits events that are indexed and queryable. We deploy on Ethereum Sepolia for the main agent, and Status Network Testnet for cross-chain coverage.

**Human:** Ok let's build it. What's the first step?

**AI:** Write the smart contract. Here's `AgentLedger.sol`...

---

## Day 2 — Smart Contract + Agent Loop (March 15)

**Human:** The contract deployed on Sepolia. Address: `0x751BbC1f476e1e4988C8B47C1BFA31A39C6Fe237`

**AI:** Perfect. Now let's build the agent loop. It needs to: fetch ETH candles from Binance → calculate RSI → decide BUY/SELL/HOLD → call `logAction()` on the contract → save TxHash to `agent_log.json`.

**Human:** The agent is running! It logged its first decision onchain.

**AI:** That's the core loop working. Now let's add safety guardrails: max position size, testnet-only flag, requires_onchain_log enforcement, try/catch on every blockchain write.

**Human:** Also deployed on Status Network Testnet: `0x7f7752bdfdbd5d015A03d300fDE0DA51712726cc`

---

## Day 3 — ERC-8004 Identity + Dashboard (March 16)

**Human:** What is ERC-8004 and do we need it?

**AI:** ERC-8004 is an onchain identity standard for AI agents — think of it as a verifiable agent passport. Protocol Labs is running a $8,004 bounty specifically for it. We register AgentLedger's identity on Base Mainnet, get a `participantId`, and that becomes the agent's permanent onchain identity. Yes, we need it.

**Human:** Done. Registration TxHash: `0x235511b0ff66a9b6073fc98892239adc807cc2ccfda3fd181e4adbbb9e01f09e`

**AI:** Now add the participantId to `agent.json` and update the README with the bounty coverage table, safety guardrails section, and compute budget documentation.

**Human:** The dashboard is live at https://agent-ledger-alpha.vercel.app

**AI:** Good. The agent now has: identity (ERC-8004), behavior (onchain logs), and observability (dashboard). That's the full stack.

---

## Day 4 — Uniswap Integration + Submission (March 17)

**Human:** Can we add Uniswap? There's an $8,000 bounty for it.

**AI:** Yes. We'll use the Uniswap Developer Platform API (`/v1/quote`) to get quotes, then execute via the Uniswap v3 SwapRouter on Sepolia. The agent triggers a swap on BUY signals.

**Human:** The API is working. Quote received: 0.0001 ETH → 0.234071 USDC, quoteId: `dfa5906b-5bec-4e20-b5e9-9c5761773d78`

**AI:** Now execute a real swap on Sepolia to get the TxID proof.

**Human:** Swap confirmed! TxHash: `0xf91842a53ebd610e5c93d0d46e044b6adbf95a90bd230581a26a067e0ccc6662`

**AI:** Perfect. That's real ETH→USDC on Sepolia via Uniswap v3 SwapRouter, executed by the agent autonomously on a BUY signal.

**Human:** Agent is running now with 42+ onchain decisions logged.

**AI:** Project is ready to submit. Draft created on Synthesis platform, 5 tracks registered. Waiting for ERC-8004 self-custody transfer to publish.

---

## Technical Decisions Made Together

| Decision | Rationale |
|----------|-----------|
| RSI as signal | Simple, deterministic, explainable — no black box |
| Sepolia + Status Network | Testnet safety + cross-chain coverage for bounties |
| ethers.js v6 | TypeScript-native, ESM compatible |
| agent_log.json | Local receipt of every onchain action |
| ERC-8004 on Base Mainnet | Protocol Labs bounty + permanent identity record |
| Uniswap v3 SwapRouter | Direct contract call for real swap execution |

---

## Key Onchain Proofs

- **ERC-8004 Registration:** https://basescan.org/tx/0x235511b0ff66a9b6073fc98892239adc807cc2ccfda3fd181e4adbbb9e01f09e
- **Uniswap Swap (Sepolia):** https://sepolia.etherscan.io/tx/0xf91842a53ebd610e5c93d0d46e044b6adbf95a90bd230581a26a067e0ccc6662
- **Agent Contract (Sepolia):** https://sepolia.etherscan.io/address/0x751BbC1f476e1e4988C8B47C1BFA31A39C6Fe237
- **Agent Contract (Status Network):** https://sepoliascan.status.network/address/0x7f7752bdfdbd5d015A03d300fDE0DA51712726cc