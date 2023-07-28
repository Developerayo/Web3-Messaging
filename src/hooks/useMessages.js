import { useState, useEffect, useCallback } from "react";
import { useToast } from "@chakra-ui/react";

export function useMessages(contract) {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const toast = useToast();

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

  return { messages, fetchMessages, loading };
}
