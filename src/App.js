import { useEffect, useState, useCallback } from 'react';
import { ethers } from 'ethers';
import detectEthereumProvider from '@metamask/detect-provider';
import { Box, Button, VStack, HStack, Text, Textarea, useToast, Spinner, Flex, Heading } from "@chakra-ui/react";

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
  const [loading, setLoading] = useState(false);
  const toast = useToast();

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

  const fetchMessages = useCallback(async () => {
    setLoading(true);
    try {
      const count = await contract.getMessageCount();
      const fetchedMessages = [];

      for (let i = 0; i < count; i++) {
        const message = await contract.messages(i);
        fetchedMessages.push(message);
      }

      setMessages(fetchedMessages);
    } catch (err) {
      toast({
        title: "Error fetching messages",
        description: err.message,
        status: "error",
        duration: 9000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  }, [contract, toast]);

  useEffect(() => {
    if (contract) {
      fetchMessages();
    }
  }, [contract, fetchMessages]);

  const handleSendMessage = useCallback(async () => {
    if (!newMessage.trim()) {
      toast({
        title: "Message cannot be empty",
        status: "error",
        duration: 9000,
        isClosable: true,
      });
      return;
    }

    setLoading(true);
    try {
      const accounts = await provider.request({ method: 'eth_accounts' });

      if (accounts.length === 0) {
        await handleLogin();
      }

      await contract.connect(signer).sendMessage(newMessage);
      setTimeout(fetchMessages, 5000);
      setNewMessage('');
    } catch (err) {
      toast({
        title: "Error sending message",
        description: err.message,
        status: "error",
        duration: 9000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  }, [provider, signer, contract, newMessage, fetchMessages, toast]);

  const handleLogin = useCallback(async () => {
    try {
      await provider.request({ method: 'eth_requestAccounts' });
      fetchMessages();
    } catch (err) {
      toast({
        title: "Login error",
        description: err.message,
        status: "error",
        duration: 9000,
        isClosable: true,
      });
    }
  }, [provider, fetchMessages, toast]);

  return (
    <Flex 
      direction="column" 
      align="center" 
      justify="center" 
      minHeight="100vh" 
      bg="teal.500"
      color="white"
    >
      <Box maxWidth="800px" width="100%" padding={4} bg="whiteAlpha.200" borderRadius="md">
        <Heading mb={6} textAlign="center">Web3 Messaging App</Heading>
        <VStack spacing={4} align="stretch">
          <Button colorScheme="orange" onClick={handleLogin}>Login with MetaMask</Button>
          {messages.length > 0 ? (
            messages.map((message, index) => (
              <Box key={index} border="1px" borderRadius="md" padding={4} bg="whiteAlpha.800" color="black">
                <HStack spacing={4}>
                  <Text fontWeight="bold">Sender:</Text>
                  <Text>{message.sender}</Text>
                </HStack>
                <HStack spacing={4}>
                  <Text fontWeight="bold">Content:</Text>
                  <Text>{message.content}</Text>
                </HStack>
                <HStack spacing={4}>
                  <Text fontWeight="bold">Timestamp:</Text>
                  <Text>{new Date(message.timestamp * 1000).toLocaleString()}</Text>
                </HStack>
              </Box>
            ))
          ) : (
            <Text>No messages yet...</Text>
          )}
          <VStack spacing={4} align="stretch">
            <Textarea
              value={newMessage}
              onChange={e => setNewMessage(e.target.value)}
              placeholder="Enter your message here"
              bg="whiteAlpha.800"
              color="black"
            />
            <Button colorScheme="green" onClick={handleSendMessage} isLoading={loading}>Send Message</Button>
          </VStack>
        </VStack>
        {loading && <Spinner />}
      </Box>
    </Flex>
  );
}

export default App;