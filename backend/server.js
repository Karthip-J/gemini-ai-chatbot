require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

const authRoutes = require('./routes/authRoutes');
const chatRoutes = require('./routes/chatRoutes');
const messageRoutes = require('./routes/messageRoutes');
const { errorHandler } = require('./middleware/errorMiddleware');

const app = express();
app.use(express.json());

app.use(cors({
  origin: "*",
  methods: ['GET','POST','PUT','DELETE','OPTIONS'],
  credentials: true
}));

// MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error(err));

// API routes
console.log('Loading auth routes...');
app.use('/api/auth', authRoutes);
console.log('Loading chat routes...');
app.use('/api/chat', chatRoutes);
console.log('Loading message routes...');
app.use('/api/message', messageRoutes);
console.log('All routes loaded');

// Serve frontend build (SPA)
app.use(express.static(path.join(__dirname, '../frontend/build')));


// Error middleware
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
