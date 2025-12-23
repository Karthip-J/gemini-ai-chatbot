import React from "react";
import { useNavigate } from "react-router-dom";
import { Plus, MessageSquare, Trash2, LogOut, Sun, Moon, User } from "lucide-react";
import { useTheme } from "../context/ThemeContext";
import "../styles/cursor-ai.css";

const Sidebar = ({ chats, createChat, deleteChat, loadMessages, currentChat, logout, sidebarOpen }) => {
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const username = localStorage.getItem("username") || "User";

  if (!token) return null;

  return (
    <div className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
      <div className="sidebar-header">
        <button onClick={createChat} className="new-chat-btn">
          <Plus size={16} />
          <span>New Chat</span>
        </button>
      </div>

      <div className="chat-list">
        {chats && chats.length > 0 ? (
          chats.map((chat) => (
            <div
              key={chat._id}
              className={`chat-item ${currentChat?._id === chat._id ? 'active' : ''}`}
              onClick={() => loadMessages(chat)}
            >
              <MessageSquare size={16} />
              <span className="chat-item-title">{chat.title || "New Chat"}</span>
              <button
                onClick={(e) => { e.stopPropagation(); deleteChat(chat._id); }}
                className="delete-chat-btn"
              >
                <Trash2 size={14} />
              </button>
            </div>
          ))
        ) : (
          <div style={{ padding: "20px", textAlign: "center", color: "var(--text-secondary)", fontSize: "14px" }}>
            No chats yet.
          </div>
        )}
      </div>

      <div className="sidebar-footer">
        <button className="footer-item" onClick={toggleTheme}>
          {theme === "light" ? <Moon size={16} /> : <Sun size={16} />}
          <span>{theme === "light" ? "Dark mode" : "Light mode"}</span>
        </button>
        <div className="footer-item">
          <User size={16} />
          <span>{username}</span>
        </div>
        <button className="footer-item" onClick={logout}>
          <LogOut size={16} />
          <span>Log out</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
