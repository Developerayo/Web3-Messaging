import React, { useCallback } from "react";
import { Button, useToast, useColorModeValue } from "@chakra-ui/react";

function LoginButton({ provider, fetchMessages }) {
  const toast = useToast();
  const colorScheme = useColorModeValue("blue", "yellow");

  const handleLogin = useCallback(async () => {
    try {
      await provider.request({ method: "eth_requestAccounts" });
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
    <Button colorScheme={colorScheme} onClick={handleLogin} size="lg" my={4}>
      Login with MetaMask
    </Button>
  );
}

export default LoginButton;
