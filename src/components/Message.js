import React from "react";
import { Box, HStack, Text, VStack, useColorModeValue } from "@chakra-ui/react";

function Message({ message }) {
  const bg = useColorModeValue("white", "gray.700");
  const color = useColorModeValue("black", "white");

  return (
    <Box
      border="1px"
      borderRadius="lg"
      padding={4}
      bg={bg}
      color={color}
      my={2}
      boxShadow="lg"
    >
      <VStack align="start" spacing={2}>
        <HStack spacing={4}>
          <Text fontWeight="bold">Sender:</Text>
          <Text>{message.sender}</Text>
        </HStack>
        <HStack spacing={4}>
          <Text fontWeight="bold">Message:</Text>
          <Text>{message.content}</Text>
        </HStack>
        <HStack spacing={4}>
          <Text fontWeight="bold">Timestamp:</Text>
          <Text>{new Date(message.timestamp * 1000).toLocaleString()}</Text>
        </HStack>
      </VStack>
    </Box>
  );
}

export default Message;
