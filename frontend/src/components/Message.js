import React from "react";
import ReactMarkdown from "react-markdown";
import "../styles/cursor-ai.css";

const Message = ({ message }) => {
  const isBot = message.sender === "bot";

  return (
    <div className={`message ${isBot ? "bot" : "user"}`}>
      <div className="message-body">
        <ReactMarkdown>{message.content}</ReactMarkdown>
      </div>
    </div>
  );
};

export default Message;
