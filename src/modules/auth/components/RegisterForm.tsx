import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import type { AppDispatch, RootState } from '../../../core/store';
import { registerUser } from '../../../core/store/slices/authSlice';
import Button from '../../../shared/components/atoms/Button';
import Heading from '../../../shared/components/atoms/Heading';
import Link from '../../../shared/components/atoms/Link';
import Spinner from '../../../shared/components/atoms/Spinner';
import Text from '../../../shared/components/atoms/Text';
import AlertMessage from '../../../shared/components/molecules/AlertMessage';
import FormField from '../../../shared/components/molecules/FormField';

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
        <Heading className="text-center mb-6 text-gray-900" level={2}>
          Sign Up
        </Heading>

        {error && (
          <AlertMessage className="mb-4" variant="error">
            {error}
          </AlertMessage>
        )}

        <form className="space-y-4" onSubmit={handleSubmit}>
          <FormField
            disabled={isLoading}
            error={formErrors['name']}
            label="Full Name"
            name="name"
            onChange={handleInputChange}
            placeholder="Enter your full name"
            required
            type="text"
            value={formData['name']}
          />

          <FormField
            disabled={isLoading}
            error={formErrors['email']}
            label="Email"
            name="email"
            onChange={handleInputChange}
            placeholder="Enter your email"
            required
            type="email"
            value={formData['email']}
          />

          <FormField
            disabled={isLoading}
            error={formErrors['password']}
            helperText="Password must be at least 6 characters"
            label="Password"
            name="password"
            onChange={handleInputChange}
            placeholder="Enter your password (min. 6 characters)"
            required
            type="password"
            value={formData['password']}
          />

          <FormField
            disabled={isLoading}
            error={formErrors['confirmPassword']}
            label="Confirm Password"
            name="confirmPassword"
            onChange={handleInputChange}
            placeholder="Confirm your password"
            required
            type="password"
            value={formData['confirmPassword']}
          />

          <Button
            className="w-full"
            disabled={isLoading}
            type="submit"
          >
            {isLoading ? (
              <div className="flex items-center gap-2">
                <Spinner size="sm" />
                <span>Creating account...</span>
              </div>
            ) : (
              'Sign Up'
            )}
          </Button>
        </form>

        <Text className="mt-4 text-center text-gray-600" variant="small">
          Already have an account?{' '}
          <Link className="font-medium" to="/login">
            Sign in
          </Link>
        </Text>
      </div>
    </div>
  );
}