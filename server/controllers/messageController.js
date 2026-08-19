const Message = require('../models/Message');

// Get conversation between two users (optionally for a specific pet)
const getMessages = async (req, res) => {
  try {
    const { userId, petId } = req.params;
    const currentUserId = req.user.id;

    const filter = {
      $or: [
        { sender: currentUserId, receiver: userId },
        { sender: userId, receiver: currentUserId },
      ],
    };

    if (petId) {
      filter.pet = petId;
    }

    const messages = await Message.find(filter)
      .populate('sender', 'name')
      .populate('receiver', 'name')
      .sort({ createdAt: 1 });

    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
// Get all conversations for the logged-in user
const getConversations = async (req, res) => {
  try {
    const currentUserId = req.user.id;

    // Find all messages where the user is sender or receiver
    const messages = await Message.find({
      $or: [{ sender: currentUserId }, { receiver: currentUserId }],
    })
      .populate('sender', 'name')
      .populate('receiver', 'name')
      .populate('pet', 'name breed')
      .sort({ createdAt: -1 });

    // Group messages into conversations
    const conversationsMap = new Map();

    messages.forEach((msg) => {
      const otherUser =
        msg.sender._id.toString() === currentUserId
          ? msg.receiver
          : msg.sender;

      const key = `${otherUser._id}-${msg.pet?._id || 'general'}`;

      if (!conversationsMap.has(key)) {
        conversationsMap.set(key, {
          otherUser,
          pet: msg.pet,
          lastMessage: msg.content,
          lastMessageTime: msg.createdAt,
          petId: msg.pet?._id,
          otherUserId: otherUser._id,
        });
      }
    });

    const conversations = Array.from(conversationsMap.values());

    res.status(200).json(conversations);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = { getMessages, getConversations };