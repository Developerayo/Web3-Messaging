import React from 'react';
import { Box, Flex, Heading } from "@chakra-ui/react";
import { useEthereum } from './hooks/useEthereum';
import { useMessages } from './hooks/useMessages';
import MessageList from './components/MessageList';
import MessageForm from './components/MessageForm';
import LoginButton from './components/LoginButton';

function App() {
  const { provider, signer, contract } = useEthereum();
  const { messages, fetchMessages } = useMessages(contract);

  return (
    <Flex direction="column" align="center" justify="center" minHeight="100vh" bg="teal.500" color="white">
      <Box maxWidth="800px" width="100%" padding={4} bg="whiteAlpha.200" borderRadius="md">
        <Heading mb={6} textAlign="center">Web3 Messaging App</Heading>
        <LoginButton provider={provider} fetchMessages={fetchMessages} />
        <MessageList messages={messages} />
        <MessageForm provider={provider} signer={signer} contract={contract} fetchMessages={fetchMessages} />
      </Box>
    </Flex>
  );
}

export default App;
