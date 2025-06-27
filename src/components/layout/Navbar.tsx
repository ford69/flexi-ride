import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, UserCircle, LogOut } from 'lucide-react';
import Button from '../ui/Button';
import ProfileDropdown from './ProfileDropdown';
import { useAuth } from '../../contexts/AuthContext';

const Navbar: React.FC = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [isResending, setIsResending] = useState(false);
  const [resentMsg, setResentMsg] = useState<string | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

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

  const handleResend = async () => {
    setIsResending(true);
    setResentMsg(null);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5001'}/api/auth/resend-verification`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: user?.email }),
      });
      const data = await res.json();
      if (res.ok) {
        setResentMsg('Verification email sent! Check your inbox.');
      } else {
        setResentMsg(data.message || 'Failed to resend verification email.');
      }
    } catch {
      setResentMsg('Failed to resend verification email.');
    } finally {
      setIsResending(false);
    }
  };

  return (
    <>
      {isAuthenticated && user && !user.isVerified && (
        <div className="bg-yellow-900/90 text-yellow-200 text-sm py-2 px-4 flex items-center justify-between">
          <span>
            Your email is not verified. Please check your inbox to verify your account.
            {resentMsg && <span className="ml-2 text-green-300">{resentMsg}</span>}
          </span>
          <Button
            variant="secondary"
            size="sm"
            onClick={handleResend}
            isLoading={isResending}
            className="ml-4"
          >
            Resend Verification Email
          </Button>
        </div>
      )}
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
                <ProfileDropdown />
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
                    {user?.avatar ? (
                      <img
                        src={`http://localhost:5001${user.avatar}`}
                        alt={user.name}
                        className="h-10 w-10 rounded-full object-cover"
                      />
                    ) : (
                      <UserCircle className="h-10 w-10 text-gray-400" />
                    )}
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
    </>
  );
};

export default Navbar;
