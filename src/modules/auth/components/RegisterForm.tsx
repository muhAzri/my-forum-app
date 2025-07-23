import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';

import type { AppDispatch, RootState } from '../../../core/store';
import { registerUser } from '../../../core/store/slices/authSlice';
import { Button } from '../../../shared/components/ui/button';
import { Input } from '../../../shared/components/ui/input';
import { TypingLoader } from '../../../shared/components/ui/pulse-loader';

export function RegisterForm() {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { isLoading, error } = useSelector((state: RootState) => state.auth);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const errors: Record<string, string> = {};

    if (!formData['name']) {
      errors['name'] = 'Name is required';
    }

    if (!formData['email']) {
      errors['email'] = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData['email'])) {
      errors['email'] = 'Email is invalid';
    }

    if (!formData['password']) {
      errors['password'] = 'Password is required';
    } else if (formData['password'].length < 6) {
      errors['password'] = 'Password must be at least 6 characters';
    }

    if (!formData['confirmPassword']) {
      errors['confirmPassword'] = 'Please confirm your password';
    } else if (formData['password'] !== formData['confirmPassword']) {
      errors['confirmPassword'] = 'Passwords do not match';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) { return; }

    const registerResult = await dispatch(registerUser({
      name: formData.name,
      email: formData.email,
      password: formData.password,
    }));

    if (registerResult.meta.requestStatus === 'fulfilled') {
      navigate('/login', {
        state: { message: 'Registration successful! Please sign in.' },
      });
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
          Sign Up
        </h2>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        <form className="space-y-4" onSubmit={handleSubmit}>
          <Input
            disabled={isLoading}
            error={formErrors['name']}
            label="Full Name"
            name="name"
            onChange={handleInputChange}
            placeholder="Enter your full name"
            type="text"
            value={formData['name']}
          />

          <Input
            disabled={isLoading}
            error={formErrors['email']}
            label="Email"
            name="email"
            onChange={handleInputChange}
            placeholder="Enter your email"
            type="email"
            value={formData['email']}
          />

          <Input
            disabled={isLoading}
            error={formErrors['password']}
            label="Password"
            name="password"
            onChange={handleInputChange}
            placeholder="Enter your password (min. 6 characters)"
            type="password"
            value={formData['password']}
          />

          <Input
            disabled={isLoading}
            error={formErrors['confirmPassword']}
            label="Confirm Password"
            name="confirmPassword"
            onChange={handleInputChange}
            placeholder="Confirm your password"
            type="password"
            value={formData['confirmPassword']}
          />

          <Button
            className="w-full"
            disabled={isLoading}
            type="submit"
          >
            {isLoading ? (
              <TypingLoader text="Creating account" />
            ) : (
              'Sign Up'
            )}
          </Button>
        </form>

        <p className="mt-4 text-center text-sm text-gray-600">
          Already have an account?{' '}
          <Link className="text-primary-600 hover:text-primary-700 font-medium" to="/login">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}