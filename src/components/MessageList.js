import React from "react";
import { Box, Text } from "@chakra-ui/react";
import Message from "./Message";

function MessageList({ messages }) {
  return (
    <Box maxHeight="400px" overflowY="auto">
      {messages.length > 0 ? (
        messages.map((message, index) => (
          <Message key={index} message={message} />
        ))
      ) : (
        <Text>No messages yet...</Text>
      )}
    </Box>
  );
}

export default MessageList;
