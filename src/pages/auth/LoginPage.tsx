import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm, SubmitHandler } from 'react-hook-form';
import { Mail, Lock } from 'lucide-react';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import { useAuth } from '../../contexts/AuthContext';
import { useAlert } from '../../contexts/AlertContext';
import { alertMessages } from '../../utils/alerts';
import logo from '/public/images/flexi-logo.png';

type FormValues = {
  email: string;
  password: string;
};

const LoginPage: React.FC = () => {
  const { login } = useAuth();
  const { showAlert } = useAlert();
  const navigate = useNavigate();
  const [authError, setAuthError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>();

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    try {
      setAuthError(null);
      await login(data.email, data.password);

      // ✅ Show success alert and role-based redirection
      showAlert({ type: 'success', ...alertMessages.loginSuccess });
      
      const storedUser = localStorage.getItem('user');
      const user = storedUser ? JSON.parse(storedUser) : null;

      if (user?.role === 'owner') {
        navigate('/owner/dashboard', { replace: true });
      } else {
        navigate('/user/dashboard', { replace: true });
      }
    } catch {
      setAuthError('Invalid email or password. Please try again.');
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
            <h1 className="text-3xl font-extrabold text-gray-900">Welcome Back</h1>
            <p className="mt-2 text-gray-600">Sign in to your account</p>
          </div>

          {authError && (
            <div className="mb-6 bg-red-100 text-red-700 rounded-md p-4 text-sm">
              {authError}
            </div>
          )}

          <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
            <div>
              <Input
                label="Email Address"
                type="email"
                icon={<Mail className="h-5 w-5 text-gray-400" />}
                error={errors.email?.message}
                className="bg-gray-100 text-gray-900 placeholder-gray-400"
                {...register('email', {
                  required: 'Email is required',
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: 'Invalid email address',
                  },
                })}
              />
            </div>

            <div>
              <Input
                label="Password"
                type="password"
                icon={<Lock className="h-5 w-5 text-gray-400" />}
                error={errors.password?.message}
                className="bg-gray-100 text-gray-900 placeholder-gray-400"
                {...register('password', {
                  required: 'Password is required',
                  minLength: {
                    value: 6,
                    message: 'Password must be at least 6 characters',
                  },
                })}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 rounded bg-gray-200 border-gray-400 text-primary focus:ring-primary"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                  Remember me
                </label>
              </div>
              <div className="text-sm">
                <Link to="/forgot-password" className="text-primary hover:underline">
                  Forgot your password?
                </Link>
              </div>
            </div>

            <div>
              <Button
                type="submit"
                variant="primary"
                fullWidth
                isLoading={isSubmitting}
              >
                Sign in
              </Button>
            </div>
          </form>

          <div className="mt-8 text-center">
            <p className="text-gray-600">
              Don't have an account?{' '}
              <Link to="/register" className="text-primary hover:underline">
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
