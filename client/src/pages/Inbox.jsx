import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import API from '../services/api';

function Inbox() {
  const navigate = useNavigate();
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const token = localStorage.getItem('token');
  const currentUser = JSON.parse(localStorage.getItem('user') || 'null');

  useEffect(() => {
    if (!token || !currentUser) {
      navigate('/login');
      return;
    }

    const fetchConversations = async () => {
      try {
        const res = await API.get('/messages/conversations', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setConversations(res.data);
      } catch (err) {
        setError('Failed to load conversations');
      } finally {
        setLoading(false);
      }
    };

    fetchConversations();
  }, [token, currentUser, navigate]);

  if (loading) {
    return <div className="text-center py-20 text-gray-400">Loading inbox...</div>;
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Inbox</h1>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      {conversations.length === 0 ? (
        <div className="bg-white border border-gray-200 rounded-2xl p-10 text-center">
          <p className="text-gray-400">No conversations yet.</p>
          <p className="text-gray-400 text-sm mt-1">
            When someone messages you about a pet, it will appear here.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {conversations.map((conv, index) => (
            <Link
              key={index}
              to={`/chat/${conv.petId}/${conv.otherUserId}`}
              className="block bg-white border border-gray-200 rounded-2xl p-5 hover:shadow-md hover:border-gray-300 transition"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-11 h-11 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-semibold">
                    {conv.otherUser?.name?.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">
                      {conv.otherUser?.name}
                    </h3>
                    {conv.pet && (
                      <p className="text-sm text-gray-500">
                        About: {conv.pet.name} ({conv.pet.breed})
                      </p>
                    )}
                    <p className="text-sm text-gray-400 mt-1 truncate max-w-xs">
                      {conv.lastMessage}
                    </p>
                  </div>
                </div>
                <span className="text-xs text-gray-400">
                  {new Date(conv.lastMessageTime).toLocaleDateString()}
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export default Inbox;