import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import API from '../services/api';

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
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Available Pets</h1>

      {/* Filters */}
      <form
        onSubmit={handleFilter}
        className="bg-gray-50 border rounded-xl p-4 mb-8 flex flex-wrap gap-3 items-center"
      >
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
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
          placeholder="Search by breed..."
          value={breed}
          onChange={(e) => setBreed(e.target.value)}
          className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <input
          type="text"
          placeholder="Search by location..."
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm transition"
        >
          Apply Filters
        </button>

        <button
          type="button"
          onClick={handleClear}
          className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-lg text-sm transition"
        >
          Clear
        </button>
      </form>

      {/* Results */}
      {loading ? (
        <p className="text-gray-500">Loading pets...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : pets.length === 0 ? (
        <p className="text-gray-500">No pets found matching your filters.</p>
      ) : (
        <>
          <p className="mb-4 text-gray-600">
            Showing <span className="font-semibold">{pets.length}</span> pet(s)
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {pets.map((pet) => (
              <div
                key={pet._id}
                className="bg-white border rounded-xl overflow-hidden shadow-sm hover:shadow-md transition"
              >
                <div className="p-5">
                  <h3 className="text-lg font-semibold mb-2">{pet.name}</h3>
                  <div className="text-sm text-gray-600 space-y-1">
                    <p><span className="font-medium">Breed:</span> {pet.breed}</p>
                    <p><span className="font-medium">Age:</span> {pet.age} years</p>
                    <p><span className="font-medium">Category:</span> {pet.category}</p>
                    <p><span className="font-medium">Location:</span> {pet.location}</p>
                    <p>
                      <span className="font-medium">Status:</span>{' '}
                      <span className={`${pet.status === 'Available' ? 'text-green-600' : 'text-orange-600'}`}>
                        {pet.status}
                      </span>
                    </p>
                  </div>

                  <Link to={`/pets/${pet._id}`}>
                    <button className="mt-4 w-full bg-gray-900 hover:bg-gray-800 text-white py-2 rounded-lg text-sm transition">
                      View Details
                    </button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default Home;