import { Link, useNavigate } from 'react-router-dom';

function Navbar() {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user') || 'null');

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <nav className="bg-gray-900 text-white px-6 py-4 flex justify-between items-center shadow-md">
      <div className="flex items-center gap-6">
        <Link to="/" className="text-xl font-bold tracking-wide">
          Pet Connect
        </Link>
        <Link to="/" className="hover:text-gray-300 transition">
          Home
        </Link>
        {token && (
          <Link to="/add-pet" className="hover:text-gray-300 transition">
            Add Pet
          </Link>
        )}
      </div>

      <div className="flex items-center gap-4">
        {token ? (
          <>
            <span className="text-sm">Hello, {user?.name}</span>
            <button
              onClick={handleLogout}
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-1.5 rounded-md text-sm transition"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="hover:text-gray-300 transition">
              Login
            </Link>
            <Link
              to="/register"
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-1.5 rounded-md text-sm transition"
            >
              Register
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;