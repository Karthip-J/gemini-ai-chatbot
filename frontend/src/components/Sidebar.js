import React from "react";
import { Trash2, Plus } from "lucide-react";

const Sidebar = ({ chats, selectChat, currentChat, createNewChat, deleteChat, logout }) => {
  return (
    <div
      className="sidebar"
      style={{
        width: "280px",
        backgroundColor: "#1e1e1e",
        color: "white",
        display: "flex",
        flexDirection: "column",
        padding: "1rem",
        height: "100vh",
      }}
    >
      <h2 style={{ fontSize: "1.6rem", fontWeight: "bold", marginBottom: "1rem" }}>
        Gemini Chat
      </h2>

      <button
        onClick={createNewChat}
        style={{
          backgroundColor: "#007bff",
          color: "white",
          border: "none",
          padding: "10px",
          borderRadius: "6px",
          marginBottom: "1rem",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "6px",
          fontWeight: "500",
        }}
      >
        <Plus size={16} /> New Chat
      </button>

      <div style={{ flexGrow: 1, overflowY: "auto" }}>
        {chats.map((chat) => (
          <div
            key={chat._id}
            onClick={() => selectChat(chat)}
            style={{
              backgroundColor:
                currentChat?._id === chat._id ? "#3a3a3a" : "transparent",
              padding: "10px 12px",
              borderRadius: "8px",
              marginBottom: "6px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              cursor: "pointer",
              transition: "background 0.2s ease",
            }}
          >
            <span style={{ flex: 1, overflow: "hidden", textOverflow: "ellipsis" }}>
              {chat.title}
            </span>
            <Trash2
              size={16}
              color="#bbb"
              onClick={(e) => {
                e.stopPropagation();
                deleteChat(chat._id);
              }}
              style={{
                cursor: "pointer",
                marginLeft: "10px",
              }}
              onMouseEnter={(e) => (e.target.style.color = "#ff4d4d")}
              onMouseLeave={(e) => (e.target.style.color = "#bbb")}
            />
          </div>
        ))}
      </div>

      <button
        onClick={logout}
        style={{
          backgroundColor: "#333",
          color: "#fff",
          border: "1px solid #444",
          borderRadius: "6px",
          padding: "10px",
          marginTop: "auto",
          cursor: "pointer",
          fontWeight: "500",
          transition: "background 0.2s ease",
        }}
        onMouseEnter={(e) => (e.target.style.backgroundColor = "#555")}
        onMouseLeave={(e) => (e.target.style.backgroundColor = "#333")}
      >
        Logout
      </button>
    </div>
  );
};

export default Sidebar;
