import React from "react";
import ReactMarkdown from "react-markdown";

const Message = ({ message }) => {
  const isBot = message.sender === "bot";

  return (
    <div
      className={`message ${isBot ? "bot" : "user"}`}
      style={{
        alignSelf: isBot ? "flex-start" : "flex-end",
        backgroundColor: isBot ? "#333" : "#4caf50",
        color: "#fff",
        padding: "10px 14px",
        borderRadius: "12px",
        marginBottom: "8px",
        maxWidth: "70%",
        wordBreak: "break-word",
      }}
    >
      {isBot ? (
        <ReactMarkdown>{message.content}</ReactMarkdown>
      ) : (
        message.content
      )}
    </div>
  );
};

export default Message;
