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
  const navigate = useNavigate();

  // Fetch chats, auto-create if none exist
  const fetchChats = useCallback(async () => {
    try {
      let { data } = await axiosInstance.get("/chat");

      if (data.length === 0) {
        // No chats exist for this user, create a new chat
        const res = await axiosInstance.post("/chat", { title: "New Chat" });

        data = [res.data];
      }

      setChats(data);
      selectChat(data[0]); // always select the first chat
    } catch (err) {
      console.error("Error fetching chats:", err);
    }
  }, []);


  const createNewChat = async () => {
  try {
    const { data } = await axiosInstance.post("/chat", {}); // backend will auto name it Chat 1, Chat 2, etc.
    setChats((prev) => [data, ...prev]);
    await selectChat(data);
  } catch (err) {
    console.error("Error creating new chat:", err);
    alert("Failed to create a new chat.");
  }
};


  // Select a chat and fetch its messages
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

  // Send a message to Gemini API
  const sendMessage = async (content) => {
    if (!content.trim() || !currentChat) return;
    try {
      // Add user message immediately
      const userMessage = { content, sender: "user", _id: Date.now() };
      setMessages((prev) => [...prev, userMessage]);
      setIsTyping(true);

      // Send message to backend
      const { data } = await axiosInstance.post(
        `/message/${currentChat._id}`,
        { content }
      );

      setIsTyping(false);
      // Add bot response
      setMessages((prev) => [...prev, data.botMessage]);
    } catch (err) {
      setIsTyping(false);
      console.error("Send message error:", err);
      alert("Error sending message. Please try again.");
    }
  };

  // On component mount, check token and fetch chats
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return navigate("/login");
    setAuthToken(token);
    fetchChats();
  }, [fetchChats, navigate]);

  return (
    <div className="chatbot-container">
      <Sidebar
        chats={chats}
        selectChat={selectChat}
        currentChat={currentChat}
        createNewChat={createNewChat}
      />
      <div className="chat-section">
        <ChatArea messages={messages} isTyping={isTyping} />
        {currentChat && <InputArea onSend={sendMessage} />}
      </div>
    </div>
  );
};

export default Chatbot;
