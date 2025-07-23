import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate, useLocation } from 'react-router-dom';

import type { AppDispatch, RootState } from '../../store';
import { loginUser, fetchCurrentUser } from '../../store/slices/authSlice';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { TypingLoader } from '../ui/pulse-loader';

export function LoginForm() {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const location = useLocation();
  const { isLoading, error } = useSelector((state: RootState) => state.auth);

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const errors: Record<string, string> = {};

    if (!formData.email) {
      errors['email'] = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors['email'] = 'Email is invalid';
    }

    if (!formData.password) {
      errors['password'] = 'Password is required';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) { return; }

    try {
      await dispatch(loginUser(formData)).unwrap();
      await dispatch(fetchCurrentUser()).unwrap();

      // Navigate to the page user was trying to access, or home
      const from = location.state?.from?.pathname ?? '/';
      navigate(from, { replace: true });
    } catch (err) {
      console.error('Login failed:', err);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (formErrors[name]) {
      setFormErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold text-center mb-6 text-gray-900">
          Sign In
        </h2>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        <form className="space-y-4" onSubmit={handleSubmit}>
          <Input
            disabled={isLoading}
            error={formErrors['email']}
            label="Email"
            name="email"
            onChange={handleInputChange}
            placeholder="Enter your email"
            type="email"
            value={formData.email}
          />

          <Input
            disabled={isLoading}
            error={formErrors['password']}
            label="Password"
            name="password"
            onChange={handleInputChange}
            placeholder="Enter your password"
            type="password"
            value={formData.password}
          />

          <Button
            className="w-full"
            disabled={isLoading}
            type="submit"
          >
            {isLoading ? (
              <TypingLoader text="Signing in" />
            ) : (
              'Sign In'
            )}
          </Button>
        </form>

        <p className="mt-4 text-center text-sm text-gray-600">
          Don't have an account?{' '}
          <Link className="text-primary-600 hover:text-primary-700 font-medium" to="/register">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}