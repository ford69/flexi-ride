import React, { useState } from 'react';
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
        <div className="fixed top-0 left-0 w-full z-30 bg-yellow-900/90 text-yellow-200 text-sm py-2 px-4 flex items-center justify-between">
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
      <nav className={`fixed left-0 w-full z-20 bg-white text-green-400 shadow-none transition-colors ${isAuthenticated && user && !user.isVerified ? 'top-10' : 'top-0'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            {/* Logo */}
            <div className="flex items-center">
              <Link to="/" className="flex items-center" onClick={() => { if (window.location.pathname !== '/') { window.scrollTo({ top: 0, behavior: 'smooth' }); } }}>
                <img src="/images/logo.png" alt="FlexiRide Logo" className="h-10 w-15" />
              </Link>
            </div>
            
            {/* Centered Navigation Links */}
            <div className="hidden md:flex items-center justify-center flex-1">
              <div className="flex space-x-8">
                <Link to="/" className="text-black hover:text-gray-600 px-3 py-2 text-sm font-medium transition-colors" onClick={e => {
                  if (window.location.pathname !== '/') return;
                  e.preventDefault();
                  const el = document.getElementById('home');
                  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }}>Home</Link>
                <a href="#how-it-works" className="text-black hover:text-gray-600 px-3 py-2 text-sm font-medium transition-colors">How It Works</a>
                <a href="#services" className="text-black hover:text-gray-600 px-3 py-2 text-sm font-medium transition-colors">Services</a>
                <a href="#partner" className="text-black hover:text-gray-600 px-3 py-2 text-sm font-medium transition-colors">Partner With Us</a>
                <a href="#contact" className="text-black hover:text-gray-600 px-3 py-2 text-sm font-medium transition-colors">Contact</a>
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
                    className="text-black border-gray-400 hover:bg-gray-900/20"
                  >
                    Login
                  </Button>
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => navigate('/register')}
                    className="bg-black text-white hover:bg-gray-600"
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
                className="inline-flex items-center justify-center p-2 rounded-md text-black hover:text-gray-400 hover:bg-gray-900/20 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-gray-800"
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
          <div className="md:hidden bg-black/80 backdrop-blur-md" id="mobile-menu">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              <Link to="/" className="block px-3 py-2 text-base font-medium text-white hover:text-[#277f75] hover:bg-green-900/20 rounded-md transition-colors" onClick={e => {
                if (window.location.pathname !== '/') return;
                e.preventDefault();
                const el = document.getElementById('home');
                if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
              }}>Home</Link>
              <a href="#how-it-works" className="block px-3 py-2 text-base font-medium text-white hover:text-[#277f75] hover:bg-gray-900/20 rounded-md transition-colors">How It Works</a>
              <a href="#services" className="block px-3 py-2 text-base font-medium text-white hover:text-[#277f75] hover:bg-gray-900/20 rounded-md transition-colors">Services</a>
              <a href="#partner" className="block px-3 py-2 text-base font-medium text-white hover:text-[#277f75] hover:bg-gray-900/20 rounded-md transition-colors">Partner With Us</a>
              <a href="#contact" className="block px-3 py-2 text-base font-medium text-white hover:text-[#277f75] hover:bg-gray-900/20 rounded-md transition-colors">Contact</a>
            </div>
            <div className="pt-4 pb-3 border-t border-green-900/40">
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
                      <UserCircle className="h-10 w-10 text-white" />
                    )}
                    <div className="ml-3">
                      <div className="text-base font-medium text-white">{user?.name}</div>
                      <div className="text-sm font-medium text-gray-300">{user?.email}</div>
                    </div>
                  </div>
                  <Link to={getDashboardLink()} className="block px-3 py-2 text-base font-medium text-white hover:text-[#277f75] hover:bg-green-900/20 rounded-md">Dashboard</Link>
                  <Link to="/profile" className="block px-3 py-2 text-base font-medium text-white hover:text-[#277f75] hover:bg-green-900/20 rounded-md">Profile</Link>
                  <button
                    onClick={handleLogout}
                    className="flex w-full items-center px-3 py-2 text-base font-medium text-white hover:text-[#277f75] hover:bg-green-900/20 rounded-md"
                  >
                    <LogOut className="h-5 w-5 mr-2" />
                    Sign out
                  </button>
                </div>
              ) : (
                <div className="px-2 space-y-1">
                  <button
                    onClick={() => navigate('/login')}
                    className="block w-full text-left px-3 py-2 text-base font-medium text-white hover:text-[#277f75] hover:bg-green-900/20 rounded-md"
                  >
                    Login
                  </button>
                  <button
                    onClick={() => navigate('/register')}
                    className="block w-full text-left px-3 py-2 text-base font-medium text-white bg-[#277f75] hover:bg-[#4fd1c2] rounded-md"
                  >
                    Sign Up
                  </button>
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
