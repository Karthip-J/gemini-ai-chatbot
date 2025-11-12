const express = require('express');
const router = express.Router();
const { getMessages, sendMessage, clearMessages } = require('../controllers/messageController');
const { protect } = require('../middleware/authMiddleware');

router.get('/:chatId', protect, getMessages);
router.post('/:chatId', protect, sendMessage);
router.delete('/:chatId/clear', protect, clearMessages);

module.exports = router;
