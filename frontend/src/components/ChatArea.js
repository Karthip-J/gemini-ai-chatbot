import React, { useEffect, useRef } from "react";
import Message from "./Message";

const ChatArea = ({ messages, isTyping }) => {
  const bottomRef = useRef(null);

  // Auto-scroll to bottom whenever messages update
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  return (
    <div
      className="chat-area"
      style={{
        flex: 1,
        padding: "16px",
        overflowY: "auto",
        backgroundColor: "#121212",
        color: "#fff",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {messages.map((msg) => (
        <Message key={msg._id} message={msg} />
      ))}

      {isTyping && (
        <div
          className="message bot typing"
          style={{
            alignSelf: "flex-start",
            backgroundColor: "#333",
            padding: "8px 12px",
            borderRadius: "8px",
            marginBottom: "8px",
            maxWidth: "70%",
          }}
        >
          <span className="dots" style={{ display: "inline-block" }}>
            <span style={{ animation: "blink 1.4s infinite" }}>.</span>
            <span style={{ animation: "blink 1.4s infinite 0.2s" }}>.</span>
            <span style={{ animation: "blink 1.4s infinite 0.4s" }}>.</span>
          </span>
        </div>
      )}
      <div ref={bottomRef}></div>
    </div>
  );
};

export default ChatArea;
