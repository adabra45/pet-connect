const express = require('express');
const router = express.Router();
const { getMessages, getConversations } = require('../controllers/messageController');
const { protect } = require('../middleware/authMiddleware');

router.get('/conversations', protect, getConversations);
router.get('/:userId/:petId', protect, getMessages);

module.exports = router;