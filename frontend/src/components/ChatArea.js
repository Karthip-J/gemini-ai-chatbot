import React, { useEffect, useRef } from "react";
import Message from "./Message";
import "../styles/cursor-ai.css";

const ChatArea = ({ messages, isTyping }) => {
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  return (
    <div className="chat-main">
      <div className="chat-messages">
        {messages.map((msg) => (
          <div key={msg._id} className={`message-wrapper ${msg.sender}`}>
            <Message message={msg} />
          </div>
        ))}

        {isTyping && (
          <div className="message-wrapper bot">
            <div className="message bot">
              <div className="message-body">
                <div className="typing-indicator">
                  <div className="dot"></div>
                  <div className="dot"></div>
                  <div className="dot"></div>
                </div>
              </div>
            </div>
          </div>
        )}
        <div ref={bottomRef}></div>
      </div>
    </div>
  );
};

export default ChatArea;
