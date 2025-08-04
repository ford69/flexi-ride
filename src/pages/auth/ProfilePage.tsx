import React, { useState, useRef } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import { Camera } from 'lucide-react';
import Card, { CardContent, CardHeader } from '../../components/ui/Card';

const ProfilePage: React.FC = () => {
  const { user, setUser } = useAuth();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState(user?.name || '');
  const [isEditingName, setIsEditingName] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 text-gray-900">
        <div className="bg-white p-8 rounded-2xl shadow-lg max-w-md w-full text-center border border-gray-100">
          <h1 className="text-2xl font-bold mb-4">Profile</h1>
          <p className="text-red-600">You must be logged in to view your profile.</p>
        </div>
      </div>
    );
  }

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Please select an image file.');
      return;
    }

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('Image size must be less than 5MB.');
      return;
    }

    setIsUploadingAvatar(true);
    setError(null);
    setSuccess(null);

    try {
      const formData = new FormData();
      formData.append('avatar', file);
      formData.append('name', name);

      const token = localStorage.getItem('token');
      const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5001'}/api/auth/profile`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to update profile.');

      // Update local user state
      const updatedUser = { ...user, ...data };
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
      
      setSuccess('Profile updated successfully.');
    } catch (err) {
      setError((err as Error).message || 'Failed to update profile.');
    } finally {
      setIsUploadingAvatar(false);
    }
  };

  const handleNameUpdate = async () => {
    if (!name.trim()) {
      setError('Name cannot be empty.');
      return;
    }

    setIsSubmitting(true);
    setError(null);
    setSuccess(null);

    try {
      const formData = new FormData();
      formData.append('name', name);

      const token = localStorage.getItem('token');
      const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5001'}/api/auth/profile`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to update profile.');

      // Update local user state
      const updatedUser = { ...user, ...data };
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
      
      setSuccess('Profile updated successfully.');
      setIsEditingName(false);
    } catch (err) {
      setError((err as Error).message || 'Failed to update profile.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccess(null);
    setError(null);
    if (newPassword !== confirmPassword) {
      setError('New passwords do not match.');
      return;
    }
    setIsSubmitting(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5001'}/api/auth/change-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to change password.');
      setSuccess('Password changed successfully.');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      setError((err as Error).message || 'Failed to change password.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-28 pb-16">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl sm:text-4xl font-extrabold mb-10 text-center text-gray-900">My Profile</h1>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Profile Information */}
          <Card className="bg-white rounded-2xl shadow-lg border border-gray-100">
            <CardHeader className="bg-green-700 rounded-t-2xl p-6">
              <h2 className="text-xl font-bold text-white">Profile Information</h2>
            </CardHeader>
            <CardContent className="space-y-8 bg-green-50 rounded-b-2xl p-6">
              {/* Avatar Section */}
              <div className="flex items-center space-x-6">
                <div className="relative">
                  {user?.avatar ? (
                    <img
                      src={`http://localhost:5001${user.avatar}`}
                      alt={user.name}
                      className="h-24 w-24 rounded-full object-cover border-4 border-green-600 shadow-md bg-white"
                    />
                  ) : (
                    <div className="h-24 w-24 rounded-full bg-green-200 flex items-center justify-center text-green-800 text-2xl font-bold border-4 border-green-600 shadow-md">
                      {getInitials(user.name)}
                    </div>
                  )}
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="absolute -bottom-2 -right-2 h-9 w-9 bg-green-600 border-4 border-white rounded-full flex items-center justify-center hover:bg-green-700 transition-colors shadow-lg"
                    disabled={isUploadingAvatar}
                  >
                    <Camera className="h-5 w-5 text-white" />
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarUpload}
                    className="hidden"
                  />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-gray-900">{user.name}</h3>
                  <p className="text-gray-500">{user.email}</p>
                  {isUploadingAvatar && (
                    <p className="text-sm text-green-700 mt-1">Uploading avatar...</p>
                  )}
                </div>
              </div>

              {/* Name Edit Section */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Name</label>
                {isEditingName ? (
                  <div className="flex space-x-2">
                    <Input
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Enter your name"
                      className="flex-1"
                    />
                    <Button
                      onClick={handleNameUpdate}
                      isLoading={isSubmitting}
                      size="sm"
                    >
                      Save
                    </Button>
                    <Button
                      variant="ghost"
                      onClick={() => {
                        setIsEditingName(false);
                        setName(user.name);
                      }}
                      size="sm"
                    >
                      Cancel
                    </Button>
                  </div>
                ) : (
                  <div className="flex items-center justify-between p-3 bg-white rounded-md border border-gray-200">
                    <span className="text-gray-900">{user.name}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setIsEditingName(true)}
                      className="text-green-700 hover:bg-green-100"
                    >
                      Edit
                    </Button>
                  </div>
                )}
              </div>

              {/* Email (Read-only) */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <div className="p-3 bg-white rounded-md border border-gray-200 text-gray-500">
                  {user.email}
                </div>
              </div>

              {success && <p className="text-green-700 text-sm font-medium">{success}</p>}
              {error && <p className="text-red-600 text-sm font-medium">{error}</p>}
            </CardContent>
          </Card>

          {/* Change Password */}
          <Card className="bg-white rounded-2xl shadow-lg border border-gray-100">
            <CardHeader className="bg-green-700 rounded-t-2xl p-6">
              <h2 className="text-xl font-bold text-white">Change Password</h2>
            </CardHeader>
            <CardContent className="bg-green-50 rounded-b-2xl p-6">
              <form onSubmit={handlePasswordChange} className="space-y-4">
                <Input
                  label="Current Password"
                  type="password"
                  value={currentPassword}
                  onChange={e => setCurrentPassword(e.target.value)}
                  required
                  placeholder="Enter current password"
                />
                <Input
                  label="New Password"
                  type="password"
                  value={newPassword}
                  onChange={e => setNewPassword(e.target.value)}
                  required
                  placeholder="Enter new password"
                />
                <Input
                  label="Confirm New Password"
                  type="password"
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                  required
                  placeholder="Confirm new password"
                />
                <Button type="submit" variant="primary" fullWidth isLoading={isSubmitting} className="bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-lg transform hover:scale-105 transition-all duration-300">
                  Change Password
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage; 