import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import API from '../services/api';

function PetDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [pet, setPet] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleting, setDeleting] = useState(false);

  const currentUser = JSON.parse(localStorage.getItem('user') || 'null');
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchPet = async () => {
      try {
        const res = await API.get(`/pets/${id}`);
        setPet(res.data);
      } catch (err) {
        setError('Pet not found');
      } finally {
        setLoading(false);
      }
    };

    fetchPet();
  }, [id]);

  const handleDelete = async () => {
    const confirmDelete = window.confirm('Are you sure you want to delete this pet listing?');
    if (!confirmDelete) return;

    try {
      setDeleting(true);
      await API.delete(`/pets/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      alert('Pet deleted successfully');
      navigate('/');
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete pet');
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return <div className="text-center py-20 text-gray-400">Loading pet details...</div>;
  }

  if (error) {
    return <div className="text-center py-20 text-red-500">{error}</div>;
  }

  if (!pet) return null;

  const isOwner = currentUser && pet.listedBy && currentUser.id === pet.listedBy._id;

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <Link
        to="/"
        className="inline-flex items-center text-sm text-gray-500 hover:text-indigo-600 mb-6 transition"
      >
        ← Back to all pets
      </Link>

      <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
        
        {/* Image */}
        <div className="h-72 md:h-96 bg-gray-100">
          {pet.images && pet.images.length > 0 ? (
            <img
              src={pet.images[0]}
              alt={pet.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-indigo-50 to-purple-50">
              <span className="text-7xl opacity-50">
                {pet.category === 'Dog' ? '🐕' : 
                 pet.category === 'Cat' ? '🐈' : 
                 pet.category === 'Bird' ? '🐦' : 
                 pet.category === 'Rabbit' ? '🐇' : '🐾'}
              </span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-6 md:p-8">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-1">{pet.name}</h1>
              <p className="text-gray-500">{pet.breed} • {pet.age} years old</p>
            </div>

            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
              pet.status === 'Available' 
                ? 'bg-green-50 text-green-700' 
                : 'bg-orange-50 text-orange-700'
            }`}>
              {pet.status}
            </span>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-gray-50 rounded-xl p-4">
              <p className="text-xs text-gray-400 mb-1">Gender</p>
              <p className="font-medium">{pet.gender}</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-4">
              <p className="text-xs text-gray-400 mb-1">Category</p>
              <p className="font-medium">{pet.category}</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-4">
              <p className="text-xs text-gray-400 mb-1">Location</p>
              <p className="font-medium">{pet.location}</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-4">
              <p className="text-xs text-gray-400 mb-1">Age</p>
              <p className="font-medium">{pet.age} years</p>
            </div>
          </div>

          <div className="mb-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-2">About</h2>
            <p className="text-gray-600 leading-relaxed">{pet.description}</p>
          </div>

          {pet.listedBy && (
            <div className="bg-gray-50 rounded-xl p-5 mb-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-3">Listed by</h2>
              <div className="space-y-1 text-gray-700">
                <p><span className="font-medium">Name:</span> {pet.listedBy.name}</p>
                <p><span className="font-medium">Email:</span> {pet.listedBy.email}</p>
                {pet.listedBy.phone && (
                  <p><span className="font-medium">Phone:</span> {pet.listedBy.phone}</p>
                )}
              </div>
            </div>
          )}

          {/* Delete Button - Only for owner */}
          {/* Owner Actions */}
          {isOwner && (
            <div className="flex flex-col sm:flex-row gap-3 mt-2">
              <Link
                to={`/pets/${pet._id}/edit`}
                className="flex-1 text-center bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-medium px-6 py-2.5 rounded-xl transition"
              >
                Edit Details
              </Link>

              <button
                onClick={handleDelete}
                disabled={deleting}
                className="flex-1 bg-red-50 hover:bg-red-100 text-red-600 font-medium px-6 py-2.5 rounded-xl transition disabled:opacity-50"
              >
                {deleting ? 'Deleting...' : 'Delete Listing'}
              </button>
            </div>
          )}

          {/* Chat Button - Only for non-owners */}
          {currentUser && pet.listedBy && currentUser.id !== pet.listedBy._id && (
            <div className="mt-6">
              <Link
                to={`/chat/${pet._id}/${pet.listedBy._id}`}
                className="inline-block w-full sm:w-auto text-center bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-6 py-2.5 rounded-xl transition"
              >
                Chat with Owner
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default PetDetails;