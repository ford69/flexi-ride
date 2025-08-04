import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Settings, LogOut, ChevronDown } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const ProfileDropdown: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
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

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 text-white hover:text-primary transition-colors duration-200"
      >
        <div className="relative">
          {user?.avatar ? (
            <img
              src={`http://localhost:5001${user.avatar}`}
              alt={user.name}
              className="h-8 w-8 rounded-full object-cover border-2 border-gray-600"
            />
          ) : (
            <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-white text-sm font-medium border-2 border-gray-600">
              {getInitials(user?.name || 'U')}
            </div>
          )}
        </div>
        <span className="hidden md:block text-sm font-medium">{user?.name}</span>
        <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-gray-50 rounded-md shadow-lg py-1 z-50 border border-white">
          <div className="px-4 py-2 border-b border-gray-700">
            <p className="text-sm text-gray-600 font-medium">{user?.name}</p>
            <p className="text-xs text-gray-600">{user?.email}</p>
          </div>
          
          <Link
            to="/profile"
            className="flex items-center px-4 py-2 text-sm text-gray-600 hover:bg-primary hover:text-white transition-colors duration-200"
            onClick={() => setIsOpen(false)}
          >
            <User className="h-4 w-4 mr-3" />
            Profile
          </Link>
          
          <Link
            to={getDashboardLink()}
            className="flex items-center px-4 py-2 text-sm text-gray-600 hover:bg-primary hover:text-white transition-colors duration-200"
            onClick={() => setIsOpen(false)}
          >
            <Settings className="h-4 w-4 mr-3" />
            Dashboard
          </Link>
          
          <button
            onClick={handleLogout}
            className="flex items-center w-full px-4 py-2 text-sm text-gray-600 hover:bg-primary hover:text-white transition-colors duration-200"
          >
            <LogOut className="h-4 w-4 mr-3" />
            Logout
          </button>
        </div>
      )}
    </div>
  );
};

export default ProfileDropdown; 