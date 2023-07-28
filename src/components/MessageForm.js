import React, { useState, useCallback } from "react";
import { Button, Textarea, useToast } from "@chakra-ui/react";

function MessageForm({ provider, signer, contract, fetchMessages }) {
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
    <>
      <Textarea
        value={newMessage}
        onChange={(e) => setNewMessage(e.target.value)}
        placeholder="Enter your message here"
        bg="whiteAlpha.800"
        color="black"
      />
      <Button
        colorScheme="green"
        onClick={handleSendMessage}
        isLoading={loading}
      >
        Send Message
      </Button>
    </>
  );
}

export default MessageForm;
