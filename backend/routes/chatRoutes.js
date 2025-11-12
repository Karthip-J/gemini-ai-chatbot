// const express = require('express');
// const router = express.Router();
// const { protect } = require('../middleware/authMiddleware');
// const { getChats, createChat, getChatById, deleteChat } = require('../controllers/chatController');

// router.route('/').get(protect, getChats).post(protect, createChat);
// router.route('/:id').get(protect, getChatById).delete(protect, deleteChat);

// module.exports = router;

const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { getChats, createChat, getChatById, deleteChat } = require('../controllers/chatController');

router.route('/')
  .get(protect, getChats)
  .post(protect, createChat);

router.route('/:id')
  .get(protect, getChatById)
  .delete(protect, deleteChat);

module.exports = router;
