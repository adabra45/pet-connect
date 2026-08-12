import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import API from '../services/api';

function PetDetails() {
  const { id } = useParams();
  const [pet, setPet] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

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

  if (loading) return <div className="p-8 text-center text-gray-500">Loading pet details...</div>;
  if (error) return <div className="p-8 text-center text-red-500">{error}</div>;
  if (!pet) return null;

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <Link
        to="/"
        className="inline-block mb-6 text-blue-600 hover:underline text-sm"
      >
        ← Back to Home
      </Link>

      <div className="bg-white border rounded-xl shadow-sm p-6 md:p-8">
        <h1 className="text-3xl font-bold mb-4">{pet.name}</h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-gray-700 mb-6">
          <p><span className="font-medium">Breed:</span> {pet.breed}</p>
          <p><span className="font-medium">Age:</span> {pet.age} years</p>
          <p><span className="font-medium">Gender:</span> {pet.gender}</p>
          <p><span className="font-medium">Category:</span> {pet.category}</p>
          <p><span className="font-medium">Location:</span> {pet.location}</p>
          <p>
            <span className="font-medium">Status:</span>{' '}
            <span className={pet.status === 'Available' ? 'text-green-600 font-medium' : 'text-orange-600 font-medium'}>
              {pet.status}
            </span>
          </p>
        </div>

        <div className="mb-8">
          <h2 className="text-lg font-semibold mb-2">Description</h2>
          <p className="text-gray-600 leading-relaxed">{pet.description}</p>
        </div>

        {pet.listedBy && (
          <div className="bg-gray-50 border rounded-lg p-5">
            <h2 className="text-lg font-semibold mb-3">Listed By</h2>
            <div className="space-y-1 text-gray-700">
              <p><span className="font-medium">Name:</span> {pet.listedBy.name}</p>
              <p><span className="font-medium">Email:</span> {pet.listedBy.email}</p>
              {pet.listedBy.phone && (
                <p><span className="font-medium">Phone:</span> {pet.listedBy.phone}</p>
              )}
              {pet.listedBy.location && (
                <p><span className="font-medium">Location:</span> {pet.listedBy.location}</p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default PetDetails;