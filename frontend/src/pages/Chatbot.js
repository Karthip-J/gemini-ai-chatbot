import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance,{  setAuthToken } from "../utils/axiosInstance";

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

  // Fetch chats, auto-create if none exist
  const fetchChats = useCallback(async () => {
    try {
      let { data } = await axiosInstance.get("/chat");

      if (!data || data.length === 0) {
        const res = await axiosInstance.post("/chat", { title: "New Chat" });
        data = [res.data];
      }

      setChats(data);
      // select first chat only if not already selected (prevents extra fetch on re-renders)
      if (!currentChat && data[0]) {
        selectChat(data[0]);
      }
    } catch (err) {
      console.error("Error fetching chats:", err);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // fetchChats intentionally stable

  // Create new chat
  const createNewChat = async () => {
    try {
      const { data } = await axiosInstance.post("/chat", {});
      setChats((prev) => [data, ...prev]);
      await selectChat(data);
    } catch (err) {
      console.error("Error creating new chat:", err);
      alert("Failed to create a new chat.");
    }
  };

  // Delete chat
  const deleteChat = async (chatId) => {
    if (!window.confirm("Are you sure you want to delete this chat?")) return;
    try {
      await axiosInstance.delete(`/chat/${chatId}`);
      setChats((prev) => prev.filter((chat) => chat._id !== chatId));
      if (currentChat && currentChat._id === chatId) {
        setCurrentChat(null);
        setMessages([]);
      }
    } catch (err) {
      console.error("Error deleting chat:", err);
      alert("Failed to delete chat");
    }
  };

  // Select chat and fetch messages
  const selectChat = async (chat) => {
    setCurrentChat(chat);
    try {
      const { data } = await axiosInstance.get(`/message/${chat._id}`);
      setMessages(data);
    } catch (err) {
      console.error("Error fetching messages:", err);
      setMessages([]);
    }
  };

  // Send message
  const sendMessage = async (content) => {
    if (!content.trim() || !currentChat) return;
    try {
      const userMessage = { content, sender: "user", _id: Date.now() };
      setMessages((prev) => [...prev, userMessage]);
      setIsTyping(true);

      const { data } = await axiosInstance.post(
        `/message/${currentChat._id}`,
        { content }
      );

      setIsTyping(false);
      setMessages((prev) => [...prev, data.botMessage]);
    } catch (err) {
      setIsTyping(false);
      console.error("Send message error:", err);
      alert("Error sending message. Please try again.");
    }
  };

  // Welcome + motivation (no animation)
  useEffect(() => {
    const token = localStorage.getItem("token");
    const username = localStorage.getItem("username");
    if (!token) return navigate("/login");
    setAuthToken(token);

    // quotes defined inside effect to avoid eslint dependency warnings
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
      const randomQuote =
        motivationalQuotes[
          Math.floor(Math.random() * motivationalQuotes.length)
        ];
      setMotivation(randomQuote);

      timer = setTimeout(() => {
        setWelcome("");
        setMotivation("");
      }, 5000);
    }

    // fetch chats after setting token
    fetchChats();

    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [fetchChats, navigate]);

  return (
    <div className="chatbot-container" style={{ display: "flex", height: "100vh" }}>
      <Sidebar
        chats={chats}
        selectChat={selectChat}
        currentChat={currentChat}
        createNewChat={createNewChat}
        deleteChat={deleteChat}
        // pass logout if your Sidebar expects it:
        logout={() => {
          localStorage.removeItem("token");
          localStorage.removeItem("username");
          navigate("/login");
        }}
      />

      <div className="chat-section" style={{ flex: 1, position: "relative" }}>
        {/* Simple welcome banner (no animation) */}
        {welcome && (
          <div
            style={{
              position: "absolute",
              top: 16,
              left: "50%",
              transform: "translateX(-50%)",
              background: "linear-gradient(90deg,#222,#333)",
              color: "#fff",
              padding: "12px 20px",
              borderRadius: 12,
              zIndex: 20,
              boxShadow: "0 4px 14px rgba(0,0,0,0.4)",
              textAlign: "center",
            }}
          >
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
