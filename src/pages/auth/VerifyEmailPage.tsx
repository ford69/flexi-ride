import React, { useEffect, useState, useRef } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import Button from '../../components/ui/Button';
import { useAuth } from '../../contexts/AuthContext';
import { User } from '../../types';

const VerifyEmailPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState<'pending' | 'success' | 'error'>('pending');
  const [message, setMessage] = useState('Verifying your email...');
  const { setUser } = useAuth();
  const verificationAttempted = useRef(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (verificationAttempted.current) {
      return;
    }
    verificationAttempted.current = true;

    const verificationToken = searchParams.get('token');
    if (!verificationToken) {
      setStatus('error');
      setMessage('Invalid or missing verification token.');
      return;
    }

    const verifyAndRefresh = async () => {
      try {
        const verifyRes = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5001'}/api/auth/verify-email?token=${verificationToken}`);
        const verifyData = await verifyRes.json();

        if (!verifyRes.ok) {
          setStatus('error');
          setMessage(verifyData.message || 'Verification failed. The link may be expired or invalid.');
          return;
        }

        setStatus('success');
        setMessage('Email verified successfully! Please log in again to continue.');

        // Clear session and redirect to login after a short delay
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        if (setUser) setUser(null);
        setTimeout(() => {
          navigate('/login');
        }, 2500);
      } catch (err) {
        setStatus('error');
        setMessage('An unexpected error occurred. Please try again later.');
      }
    };

    verifyAndRefresh();
  }, [searchParams, setUser, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background-dark text-white">
      <div className="bg-background-card p-8 rounded-lg shadow-md max-w-md w-full text-center">
        <h1 className="text-2xl font-bold mb-4">Email Verification</h1>
        <p className={`mb-6 ${status === 'success' ? 'text-primary' : status === 'error' ? 'text-error' : 'text-gray-300'}`}>{message}</p>
        {status === 'success' && (
          <Button variant="primary" disabled>
            Redirecting to Login...
          </Button>
        )}
        {status === 'error' && (
          <Link to="/">
            <Button variant="secondary">Back to Home</Button>
          </Link>
        )}
      </div>
    </div>
  );
};

export default VerifyEmailPage; 