import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, UserCircle, LogOut } from 'lucide-react';
import Button from '../ui/Button';
import { useAuth } from '../../contexts/AuthContext';

const Navbar: React.FC = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const dropdownRef = useRef<HTMLDivElement>(null);

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  // Handle clicks outside of dropdown to close it
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const getDashboardLink = () => {
    if (!user) return '/login';
    switch (user.role) {
      case 'admin':
        return '/admin/dashboard';
      case 'owner':
        return '/owner/dashboard';
      default:
        return '/dashboard';
    }
  };

  const toggleMenu = () => {
    setShowMenu(!showMenu);
  };

  // Close dropdown when clicking a menu item
  const handleMenuItemClick = () => {
    setShowMenu(false);
  };

  return (
    <nav className="bg-background-dark text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo + Nav Links */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <img src="/images/flexiride.png" alt="FlexiRide Logo" className="h-10 w-10" />
              <span className="ml-2 text-xl font-bold text-white">FlexiRide</span>
            </Link>

            <div className="hidden md:ml-10 md:flex md:space-x-8">
              <Link to="/" className="text-gray-300 hover:text-primary px-3 py-2 text-sm font-medium">Home</Link>
              <Link to="/cars" className="text-gray-300 hover:text-primary px-3 py-2 text-sm font-medium">Browse Cars</Link>
              <Link to="/about" className="text-gray-300 hover:text-primary px-3 py-2 text-sm font-medium">About</Link>
              <Link to="/contact" className="text-gray-300 hover:text-primary px-3 py-2 text-sm font-medium">Contact</Link>
            </div>
          </div>

          {/* Desktop User Actions */}
          <div className="hidden md:flex items-center space-x-4">
            {isAuthenticated ? (
              <div className="relative inline-block text-left" ref={dropdownRef}>
                <button
                  type="button"
                  onClick={toggleMenu}
                  className="flex items-center text-sm text-gray-300 hover:text-primary focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background-dark rounded-md px-2 py-1"
                  aria-expanded={showMenu}
                  aria-haspopup="true"
                >
                  <UserCircle className="h-6 w-6 mr-1" />
                  <span>{user?.name}</span>
                </button>

                {showMenu && (
                  <div 
                    className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-background-light shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
                    role="menu"
                    aria-orientation="vertical"
                    aria-labelledby="user-menu-button"
                  >
                    <div className="py-1">
                      <Link
                        to={getDashboardLink()}
                        className="block px-4 py-2 text-sm text-gray-300 hover:bg-primary hover:text-white transition-colors"
                        onClick={handleMenuItemClick}
                        role="menuitem"
                      >
                        Dashboard
                      </Link>
                      <Link
                        to="/profile"
                        className="block px-4 py-2 text-sm text-gray-300 hover:bg-primary hover:text-white transition-colors"
                        onClick={handleMenuItemClick}
                        role="menuitem"
                      >
                        Profile
                      </Link>
                      <button
                        onClick={() => {
                          handleMenuItemClick();
                          handleLogout();
                        }}
                        className="w-full text-left block px-4 py-2 text-sm text-gray-300 hover:bg-primary hover:text-white transition-colors"
                        role="menuitem"
                      >
                        Sign out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate('/login')}
                >
                  Login
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => navigate('/register')}
                >
                  Sign Up
                </Button>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center md:hidden">
            <button
              type="button"
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary"
              aria-controls="mobile-menu"
              aria-expanded={isMobileMenuOpen}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <Menu className="h-6 w-6" />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden" id="mobile-menu">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link to="/" className="block px-3 py-2 text-base font-medium text-gray-300 hover:text-white hover:bg-gray-700 rounded-md">Home</Link>
            <Link to="/cars" className="block px-3 py-2 text-base font-medium text-gray-300 hover:text-white hover:bg-gray-700 rounded-md">Browse Cars</Link>
            <Link to="/about" className="block px-3 py-2 text-base font-medium text-gray-300 hover:text-white hover:bg-gray-700 rounded-md">About</Link>
            <Link to="/contact" className="block px-3 py-2 text-base font-medium text-gray-300 hover:text-white hover:bg-gray-700 rounded-md">Contact</Link>
          </div>
          <div className="pt-4 pb-3 border-t border-gray-700">
            {isAuthenticated ? (
              <div className="px-2 space-y-1">
                <div className="flex items-center px-5">
                  <UserCircle className="h-10 w-10 text-gray-400" />
                  <div className="ml-3">
                    <div className="text-base font-medium text-white">{user?.name}</div>
                    <div className="text-sm font-medium text-gray-400">{user?.email}</div>
                  </div>
                </div>
                <Link to={getDashboardLink()} className="block px-3 py-2 text-base font-medium text-gray-300 hover:text-white hover:bg-gray-700 rounded-md">Dashboard</Link>
                <Link to="/profile" className="block px-3 py-2 text-base font-medium text-gray-300 hover:text-white hover:bg-gray-700 rounded-md">Profile</Link>
                <button
                  onClick={handleLogout}
                  className="flex w-full items-center px-3 py-2 text-base font-medium text-gray-300 hover:text-white hover:bg-gray-700 rounded-md"
                >
                  <LogOut className="h-5 w-5 mr-2" />
                  Sign out
                </button>
              </div>
            ) : (
              <div className="px-2 space-y-1">
                <Link to="/login" className="block px-3 py-2 text-base font-medium text-gray-300 hover:text-white hover:bg-gray-700 rounded-md">Login</Link>
                <Link to="/register" className="block px-3 py-2 text-base font-medium text-gray-300 hover:text-white hover:bg-gray-700 rounded-md">Sign Up</Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
