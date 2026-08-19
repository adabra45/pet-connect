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
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex justify-between items-center h-16">
          
          {/* Left side */}
          <div className="flex items-center gap-8">
            <Link to="/" className="flex items-center gap-2">
              <span className="text-2xl">🐾</span>
              <span className="text-xl font-bold text-gray-900 tracking-tight">
                Pet Connect
              </span>
            </Link>

            <div className="hidden sm:flex items-center gap-6">
              <Link 
                to="/" 
                className="text-sm font-medium text-gray-600 hover:text-gray-900 transition">
                Browse Pets
              </Link>
              {token && (
                <Link 
                  to="/add-pet" 
                  className="text-sm font-medium text-gray-600 hover:text-gray-900 transition">
                  List a Pet
                </Link>
              )}
              {token && (
                <Link
                  to="/inbox"
                  className="text-sm font-medium text-gray-600 hover:text-gray-900 transition">
                  Inbox
                </Link>
              )}
            </div>
          </div>

          {/* Right side */}
          <div className="flex items-center gap-3">
            {token ? (
              <>
                <Link
                  to="/profile"
                  className="hidden sm:flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 transition"
                >
                  <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-semibold text-xs">
                    {user?.name?.charAt(0).toUpperCase()}
                  </div>
                  <span className="font-medium">{user?.name}</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="text-sm font-medium text-gray-600 hover:text-red-600 transition px-3 py-1.5 rounded-lg hover:bg-red-50"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-sm font-medium text-gray-600 hover:text-gray-900 transition px-3 py-1.5"
                >
                  Log in
                </Link>
                <Link
                  to="/register"
                  className="text-sm font-medium bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition shadow-sm"
                >
                  Sign up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;