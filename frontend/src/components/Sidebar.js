import React from "react";
import { useNavigate } from "react-router-dom";

const Sidebar = ({ chats, createChat, deleteChat, loadMessages, currentChat, logout }) => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  if (!token) return null;

  return (
    <div className="sidebar" style={{ width: "250px", backgroundColor: "#1f1f1f", color: "#fff", display: "flex", flexDirection: "column", padding: "10px", height: "100vh" }}>
      <h2 style={{ textAlign: "center", marginBottom: "10px" }}>Chats</h2>

      <button onClick={createChat} style={{ margin: "10px 0", padding: "8px", backgroundColor: "#3a3a3a", color: "#fff", border: "none", cursor: "pointer", borderRadius: "4px" }}>
        + New Chat
      </button>

      <div className="chat-list" style={{ flex: 1, overflowY: "auto" }}>
        {chats && chats.length > 0 ? (
          chats.map((chat) => (
            <div key={chat._id} onClick={() => loadMessages(chat)} style={{ padding: "10px", marginBottom: "6px", cursor: "pointer", backgroundColor: currentChat?._id === chat._id ? "#3a3a3a" : "transparent", borderRadius: "6px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ maxWidth: "150px", overflow: "hidden", whiteSpace: "nowrap", textOverflow: "ellipsis" }}>{chat.title || "New Chat"}</span>
              <button onClick={(e) => { e.stopPropagation(); deleteChat(chat._id); }} style={{ background: "#ff3b3b", border: "none", color: "#fff", borderRadius: "3px", cursor: "pointer", padding: "2px 6px", fontSize: "12px" }}>X</button>
            </div>
          ))
        ) : (
          <p style={{ textAlign: "center", marginTop: "20px" }}>No chats available.<br/>Create one!</p>
        )}
      </div>

      <button onClick={logout} style={{ marginTop: "10px", padding: "10px", backgroundColor: "#ff4d4d", color: "#fff", border: "none", cursor: "pointer", borderRadius: "4px" }}>
        Logout
      </button>
    </div>
  );
};

export default Sidebar;
