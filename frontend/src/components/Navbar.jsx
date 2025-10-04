import React, { useEffect, useState, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  MenuIcon,
  XIcon,
  SearchIcon,
  UserIcon,
  ShoppingCartIcon,
  LogOutIcon,
} from 'lucide-react';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dropdownRef = useRef(null);
  const searchRef = useRef(null);

  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem('user');
    return storedUser ? JSON.parse(storedUser) : null;
  });

  // Update user when route changes
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const parsedUser = storedUser ? JSON.parse(storedUser) : null;
    setUser(parsedUser);
  }, [location]);

  // Scroll and outside click handling
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);

    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsDropdownOpen(false);
      }
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setIsSearchOpen(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  const handleSearch = (e) => {
    e.preventDefault();
    console.log('Searching for:', searchQuery);
    // Implement actual search logic
  };

  const displayName = user?.name || 'User';

  return (
    <nav className={`bg-black fixed top-0 left-0 right-0 z-50 shadow-lg py-3`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link
            to="/"
            className="font-extrabold text-2xl text-red-500 hover:text-red-400 transition-colors tracking-wider"
          >
            SUPREME<span className="text-white">GYM</span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className={`text-sm uppercase font-semibold tracking-wide ${isActive('/') ? 'text-red-500 border-b-2 border-red-500' : 'text-gray-300 hover:text-white'}`}>
              Home
            </Link>
            <Link to="/user-dashboard" className={`text-sm uppercase font-semibold tracking-wide ${isActive('/feedbacks') ? 'text-red-500 border-b-2 border-red-500' : 'text-gray-300 hover:text-white'}`}>
              🏪Store
            </Link>
            <Link to="/user-appointments" className={`text-sm uppercase font-semibold tracking-wide ${isActive('/equipments') ? 'text-red-500 border-b-2 border-red-500' : 'text-gray-300 hover:text-white'}`}>
              📅 Appointments
            </Link>
            <Link to="/plans" className={`text-sm uppercase font-semibold tracking-wide ${isActive('/plans') ? 'text-red-500 border-b-2 border-red-500' : 'text-gray-300 hover:text-white'}`}>
              Training Plans
            </Link>
          </div>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-4">
            {/* Search */}
            <div className="relative" ref={searchRef}>
              {isSearchOpen ? (
                <form onSubmit={handleSearch} className="absolute right-0 top-0 mt-1 flex items-center">
                  <input
                    type="text"
                    placeholder="Search..."
                    className="bg-gray-800 text-white text-sm rounded-full px-4 py-2 pr-10 w-80 focus:outline-none focus:ring-2 focus:ring-red-500"
                    autoFocus
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  <button type="submit" className="absolute right-12 top-2 text-gray-400 hover:text-white">
                    <SearchIcon className="h-4 w-4" />
                  </button>
                  <button type="button" className="absolute right-3 top-2 text-gray-400 hover:text-white" onClick={() => setIsSearchOpen(false)}>
                    <XIcon className="h-4 w-4" />
                  </button>
                </form>
              ) : (
                <button onClick={() => setIsSearchOpen(true)} className="text-gray-300 hover:text-white p-1 rounded-full hover:bg-gray-800">
                  <SearchIcon className="h-5 w-5" />
                </button>
              )}
            </div>

            {/* Profile Dropdown */}
            {user ? (
              <div className="relative" ref={dropdownRef}>
                <button onClick={() => setIsDropdownOpen(!isDropdownOpen)} className="flex items-center gap-2 text-white hover:text-red-500 transition">
                  <div className="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center text-sm font-bold shadow-md">
                    {displayName.charAt(0).toUpperCase()}
                  </div>
                  <span className="hidden sm:inline text-sm font-semibold">{displayName}</span>
                </button>

                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-60 bg-gray-900 border border-red-600 rounded-lg shadow-xl overflow-hidden z-50">
                    <div className="px-4 py-3 border-b border-red-800">
                      <p className="text-white font-semibold text-sm">{displayName}</p>
                      <p className="text-gray-400 text-xs truncate">{user?.email}</p>
                    </div>
                    {/* <Link to="/user-dashboard" className="block px-4 py-2 text-sm text-white hover:bg-gray-800" onClick={() => setIsDropdownOpen(false)}>
                      🏪 Store
                    </Link> */}
                    <Link to="/user-purchase-summary" className="block px-4 py-2 text-sm text-white hover:bg-gray-800" onClick={() => setIsDropdownOpen(false)}>
                      📋 Purchase History
                    </Link>
                    {/* <Link to="/user-appointments" className="block px-4 py-2 text-sm text-white hover:bg-gray-800" onClick={() => setIsDropdownOpen(false)}>
                      📅 Appointments
                    </Link> */}
                    <Link to="/user-my-appointments" className="block px-4 py-2 text-sm text-white hover:bg-gray-800" onClick={() => setIsDropdownOpen(false)}>
                      📝 My Appointments
                    </Link>
                    <button onClick={handleLogout} className="flex items-center w-full px-4 py-2 text-sm text-white bg-red-600 hover:bg-red-700">
                      <LogOutIcon className="h-4 w-4 mr-2" /> Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link to="/login" className="text-gray-300 hover:text-white">Login</Link>
                <Link to="/register" className="text-gray-300 hover:text-white">Register</Link>
              </>
            )}

          </div>

          {/* Mobile menu & search */}
          <div className="md:hidden flex items-center space-x-4">
            <button onClick={() => setIsSearchOpen(!isSearchOpen)} className="text-gray-300 hover:text-white">
              <SearchIcon className="h-5 w-5" />
            </button>
            <Link to="/cart" className="relative text-gray-300 hover:text-white">
              <ShoppingCartIcon className="h-5 w-5" />
              <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">2</span>
            </Link>
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-gray-300 hover:text-white">
              {isMenuOpen ? <XIcon className="h-6 w-6" /> : <MenuIcon className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Search */}
      {isSearchOpen && (
        <div className="md:hidden px-4 py-3 bg-black">
          <form onSubmit={handleSearch} className="relative">
            <input
              type="text"
              placeholder="Search..."
              className="bg-gray-800 text-white text-sm rounded-lg w-full px-4 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-red-500"
              autoFocus
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button type="submit" className="absolute right-3 top-2 text-gray-400">
              <SearchIcon className="h-5 w-5" />
            </button>
          </form>
        </div>
      )}

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-black bg-opacity-95 absolute w-full">
          <div className="px-2 pt-2 pb-3 space-y-1">
            <Link to="/" onClick={() => setIsMenuOpen(false)} className={`block px-3 py-2 rounded-md text-base font-medium uppercase ${isActive('/') ? 'text-red-500' : 'text-white hover:bg-gray-900'}`}>
              Home
            </Link>
            <Link to="/feedbacks" onClick={() => setIsMenuOpen(false)} className={`block px-3 py-2 rounded-md text-base font-medium uppercase ${isActive('/feedbacks') ? 'text-red-500' : 'text-white hover:bg-gray-900'}`}>
              Testimonials
            </Link>
            <Link to="/equipments" onClick={() => setIsMenuOpen(false)} className={`block px-3 py-2 rounded-md text-base font-medium uppercase ${isActive('/equipments') ? 'text-red-500' : 'text-white hover:bg-gray-900'}`}>
              Equipment
            </Link>
            <Link to="/plans" onClick={() => setIsMenuOpen(false)} className={`block px-3 py-2 rounded-md text-base font-medium uppercase ${isActive('/plans') ? 'text-red-500' : 'text-white hover:bg-gray-900'}`}>
              Training Plans
            </Link>
            {user ? (
              <Link to="/profile" onClick={() => setIsMenuOpen(false)} className="flex items-center px-3 py-2 rounded-md text-base font-medium text-white hover:bg-gray-900">
                <UserIcon className="h-5 w-5 mr-2" /> Profile
              </Link>
            ) : (
              <>
                <Link to="/login" onClick={() => setIsMenuOpen(false)} className="block px-3 py-2 text-base text-white hover:bg-gray-900">Login</Link>
                <Link to="/register" onClick={() => setIsMenuOpen(false)} className="block px-3 py-2 text-base text-white hover:bg-gray-900">Register</Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;

