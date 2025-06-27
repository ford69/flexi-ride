import React, { useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';

const ResetPasswordPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const token = searchParams.get('token');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (password !== confirm) {
      setError('Passwords do not match.');
      return;
    }
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5001'}/api/auth/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || 'Failed to reset password.');
      }
      setSubmitted(true);
    } catch (err) {
      setError((err as Error).message || 'Failed to reset password.');
    }
  };

  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background-dark text-white">
        <div className="bg-background-card p-8 rounded-lg shadow-md max-w-md w-full text-center">
          <h1 className="text-2xl font-bold mb-4">Reset Password</h1>
          <p className="text-error">Invalid or missing reset token.</p>
          <Link to="/forgot-password">
            <Button variant="secondary">Request New Link</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background-dark text-white">
      <div className="bg-background-card p-8 rounded-lg shadow-md max-w-md w-full text-center">
        <h1 className="text-2xl font-bold mb-4">Reset Password</h1>
        {submitted ? (
          <>
            <p className="text-primary mb-6">Password reset successful. You can now log in.</p>
            <Link to="/login">
              <Button variant="primary">Go to Login</Button>
            </Link>
          </>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <Input
              label="New Password"
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              placeholder="Enter new password"
            />
            <Input
              label="Confirm Password"
              type="password"
              value={confirm}
              onChange={e => setConfirm(e.target.value)}
              required
              placeholder="Confirm new password"
            />
            {error && <p className="text-error text-sm">{error}</p>}
            <Button type="submit" variant="primary" fullWidth>
              Reset Password
            </Button>
          </form>
        )}
      </div>
    </div>
  );
};

export default ResetPasswordPage; 