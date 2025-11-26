import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance, { setAuthToken } from "../utils/axiosInstance";

import Sidebar from "../components/Sidebar";
import ChatArea from "../components/ChatArea";
import InputArea from "../components/InputArea";

const Chatbot = () => {
  const [chats, setChats] = useState([]);
  const [currentChat, setCurrentChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [welcome, setWelcome] = useState("");
  const [motivation, setMotivation] = useState("");
  const navigate = useNavigate();

  // fetch chats
  const fetchChats = useCallback(async () => {
    try {
      const { data } = await axiosInstance.get("/api/chat"); // expects GET /api/chat
      // backend returns array of chats
      if (!data || data.length === 0) {
        const res = await axiosInstance.post("/api/chat", { title: "New Chat" });
        setChats([res.data]);
        setCurrentChat(res.data);
        const m = await axiosInstance.get(`/api/message/${res.data._id}`);
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
      const { data } = await axiosInstance.post("/api/chat", { title: "New Chat" });
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
      await axiosInstance.delete(`/api/chat/${chatId}`);
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
      const { data } = await axiosInstance.get(`/api/message/${chat._id}`);
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

      const { data } = await axiosInstance.post(`/api/message/${currentChat._id}`, { content });

      setIsTyping(false);
      // expect backend to return bot message in data (adjust to controller response shape)
      if (data?.botMessage) setMessages((prev) => [...prev, data.botMessage]);
      else if (Array.isArray(data)) setMessages(data);
    } catch (err) {
      setIsTyping(false);
      console.error("Send message error:", err);
      alert("Error sending message. Please try again.");
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    const username = localStorage.getItem("username");
    if (!token) return navigate("/login");
    setAuthToken(token);

    const motivationalQuotes = [
      "Your curiosity is your greatest strength!",
      "Let’s create something amazing together ✨",
      "Keep learning — every chat builds your knowledge!",
      "You're doing great. Let's solve it step by step 💡",
      "Focus on progress, not perfection 🚀"
    ];

    let timer;
    if (username) {
      setWelcome(`👋 Welcome back, ${username}!`);
      setMotivation(motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)]);
      timer = setTimeout(() => {
        setWelcome("");
        setMotivation("");
      }, 5000);
    }

    fetchChats();
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [fetchChats, navigate]);

  return (
    <div className="chatbot-container" style={{ display: "flex", height: "100vh" }}>
      <Sidebar
        chats={chats}
        loadMessages={selectChat}
        currentChat={currentChat}
        createChat={createChat}
        deleteChat={deleteChat}
        logout={() => {
          localStorage.removeItem("token");
          localStorage.removeItem("username");
          navigate("/login");
        }}
      />

      <div className="chat-section" style={{ flex: 1, position: "relative" }}>
        {welcome && (
          <div style={{
            position: "absolute", top: 16, left: "50%", transform: "translateX(-50%)",
            background: "linear-gradient(90deg,#222,#333)", color: "#fff",
            padding: "12px 20px", borderRadius: 12, zIndex: 20, boxShadow: "0 4px 14px rgba(0,0,0,0.4)",
            textAlign: "center"
          }}>
            <div style={{ fontWeight: 600 }}>{welcome}</div>
            {motivation && <div style={{ marginTop: 6, opacity: 0.9 }}>{motivation}</div>}
          </div>
        )}

        <ChatArea messages={messages} isTyping={isTyping} />
        {currentChat && <InputArea onSend={sendMessage} />}
      </div>
    </div>
  );
};

export default Chatbot;
