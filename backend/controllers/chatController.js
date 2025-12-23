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
  try {
    // Count chats per user
    const title = "New Chat";

    const chat = await Chat.create({
      title,
      user: req.user._id,
      messages: [],
    });

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
// Delete chat by ID
exports.deleteChat = async (req, res) => {
  try {
    const chat = await Chat.findById(req.params.id);
    if (!chat) {
      return res.status(404).json({ message: "Chat not found" });
    }

    if (chat.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: "Not authorized" });
    }

    // ✅ Delete all messages belonging to this chat
    await Message.deleteMany({ chat: chat._id });

    // ✅ Delete chat safely (use deleteOne instead of remove)
    await Chat.deleteOne({ _id: chat._id });

    res.json({ message: "Chat deleted successfully" });
  } catch (error) {
    console.error("Error deleting chat:", error);
    res.status(500).json({ message: "Failed to delete chat" });
  }
};
