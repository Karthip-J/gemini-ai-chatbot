import React, { useState } from "react";

const InputArea = ({ onSend }) => {
  const [content, setContent] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!content.trim()) return;
    onSend(content);
    setContent("");
  };

  return (
    <form
      className="input-area"
      onSubmit={handleSubmit}
      style={{
        display: "flex",
        padding: "10px",
        borderTop: "1px solid #333",
        backgroundColor: "#1a1a1a",
      }}
    >
      <input
        type="text"
        placeholder="Type your message..."
        value={content}
        onChange={(e) => setContent(e.target.value)}
        style={{
          flex: 1,
          padding: "10px",
          borderRadius: "8px",
          border: "none",
          outline: "none",
          marginRight: "8px",
          backgroundColor: "#333",
          color: "#fff",
        }}
      />
      <button
        type="submit"
        style={{
          padding: "10px 16px",
          borderRadius: "8px",
          border: "none",
          backgroundColor: "#4caf50",
          color: "#fff",
          cursor: "pointer",
        }}
      >
        Send
      </button>
    </form>
  );
};

export default InputArea;
