import React, { useState, useCallback } from "react";
import {
  Button,
  Textarea,
  useToast,
  VStack,
  useColorModeValue,
} from "@chakra-ui/react";

function MessageForm({ provider, signer, contract, fetchMessages }) {
  const [newMessage, setNewMessage] = useState("");
  const toast = useToast();
  const [loading, setLoading] = useState(false);
  const colorScheme = useColorModeValue("teal", "orange");

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
      let accounts = await provider.request({ method: "eth_accounts" });

      if (accounts.length === 0) {
        await provider.request({ method: "eth_requestAccounts" });
        accounts = await provider.request({ method: "eth_accounts" });
      }

      if (accounts.length > 0) {
        await contract.connect(signer).sendMessage(newMessage);
        setTimeout(fetchMessages, 5000);
        setNewMessage("");
      }
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

  return (
    <VStack align="stretch" spacing={4} my={4}>
      <Textarea
        value={newMessage}
        onChange={(e) => setNewMessage(e.target.value)}
        placeholder="Enter your message here"
        bg="white"
        color="black"
      />
      <Button
        colorScheme={colorScheme}
        onClick={handleSendMessage}
        isLoading={loading}
      >
        Send Message
      </Button>
    </VStack>
  );
}

export default MessageForm;
