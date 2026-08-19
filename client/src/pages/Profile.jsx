import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import API from '../services/api';

function Profile() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [myPets, setMyPets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');

    if (!token || !storedUser) {
      navigate('/login');
      return;
    }

    setUser(JSON.parse(storedUser));

    const fetchMyPets = async () => {
      try {
        // Get all pets and filter by current user
        const res = await API.get('/pets');
        const currentUser = JSON.parse(storedUser);

        const filtered = res.data.pets.filter(
          (pet) => pet.listedBy && pet.listedBy._id === currentUser.id
        );

        setMyPets(filtered);
      } catch (err) {
        setError('Failed to load your pets');
      } finally {
        setLoading(false);
      }
    };

    fetchMyPets();
  }, [navigate]);

  if (loading) {
    return <div className="text-center py-20 text-gray-400">Loading profile...</div>;
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      {/* Profile Header */}
      <div className="bg-white border border-gray-200 rounded-2xl p-6 md:p-8 mb-8 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center gap-5">
          <div className="w-16 h-16 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center text-2xl font-bold">
            {user?.name?.charAt(0).toUpperCase()}
          </div>

          <div className="flex-1">
            <h1 className="text-2xl font-bold text-gray-900">{user?.name}</h1>
            <p className="text-gray-500 text-sm mt-1">{user?.email}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6 pt-6 border-t border-gray-100">
          <div>
            <p className="text-xs text-gray-400 mb-1">Phone</p>
            <p className="font-medium text-gray-800">{user?.phone || 'Not provided'}</p>
          </div>
          <div>
            <p className="text-xs text-gray-400 mb-1">Location</p>
            <p className="font-medium text-gray-800">{user?.location || 'Not provided'}</p>
          </div>
          <div className="mt-4">
            <Link
                to="/edit-profile"
                className="inline-block text-sm font-medium bg-indigo-50 hover:bg-indigo-100 text-indigo-700 px-4 py-2 rounded-xl transition">
                Edit Profile
            </Link>
            </div>
        </div>
      </div>

      {/* My Listings */}
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-xl font-bold text-gray-900">My Listings</h2>
        <Link
          to="/add-pet"
          className="text-sm font-medium bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl transition"
        >
          + List a Pet
        </Link>
      </div>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      {myPets.length === 0 ? (
        <div className="bg-white border border-gray-200 rounded-2xl p-10 text-center">
          <p className="text-gray-400 mb-4">You haven’t listed any pets yet.</p>
          <Link
            to="/add-pet"
            className="inline-block bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl text-sm font-medium transition"
          >
            List your first pet
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {myPets.map((pet) => (
            <div
              key={pet._id}
              className="bg-white border border-gray-200 rounded-2xl overflow-hidden hover:shadow-md transition"
            >
              <div className="h-40 bg-gray-100 overflow-hidden">
                {pet.images && pet.images.length > 0 ? (
                  <img
                    src={pet.images[0]}
                    alt={pet.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-indigo-50 to-purple-50">
                    <span className="text-4xl opacity-60">🐾</span>
                  </div>
                )}
              </div>

              <div className="p-4">
                <div className="flex justify-between items-start mb-1">
                  <h3 className="font-semibold text-gray-900">{pet.name}</h3>
                  <span
                    className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                      pet.status === 'Available'
                        ? 'bg-green-50 text-green-700'
                        : 'bg-orange-50 text-orange-700'
                    }`}
                  >
                    {pet.status}
                  </span>
                </div>

                <p className="text-sm text-gray-500 mb-3">
                  {pet.breed} • {pet.age} yrs
                </p>

                <div className="flex gap-2">
                  <Link
                    to={`/pets/${pet._id}`}
                    className="flex-1 text-center text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 rounded-lg transition"
                  >
                    View
                  </Link>
                  <Link
                    to={`/pets/${pet._id}/edit`}
                    className="flex-1 text-center text-sm bg-indigo-50 hover:bg-indigo-100 text-indigo-700 py-2 rounded-lg transition"
                  >
                    Edit
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Profile;