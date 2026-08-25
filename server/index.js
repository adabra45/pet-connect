const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const http = require('http');
const { Server } = require('socket.io');
require('dotenv').config();

const authRoutes = require('./routes/authRoutes');
const petRoutes = require('./routes/petRoutes');
const messageRoutes = require('./routes/messageRoutes');

const app = express();
const server = http.createServer(app);

// Socket.io setup
const io = new Server(server, {
  cors: {
    origin: ['http://localhost:5173', 'https://pet-connect-rosy.vercel.app'], // React frontend URL
    methods: ['GET', 'POST'],
    credentials: true
  },
});

const PORT = 5000;

// Middlewares
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/pets', petRoutes);
app.use('/api/messages', messageRoutes);

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected successfully'))
  .catch((err) => console.log('MongoDB connection error:', err.message));

app.get('/', (req, res) => {
  res.send('Pet Connect Backend is running!');
});

// ========== SOCKET.IO LOGIC ==========
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  // Join a private room (based on user ID)
  socket.on('join', (userId) => {
    socket.join(userId);
    console.log(`User ${userId} joined their room`);
  });

  // Handle sending message
  socket.on('sendMessage', async (data) => {
    try {
      const Message = require('./models/Message');

      // Save message to database
      const newMessage = await Message.create({
        sender: data.senderId,
        receiver: data.receiverId,
        pet: data.petId || null,
        content: data.content,
      });

      const populatedMessage = await Message.findById(newMessage._id)
        .populate('sender', 'name')
        .populate('receiver', 'name');

      // Send to receiver in real-time
      io.to(data.receiverId).emit('receiveMessage', populatedMessage);

      // Also send back to sender (for confirmation)
      io.to(data.senderId).emit('receiveMessage', populatedMessage);
    } catch (error) {
      console.log('Error saving message:', error.message);
    }
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

// Start server
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});