import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm, SubmitHandler } from 'react-hook-form';
import { Mail, Lock, User } from 'lucide-react';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import { useAuth } from '../../contexts/AuthContext';
import logo from '/public/images/flexi-logo.png';

type FormValues = {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  role: 'user' | 'owner';
};

const RegisterPage: React.FC = () => {
  const { register: registerUser } = useAuth();
  const navigate = useNavigate();
  const [authError, setAuthError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    defaultValues: {
      role: 'user',
    },
  });

  const password = watch('password');

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    try {
      setAuthError(null);
      await registerUser(data.name, data.email, data.password, data.role);

      // ✅ Redirect to login and show message
      alert('Registration successful! Please log in.');
      navigate('/login', { replace: true });
    } catch (error:unknown) {
      const message = error instanceof Error ? error.message : 'Registration failed';
      console.error('Registration error:', message);
      setAuthError('Registration failed. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md mx-auto">
        <div className="flex justify-center mb-6">
          <img src={logo} alt="FlexiRide Logo" className="h-12" />
        </div>
        <div className="w-full max-w-md mx-auto bg-white p-8 rounded-lg shadow-lg">
          <div className="text-center mb-10">
            <h1 className="text-3xl font-extrabold text-gray-900">Create an Account</h1>
            <p className="mt-2 text-gray-600">Join FlexiRide today</p>
          </div>

          {authError && (
            <div className="mb-6 bg-red-100 text-red-700 rounded-md p-4 text-sm">
              {authError}
            </div>
          )}

          <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
            <div>
              <Input
                label="Full Name"
                type="text"
                icon={<User className="h-5 w-5 text-gray-400" />}
                error={errors.name?.message}
                className="bg-gray-100 text-gray-900 placeholder-gray-400"
                {...register('name', {
                  required: 'Name is required',
                  minLength: {
                    value: 2,
                    message: 'Name must be at least 2 characters',
                  },
                })}
              />
            </div>

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

            <div>
              <Input
                label="Confirm Password"
                type="password"
                icon={<Lock className="h-5 w-5 text-gray-400" />}
                error={errors.confirmPassword?.message}
                className="bg-gray-100 text-gray-900 placeholder-gray-400"
                {...register('confirmPassword', {
                  required: 'Please confirm your password',
                  validate: (value) =>
                    value === password || 'The passwords do not match',
                })}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">I want to:</label>
              <div className="flex flex-col sm:flex-row gap-4">
                <label
                  className={`flex-1 p-3 border ${
                    watch('role') === 'user'
                      ? 'border-primary bg-primary/10'
                      : 'border-gray-700 hover:border-gray-600'
                  } rounded-md cursor-pointer transition-colors`}
                >
                  <input
                    type="radio"
                    className="sr-only"
                    value="user"
                    {...register('role')}
                  />
                  <div className="text-center">
                    <div className="font-medium text-gray-500">Rent a Car</div>
                    <div className="text-sm text-gray-400">Browse and book vehicles</div>
                  </div>
                </label>

                <label
                  className={`flex-1 p-3 border ${
                    watch('role') === 'owner'
                      ? 'border-primary bg-primary/10'
                      : 'border-gray-700 hover:border-gray-600'
                  } rounded-md cursor-pointer transition-colors`}
                >
                  <input
                    type="radio"
                    className="sr-only"
                    value="owner"
                    {...register('role')}
                  />
                  <div className="text-center">
                    <div className="font-medium text-gray-500">List My Car</div>
                    <div className="text-sm text-gray-400">Rent out your vehicles</div>
                  </div>
                </label>
              </div>
            </div>

            <div>
              <Button
                type="submit"
                variant="primary"
                fullWidth
                isLoading={isSubmitting}
              >
                Create Account
              </Button>
            </div>
          </form>

          <div className="mt-8 text-center">
            <p className="text-gray-600">
              Already have an account?{' '}
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

export default RegisterPage;
