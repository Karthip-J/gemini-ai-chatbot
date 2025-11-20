# 🤖 Gemini AI Chatbot

A full-stack AI chatbot powered by Google's Gemini API, built using the **MERN stack** (MongoDB, Express, React, Node.js).  
Users can chat with an AI assistant, view previous conversations, and manage chat history — with secure JWT-based authentication.

---

## 🚀 Features

- 🔐 **User Authentication** (Register, Login, Forgot/Reset Password)
- 💬 **Chat with Gemini AI**
- 🧠 **Persistent Chat History** stored in MongoDB
- 🧩 **JWT Authentication** for protected routes
- 🪄 **Modern UI** built with React + CSS
- ⚙️ **Node.js + Express Backend** with RESTful APIs
- ☁️ **MongoDB Atlas Integration**

---

## 🏗️ Project Structure


---

## ⚙️ Installation

### 1. Clone the repository
```bash
git clone https://github.com/Karthip-J/gemini-ai-chatbot.git
cd gemini-ai-chatbot


Setup the backend
cd backend
npm install

Create a .env file inside /backend based on .env.example:

PORT=5000
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
GEMINI_API_KEY=your_gemini_api_key
CLIENT_URL=http://localhost:3000


Start the backend:

npm start


Setup the frontend
cd ../frontend
npm install
npm start


The app should now be running on http://localhost:3000
