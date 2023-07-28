import React from "react";
import { Box, Text } from "@chakra-ui/react";
import InfiniteScroll from "react-infinite-scroll-component";
import Message from "./Message";

function MessageList({ messages, loading, fetchMessages, hasMore }) {
  return (
    <Box maxHeight="70vh" overflowY="auto">
      <InfiniteScroll
        dataLength={messages.length}
        next={fetchMessages}
        hasMore={hasMore}
        loader={<h4>Loading...</h4>}
        endMessage={
          <p style={{ textAlign: "center" }}>
            <b>Yay! You have seen it all</b>
          </p>
        }
      >
        {messages.length > 0 ? (
          messages.map((message, index) => (
            <Message key={index} message={message} />
          ))
        ) : (
          <Text>No messages yet...</Text>
        )}
      </InfiniteScroll>
    </Box>
  );
}

export default MessageList;
