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

    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    const prompt = `${context}\nUser: ${content}\nAI:`;

    const result = await model.generateContent(prompt);
    const botResponse = result.response.text();

    const botMessage = await Message.create({
      content: botResponse,
      sender: 'bot',
      chat: chatId,
    });

    // Generate title if it's the first message or current title is generic
    const isGenericTitle = !chat.title || chat.title === 'New Chat' || chat.title.startsWith('Chat ');

    if (chat.messages.length === 0 || isGenericTitle) {
      try {
        console.log(`📝 Generating title for chat ${chatId}. Current messages: ${chat.messages.length}`);
        const titlePrompt = `Generate a very concise, professional chat title (max 5 words) that captures the core topic of this message: "${content}". Return ONLY the title text, no quotes or punctuation.`;
        const titleResult = await model.generateContent(titlePrompt);
        const generatedTitle = titleResult.response.text().trim().replace(/^"(.*)"$/, '$1');

        if (generatedTitle && generatedTitle.length > 0) {
          console.log(`✅ Generated title: "${generatedTitle}"`);
          chat.title = generatedTitle;
        }
      } catch (titleError) {
        console.error('❌ Title generation error:', titleError);
      }
    }

    chat.messages.push(userMessage._id, botMessage._id);
    await chat.save();

    res.status(200).json({ userMessage, botMessage, chatTitle: chat.title });
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
