import React from "react";
import {
  Flex,
  Heading,
  Container,
} from "@chakra-ui/react";
import { useEthereum } from "./hooks/useEthereum";
import { useMessages } from "./hooks/useMessages";
import MessageList from "./components/MessageList";
import MessageForm from "./components/MessageForm";
import LoginButton from "./components/LoginButton";

function App() {
  const { provider, signer, contract } = useEthereum();
  const { messages, fetchMessages, loading, page, setPage } =
    useMessages(contract);

  return (
    <Flex
      direction="column"
      align="center"
      justify="center"
      minHeight="100vh"
      color="white"
    >
      <Container
        centerContent
        maxW="container.md"
        bg="whiteAlpha.200"
        borderRadius="xl"
        p={6}
      >
        <Heading mb={6} textAlign="center">
          Web3 Messaging App
        </Heading>
        <LoginButton provider={provider} fetchMessages={fetchMessages} />
        <MessageList
          messages={messages}
          loading={loading}
          page={page}
          setPage={setPage}
        />
        <MessageForm
          provider={provider}
          signer={signer}
          contract={contract}
          fetchMessages={fetchMessages}
        />
      </Container>
    </Flex>
  );
}

export default App;
