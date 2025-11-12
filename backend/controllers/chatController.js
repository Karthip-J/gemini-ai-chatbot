const Chat = require('../models/Chat');
const Message = require('../models/Message');

// Get all chats for logged-in user
exports.getChats = async (req, res) => {
  const chats = await Chat.find({ user: req.user._id }).populate('messages');
  res.json(chats);
};

// Create a new chat
// exports.createChat = async (req, res) => {
//   const { title } = req.body;
//   const chat = await Chat.create({ title, user: req.user._id, messages: [] });
//   res.status(201).json(chat);
// };


exports.createChat = async (req, res) => {
  console.log("🔍 [DEBUG] Create chat called");
  console.log("User:", req.user);
  console.log("Body:", req.body);

  try {
    // Count how many chats this user already has
    const chatCount = await Chat.countDocuments({ user: req.user._id });

    // Auto-generate title like "Chat 1", "Chat 2", etc.
    const defaultTitle = `Chat ${chatCount + 1}`;

    // Use the provided title if sent, otherwise use auto one
    const { title = defaultTitle } = req.body || {};

    const chat = await Chat.create({
      title,
      user: req.user._id,
      messages: [],
    });

    console.log(`✅ Created: ${chat.title}`);
    res.status(201).json(chat);
  } catch (error) {
    console.error("❌ Chat creation failed:", error);
    res.status(500).json({ message: "Server error" });
  }
};



// Get chat by ID
exports.getChatById = async (req, res) => {
  const chat = await Chat.findById(req.params.id).populate('messages');
  if (!chat) return res.status(404).json({ message: 'Chat not found' });
  res.json(chat);
};

// Delete chat by ID
exports.deleteChat = async (req, res) => {
  const chat = await Chat.findById(req.params.id);
  if (!chat) return res.status(404).json({ message: 'Chat not found' });
  if (chat.user.toString() !== req.user._id.toString()) return res.status(401).json({ message: 'Not authorized' });

  await chat.remove();
  res.json({ message: 'Chat deleted successfully' });
};
