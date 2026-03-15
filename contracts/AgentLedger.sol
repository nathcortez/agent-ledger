// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract AgentLedger {
    
    struct AgentRecord {
        address agentAddress;
        string agentId;
        string action;      // "HOLD", "BUY", "SELL"
        int256 price;       // precio * 100 (ej: 209358 = $2093.58)
        int256 rsi;         // RSI * 10
        uint256 timestamp;
    }

    AgentRecord[] public records;
    uint256 public totalLogs;

    event ActionLogged(
        address indexed agentAddress,
        string agentId,
        string action,
        int256 price,
        uint256 timestamp
    );

    function logAction(
        string memory agentId,
        string memory action,
        int256 price,
        int256 rsi
    ) public {
        AgentRecord memory record = AgentRecord({
            agentAddress: msg.sender,
            agentId: agentId,
            action: action,
            price: price,
            rsi: rsi,
            timestamp: block.timestamp
        });

        records.push(record);
        totalLogs++;

        emit ActionLogged(msg.sender, agentId, action, price, block.timestamp);
    }

    function getRecord(uint256 index) public view returns (AgentRecord memory) {
        return records[index];
    }

    function getAllRecords() public view returns (AgentRecord[] memory) {
        return records;
    }
}