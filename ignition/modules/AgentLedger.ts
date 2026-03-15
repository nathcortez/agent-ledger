import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const AgentLedgerModule = buildModule("AgentLedgerModule", (m) => {
  const agentLedger = m.contract("AgentLedger");
  return { agentLedger };
});

export default AgentLedgerModule;