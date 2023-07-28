import React, { useState, useCallback } from "react";
import { Button, Textarea, useToast, VStack } from "@chakra-ui/react";

function MessageForm({
  provider,
  signer,
  contract,
  fetchMessages,
  addNewMessage,
}) {
  const [newMessage, setNewMessage] = useState("");
  const toast = useToast();
  const [loading, setLoading] = useState(false);

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
        const message = {
          sender: await signer.getAddress(),
          content: newMessage,
          timestamp: Math.floor(Date.now() / 1000),
        };
  
        await contract.connect(signer).sendMessage(newMessage);
        setNewMessage("");
        addNewMessage(message);
        setTimeout(fetchMessages, 5000);
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
  }, [
    provider,
    signer,
    contract,
    newMessage,
    fetchMessages,
    toast,
    addNewMessage,
  ]);
  

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
        onClick={handleSendMessage}
        isLoading={loading}
      >
        Send Message
      </Button>
    </VStack>
  );
}

export default MessageForm;
