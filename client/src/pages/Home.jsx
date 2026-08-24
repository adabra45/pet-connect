import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import API from '../services/api';
import Skeleton from '../components/Skeleton';

function Home() {
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [category, setCategory] = useState('');
  const [breed, setBreed] = useState('');
  const [location, setLocation] = useState('');

  const fetchPets = async () => {
    try {
      setLoading(true);
      const params = {};
      if (category) params.category = category;
      if (breed) params.breed = breed;
      if (location) params.location = location;

      const res = await API.get('/pets', { params });
      setPets(res.data.pets);
      setError('');
    } catch (err) {
      setError('Failed to load pets');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPets();
  }, []);

  const handleFilter = (e) => {
    e.preventDefault();
    fetchPets();
  };

  const handleClear = () => {
    setCategory('');
    setBreed('');
    setLocation('');
    setTimeout(() => fetchPets(), 0);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
      
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Find your new companion</h1>
        <p className="text-gray-500">Browse pets available for adoption near you</p>
      </div>

      {/* Filters */}
      <form
        onSubmit={handleFilter}
        className="bg-white border border-gray-200 rounded-2xl p-5 mb-10 shadow-sm"
      >
        <div className="flex flex-col sm:flex-row gap-3">
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="flex-1 border border-gray-200 rounded-xl px-4 py-2.5 text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          >
            <option value="">All Categories</option>
            <option value="Dog">Dog</option>
            <option value="Cat">Cat</option>
            <option value="Bird">Bird</option>
            <option value="Rabbit">Rabbit</option>
            <option value="Other">Other</option>
          </select>

          <input
            type="text"
            placeholder="Breed (e.g. Labrador)"
            value={breed}
            onChange={(e) => setBreed(e.target.value)}
            className="flex-1 border border-gray-200 rounded-xl px-4 py-2.5 text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />

          <input
            type="text"
            placeholder="Location (e.g. Bengaluru)"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="flex-1 border border-gray-200 rounded-xl px-4 py-2.5 text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />

          <div className="flex gap-2">
            <button
              type="submit"
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl text-sm font-medium transition"
            >
              Search
            </button>
            <button
              type="button"
              onClick={handleClear}
              className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-5 py-2.5 rounded-xl text-sm font-medium transition"
            >
              Clear
            </button>
          </div>
        </div>
      </form>

      {/* Results */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((item) => (
            <div key={item} className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
              <Skeleton className="h-48 w-full rounded-none" />
              <div className="p-5 space-y-3">
                <Skeleton className="h-5 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-4 w-2/3" />
                <Skeleton className="h-9 w-full mt-2" />
              </div>
            </div>
          ))}
        </div>
      ) : error ? (
        <div className="text-center py-20 text-red-500">{error}</div>
      ) : pets.length === 0 ? (
        <div className="text-center py-20 bg-white border border-gray-200 rounded-2xl">
          <div className="text-5xl mb-4">🐾</div>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">No pets found</h3>
          <p className="text-gray-500 text-sm mb-6">
            Try adjusting your filters or check back later.
          </p>
          <button
            onClick={handleClear}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl text-sm font-medium transition">
            Clear Filters
          </button>
        </div>
      ) : (
        <>
          <p className="text-sm text-gray-500 mb-6">
            {pets.length} pet{pets.length !== 1 ? 's' : ''} available
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {pets.map((pet) => (
              <Link
                key={pet._id}
                to={`/pets/${pet._id}`}
                className="group bg-white border border-gray-200 rounded-2xl overflow-hidden hover:shadow-lg hover:border-gray-300 transition-all duration-200"
              >
                {/* Pet Image */}
<div className="h-48 bg-gray-100 overflow-hidden">
  {pet.images && pet.images.length > 0 ? (
    <img
      src={pet.images[0]}
      alt={pet.name}
      className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
    />
  ) : (
    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-indigo-50 to-purple-50">
      <span className="text-5xl opacity-60">
        {pet.category === 'Dog' ? '🐕' : 
         pet.category === 'Cat' ? '🐈' : 
         pet.category === 'Bird' ? '🐦' : 
         pet.category === 'Rabbit' ? '🐇' : '🐾'}
      </span>
    </div>
  )}
</div>

                <div className="p-5">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-semibold text-gray-900 group-hover:text-indigo-600 transition">
                      {pet.name}
                    </h3>
                    <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${
                      pet.status === 'Available' 
                        ? 'bg-green-50 text-green-700' 
                        : 'bg-orange-50 text-orange-700'
                    }`}>
                      {pet.status}
                    </span>
                  </div>

                  <p className="text-sm text-gray-500 mb-3">{pet.breed} • {pet.age} years</p>

                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-400">{pet.location}</span>
                    <span className="text-indigo-600 font-medium group-hover:underline">
                      View →
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default Home;