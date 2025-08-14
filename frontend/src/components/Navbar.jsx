import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';

const Navbar = ({ onSearch }) => {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [userName, setUserName] = useState('');
  const [search, setSearch] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (token) {
      try {
        const decoded = JSON.parse(atob(token.split('.')[1]));
        setUserName(decoded.user?.name || '');
      } catch {
        setUserName('');
      }
    }
  }, [token]);

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUserName('');
    navigate('/');
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (location.pathname !== '/') navigate('/');
    onSearch(search);
  };

  return (
    <nav className="bg-blue-500 p-4 text-white flex justify-between">
      <div className="flex gap-4 items-center">
        <Link to="/" className="font-bold">Book Review Board</Link>
        <form onSubmit={handleSearch}>
          <input
            type="text"
            placeholder="Search books..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="px-2 py-1 rounded text-black"
          />
        </form>
      </div>
      <div>
        {token ? (
  <>
    <span className="mr-4">Welcome, {userName}</span>
    <Link to="/add-book" className="mr-4">Add Book</Link>
    <Link to="/my-books" className="mr-4">My Books</Link>
    <button onClick={logout}>Logout</button>
  </>
) : (
  <>
    <Link to="/login" className="mr-4">Sign In</Link>
    <Link to="/register">Sign Up</Link>
  </>
)}

      </div>
    </nav>
  );
};

export default Navbar;
