import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance, { setAuthToken } from "../utils/axiosInstance";
import "../styles/cursor-ai.css";

import Sidebar from "../components/Sidebar";
import ChatArea from "../components/ChatArea";
import InputArea from "../components/InputArea";
import { Menu } from "lucide-react";

const Chatbot = () => {
  const [chats, setChats] = useState([]);
  const [currentChat, setCurrentChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();

  // fetch chats
  const fetchChats = useCallback(async () => {
    try {
      const { data } = await axiosInstance.get("/chat"); // expects GET /api/chat
      // backend returns array of chats
      if (!data || data.length === 0) {
        const res = await axiosInstance.post("/chat", { title: "New Chat" });
        setChats([res.data]);
        setCurrentChat(res.data);
        const m = await axiosInstance.get(`/message/${res.data._id}`);
        setMessages(m.data || []);
        return;
      }
      setChats(data);
      if (!currentChat && data[0]) {
        await selectChat(data[0]);
      }
    } catch (err) {
      console.error("Error fetching chats:", err);
      if (err.response?.status === 401) {
        // not authenticated
        navigate("/login");
      }
    }
  }, [currentChat, navigate]);

  // create new chat
  const createChat = async () => {
    try {
      const { data } = await axiosInstance.post("/chat", { title: "New Chat" });
      setChats((prev) => [data, ...prev]);
      await selectChat(data);
    } catch (err) {
      console.error("Error creating new chat:", err);
      alert("Failed to create a new chat.");
    }
  };

  // delete chat
  const deleteChat = async (chatId) => {
    if (!window.confirm("Are you sure you want to delete this chat?")) return;
    try {
      await axiosInstance.delete(`/chat/${chatId}`);
      setChats((prev) => prev.filter((c) => c._id !== chatId));
      if (currentChat?._id === chatId) {
        setCurrentChat(null);
        setMessages([]);
      }
    } catch (err) {
      console.error("Error deleting chat:", err);
      alert("Failed to delete chat");
    }
  };

  // select chat
  const selectChat = async (chat) => {
    setCurrentChat(chat);
    try {
      const { data } = await axiosInstance.get(`/message/${chat._id}`);
      // assume backend returns array of messages
      setMessages(Array.isArray(data) ? data : data.messages || []);
    } catch (err) {
      console.error("Error fetching messages:", err);
      setMessages([]);
    }
  };

  // send message
  const sendMessage = async (content) => {
    if (!content || !currentChat) return;
    try {
      const userMessage = { _id: Date.now(), sender: "user", content };
      setMessages((prev) => [...prev, userMessage]);
      setIsTyping(true);

      const { data } = await axiosInstance.post(`/message/${currentChat._id}`, { content });

      setIsTyping(false);
      // expect backend to return bot message and potentially a new chat title
      if (data?.botMessage) {
        setMessages((prev) => [...prev, data.botMessage]);
      } else if (Array.isArray(data)) {
        setMessages(data);
      }

      // Update chat title in sidebar if changed
      if (data?.chatTitle) {
        setChats((prev) =>
          prev.map((c) =>
            c._id === currentChat._id ? { ...c, title: data.chatTitle } : c
          )
        );
        setCurrentChat((prev) => ({ ...prev, title: data.chatTitle }));
      }
    } catch (err) {
      setIsTyping(false);
      console.error("Send message error:", err);
      alert("Error sending message. Please try again.");
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return navigate("/login");
    setAuthToken(token);

    fetchChats();
  }, [fetchChats, navigate]);

  return (
    <div className="chat-container">
      <div
        className={`sidebar-overlay ${sidebarOpen ? 'visible' : ''}`}
        onClick={() => setSidebarOpen(false)}
      ></div>
      <Sidebar
        chats={chats}
        loadMessages={(chat) => {
          selectChat(chat);
          setSidebarOpen(false);
        }}
        currentChat={currentChat}
        createChat={() => {
          createChat();
          setSidebarOpen(false);
        }}
        deleteChat={deleteChat}
        sidebarOpen={sidebarOpen}
        logout={() => {
          localStorage.removeItem("token");
          localStorage.removeItem("username");
          navigate("/login");
        }}
      />
      <div style={{ flex: 1, position: "relative", height: "100%", display: "flex", flexDirection: "column" }}>
        <header className="mobile-header">
          <button className="menu-toggle" onClick={() => setSidebarOpen(true)}>
            <Menu size={24} />
          </button>
          <span style={{ fontWeight: 600 }}>{currentChat?.title || "Gemini"}</span>
          <div style={{ width: 24 }}></div>
        </header>
        <ChatArea messages={messages} isTyping={isTyping} />
        {currentChat && <InputArea onSend={sendMessage} />}
      </div>
    </div>
  );
};

export default Chatbot;
