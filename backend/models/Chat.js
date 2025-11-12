const mongoose = require('mongoose');

const chatSchema = new mongoose.Schema({
  title: { type: String },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  messages: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Message' }],
}, { timestamps: true });

module.exports = mongoose.model('Chat', chatSchema);
