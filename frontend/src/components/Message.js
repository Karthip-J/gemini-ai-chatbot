import React from "react";
import ReactMarkdown from "react-markdown";

const Message = ({ message }) => (
  <div className={`message ${message.sender}`}>
    {message.sender === "bot" ? (
      <ReactMarkdown>{message.content}</ReactMarkdown>
    ) : (
      message.content
    )}
  </div>
);

export default Message;
