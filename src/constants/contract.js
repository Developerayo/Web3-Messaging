export const contractABI = [
        { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "uint256", "name": "messageId", "type": "uint256" }, { "indexed": true, "internalType": "address", "name": "sender", "type": "address" }, { "indexed": false, "internalType": "string", "name": "content", "type": "string" }, { "indexed": false, "internalType": "uint256", "name": "timestamp", "type": "uint256" }], "name": "NewMessage", "type": "event" },
        { "inputs": [], "name": "getMessageCount", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" },
        { "inputs": [], "name": "getMessages", "outputs": [{ "components": [{ "internalType": "address", "name": "sender", "type": "address" }, { "internalType": "string", "name": "content", "type": "string" }, { "internalType": "uint256", "name": "timestamp", "type": "uint256" }], "internalType": "struct Messaging.Message[]", "name": "", "type": "tuple[]" }], "stateMutability": "view", "type": "function" },
        { "inputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "name": "messages", "outputs": [{ "internalType": "address", "name": "sender", "type": "address" }, { "internalType": "string", "name": "content", "type": "string" }, { "internalType": "uint256", "name": "timestamp", "type": "uint256" }], "stateMutability": "view", "type": "function" },
        { "inputs": [{ "internalType": "string", "name": "content", "type": "string" }], "name": "sendMessage", "outputs": [], "stateMutability": "nonpayable", "type": "function" }
      ];
  
  export const contractAddress = '0x218B6a0234e1070ca7753dF497a135A7d92ED55A';
  