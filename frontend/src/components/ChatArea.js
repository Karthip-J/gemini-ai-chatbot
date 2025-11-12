import React, { useEffect, useRef } from "react";
import Message from "./Message";

const ChatArea = ({ messages, isTyping }) => {
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  return (
    <div className="chat-area">
      {messages.map((msg) => (
        <Message key={msg._id} message={msg} />
      ))}

      {isTyping && (
        <div className="message bot typing">
          <span className="dots">
            <span>.</span>
            <span>.</span>
            <span>.</span>
          </span>
        </div>
      )}
      <div ref={bottomRef}></div>
    </div>
  );
};

export default ChatArea;
