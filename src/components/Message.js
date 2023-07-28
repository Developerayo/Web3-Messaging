import React from "react";
import { Box, HStack, Text } from "@chakra-ui/react";

function Message({ message }) {
  return (
    <Box
      border="1px"
      borderRadius="md"
      padding={4}
      bg="whiteAlpha.800"
      color="black"
    >
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
    </Box>
  );
}

export default Message;
