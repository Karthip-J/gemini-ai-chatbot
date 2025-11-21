require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const chatRoutes = require('./routes/chatRoutes');
const messageRoutes = require('./routes/messageRoutes');
const { errorHandler } = require('./middleware/errorMiddleware');

const app = express();
app.use(express.json());

// ✅ CORS configuration
app.use(cors({
  origin: [
    'http://localhost:3000',
    'https://gemini-ai-chatbot-2-4hdt.onrender.com'
  ],
  credentials: true,
}));



// 🔥 Root route to check backend
app.get("/", (req, res) => {
  res.send("Backend is Live!");
});

// ✅ MongoDB connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error(err));

// ✅ Routes
app.use('/api/auth', authRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/message', messageRoutes);

// ✅ Error middleware
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
