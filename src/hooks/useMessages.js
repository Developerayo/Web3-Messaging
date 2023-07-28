import { useState, useEffect, useCallback } from "react";
import { useToast } from "@chakra-ui/react";

export function useMessages(contract) {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const toast = useToast();

  const fetchMessages = useCallback(async () => {
    setLoading(true);
    try {
      const count = await contract.getMessageCount();
      const fetchedMessages = [];

      for (let i = count - 1; i >= 0; i--) {
        const message = await contract.messages(i);
        fetchedMessages.push(message);
        if (fetchedMessages.length >= 20) {
          break;
        }
      }

      setMessages((prevMessages) => [...prevMessages, ...fetchedMessages]);
      if (fetchedMessages.length < 20) {
        setHasMore(false);
      }
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

  const addNewMessage = useCallback((message) => {
    setMessages((prevMessages) => [message, ...prevMessages]);
  }, []);
  
  return { messages, fetchMessages, loading, hasMore, addNewMessage };
}
