import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import logo from '/public/images/flexi-logo.png';

const ForgotPasswordPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5001'}/api/auth/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      if (!res.ok) throw new Error('Failed to send reset email.');
      setSubmitted(true);
    } catch (err) {
      setError('Failed to send reset email. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md mx-auto">
        <div className="flex justify-center mb-6">
          <img src={logo} alt="FlexiRide Logo" className="h-12" />
        </div>
        <div className="w-full max-w-md mx-auto bg-white p-8 rounded-lg shadow-lg">
          <div className="text-center mb-10">
            <h1 className="text-3xl font-extrabold text-gray-900">Forgot Password</h1>
            <p className="mt-2 text-gray-600">Enter your email to reset your password</p>
          </div>
          {submitted ? (
            <p className="text-primary mb-6 text-center">If that email exists, a reset link has been sent.</p>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <Input
                label="Email Address"
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                placeholder="Enter your email"
                className="bg-gray-100 text-gray-900 placeholder-gray-400"
              />
              {error && <p className="text-error text-sm">{error}</p>}
              <Button type="submit" variant="primary" fullWidth>
                Send Reset Link
              </Button>
            </form>
          )}
          <div className="mt-8 text-center">
            <p className="text-gray-600">
              Remember your password?{' '}
              <Link to="/login" className="text-primary hover:underline">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;