const Message = require('../models/Message');
const Chat = require('../models/Chat');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

exports.getMessages = async (req, res) => {
  try {
    const messages = await Message.find({ chat: req.params.chatId });
    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.sendMessage = async (req, res) => {
  try {
    const { chatId } = req.params;
    const { content } = req.body;

    const userMessage = await Message.create({
      content,
      sender: 'user',
      chat: chatId,
    });

    const chat = await Chat.findById(chatId).populate('messages');
    if (!chat) return res.status(404).json({ message: 'Chat not found' });

    const context = chat.messages
      .slice(-10)
      .map((msg) => `${msg.sender === 'user' ? 'User' : 'AI'}: ${msg.content}`)
      .join('\n');

    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
    const prompt = `${context}\nUser: ${content}\nAI:`;

    const result = await model.generateContent(prompt);
    const botResponse = result.response.text();

    const botMessage = await Message.create({
      content: botResponse,
      sender: 'bot',
      chat: chatId,
    });

    chat.messages.push(userMessage._id, botMessage._id);
    await chat.save();

    res.status(200).json({ userMessage, botMessage });
  } catch (error) {
    console.error('Gemini API error:', error);
    res.status(500).json({
      message: 'Gemini API error occurred. Please try again.',
      error: error.message,
    });
  }
};

exports.clearMessages = async (req, res) => {
  try {
    await Message.deleteMany({ chat: req.params.chatId });
    res.status(200).json({ message: 'Chat cleared successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
