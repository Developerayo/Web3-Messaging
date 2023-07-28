import React from "react";
import { Box, Text, Spinner } from "@chakra-ui/react";
import Message from "./Message";

function MessageList({ messages, loading }) {
  return (
    <Box maxHeight="70vh" overflowY="auto">
      {loading ? (
        <Spinner />
      ) : messages.length > 0 ? (
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
