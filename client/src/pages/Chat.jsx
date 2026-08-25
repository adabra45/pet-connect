import { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { io } from 'socket.io-client';
import API from '../services/api';

const socket = io('https://pet-connect-backend-89fo.onrender.com');

function Chat() {
  const { petId, receiverId } = useParams();
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [pet, setPet] = useState(null);
  const [receiverName, setReceiverName] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef(null);

  const currentUser = JSON.parse(localStorage.getItem('user') || 'null');
  const token = localStorage.getItem('token');

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (!token || !currentUser) {
      navigate('/login');
      return;
    }

    socket.emit('join', currentUser.id);

    const fetchData = async () => {
      try {
        const petRes = await API.get(`/pets/${petId}`);
        setPet(petRes.data);
        if (petRes.data.listedBy) {
          setReceiverName(petRes.data.listedBy.name);
        }

        const messagesRes = await API.get(`/messages/${receiverId}/${petId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setMessages(messagesRes.data);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    const handleReceive = (message) => {
      const senderId = message.sender._id || message.sender;
      const receiverIdFromMsg = message.receiver._id || message.receiver;

      if (
        (senderId === currentUser.id && receiverIdFromMsg === receiverId) ||
        (senderId === receiverId && receiverIdFromMsg === currentUser.id)
      ) {
        setMessages((prev) => {
          if (prev.some((m) => m._id === message._id)) return prev;
          return [...prev, message];
        });
      }
    };

    socket.on('receiveMessage', handleReceive);

    return () => {
      socket.off('receiveMessage', handleReceive);
    };
  }, [petId, receiverId, currentUser, token, navigate]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!newMessage.trim() || sending) return;

    setSending(true);

    const messageData = {
      senderId: currentUser.id,
      receiverId: receiverId,
      petId: petId,
      content: newMessage.trim(),
    };

    socket.emit('sendMessage', messageData);
    setNewMessage('');
    setSending(false);
  };

  if (loading) {
    return (
      <div className="text-center py-20 text-gray-400">
        Loading chat...
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-6 h-[calc(100vh-80px)] flex flex-col">
      {/* Header */}
      <div className="bg-white border border-gray-200 rounded-t-2xl px-5 py-4 flex items-center justify-between shadow-sm">
        <div>
          <h2 className="font-semibold text-gray-900">
            {receiverName || 'User'}
          </h2>
          {pet && (
            <p className="text-sm text-gray-500">
              About: {pet.name} ({pet.breed})
            </p>
          )}
        </div>
        <Link
          to={`/pets/${petId}`}
          className="text-sm text-indigo-600 hover:underline font-medium"
        >
          View Pet
        </Link>
      </div>

      {/* Messages */}
      <div className="flex-1 bg-gray-50 border-x border-gray-200 overflow-y-auto p-4 sm:p-5 space-y-3">
        {messages.length === 0 ? (
          <div className="text-center text-gray-400 mt-16">
            <div className="text-4xl mb-3">💬</div>
            <p>No messages yet</p>
            <p className="text-sm mt-1">Say hello to start the conversation</p>
          </div>
        ) : (
          messages.map((msg) => {
            const senderId = msg.sender._id || msg.sender;
            const isMe = senderId === currentUser.id;

            return (
              <div
                key={msg._id}
                className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] sm:max-w-[70%] px-4 py-2.5 rounded-2xl text-sm shadow-sm ${
                    isMe
                      ? 'bg-indigo-600 text-white rounded-br-md'
                      : 'bg-white border border-gray-200 text-gray-800 rounded-bl-md'
                  }`}
                >
                  <p className="leading-relaxed">{msg.content}</p>
                  <p
                    className={`text-[10px] mt-1 ${
                      isMe ? 'text-indigo-200' : 'text-gray-400'
                    }`}
                  >
                    {new Date(msg.createdAt).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form
        onSubmit={handleSend}
        className="bg-white border border-gray-200 rounded-b-2xl p-3 sm:p-4 flex gap-2 sm:gap-3"
      >
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        <button
          type="submit"
          disabled={!newMessage.trim() || sending}
          className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-300 text-white px-5 py-2.5 rounded-xl text-sm font-medium transition"
        >
          Send
        </button>
      </form>
    </div>
  );
}

export default Chat;