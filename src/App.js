import { useEffect, useState, useCallback } from 'react';
import { ethers } from 'ethers';
import detectEthereumProvider from '@metamask/detect-provider';
import { Box, Button, Input, VStack, HStack, Text } from "@chakra-ui/react";

const contractABI = [
  { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "uint256", "name": "messageId", "type": "uint256" }, { "indexed": true, "internalType": "address", "name": "sender", "type": "address" }, { "indexed": false, "internalType": "string", "name": "content", "type": "string" }, { "indexed": false, "internalType": "uint256", "name": "timestamp", "type": "uint256" }], "name": "NewMessage", "type": "event" },
  { "inputs": [], "name": "getMessageCount", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" },
  { "inputs": [], "name": "getMessages", "outputs": [{ "components": [{ "internalType": "address", "name": "sender", "type": "address" }, { "internalType": "string", "name": "content", "type": "string" }, { "internalType": "uint256", "name": "timestamp", "type": "uint256" }], "internalType": "struct Messaging.Message[]", "name": "", "type": "tuple[]" }], "stateMutability": "view", "type": "function" },
  { "inputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "name": "messages", "outputs": [{ "internalType": "address", "name": "sender", "type": "address" }, { "internalType": "string", "name": "content", "type": "string" }, { "internalType": "uint256", "name": "timestamp", "type": "uint256" }], "stateMutability": "view", "type": "function" },
  { "inputs": [{ "internalType": "string", "name": "content", "type": "string" }], "name": "sendMessage", "outputs": [], "stateMutability": "nonpayable", "type": "function" }
];

const contractAddress = '0x218B6a0234e1070ca7753dF497a135A7d92ED55A';

function App() {
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [contract, setContract] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');

  useEffect(() => {
    async function initialize() {
      const ethereumProvider = await detectEthereumProvider();

      if (ethereumProvider) {
        const ethersProvider = new ethers.providers.Web3Provider(ethereumProvider);
        const signer = ethersProvider.getSigner();
        const contract = new ethers.Contract(contractAddress, contractABI, ethersProvider);
        setProvider(ethereumProvider);
        setSigner(signer);
        setContract(contract);
      }
    }

    initialize();
  }, []);

  useEffect(() => {
    if (contract) {
      fetchMessages();
    }
  }, [contract, fetchMessages]);

  async function fetchMessages() {
    const count = await contract.getMessageCount();
    const fetchedMessages = [];

    for (let i = 0; i < count; i++) {
      const message = await contract.messages(i);
      fetchedMessages.push(message);
    }

    setMessages(fetchedMessages);
  }

  async function handleSendMessage() {
    const accounts = await provider.request({ method: 'eth_accounts' });

    if (accounts.length === 0) {
      await handleLogin();
    }

    await contract.connect(signer).sendMessage(newMessage);
    fetchMessages();
    setNewMessage('');
  }

  async function handleLogin() {
    await provider.request({ method: 'eth_requestAccounts' });
    fetchMessages();
  }

  return (
    <VStack padding={4}>
      <Button colorScheme="teal" onClick={handleLogin}>Login with MetaMask</Button>
      <VStack spacing={4} align="stretch">
        {messages.map((message, index) => (
          <Box key={index} border="1px" borderRadius="md" padding={4}>
            <HStack spacing={4}>
              <Text>Sender:</Text>
              <Text>{message.sender}</Text>
            </HStack>
            <HStack spacing={4}>
              <Text>Content:</Text>
              <Text>{message.content}</Text>
            </HStack>
            <HStack spacing={4}>
              <Text>Timestamp:</Text>
              <Text>{new Date(message.timestamp * 1000).toLocaleString()}</Text>
            </HStack>
          </Box>
        ))}
      </VStack>
      <HStack spacing={4}>
        <textarea
          type="text"
          value={newMessage}
          onChange={e => setNewMessage(e.target.value)}
        />
        <Button colorScheme="teal" onClick={handleSendMessage}>Send Message</Button>
      </HStack>
    </VStack>
  );
}

export default App;