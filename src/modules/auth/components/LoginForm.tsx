import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';

import type { AppDispatch, RootState } from '../../../core/store';
import { loginUser, fetchCurrentUser } from '../../../core/store/slices/authSlice';
import Button from '../../../shared/components/atoms/Button';
import Heading from '../../../shared/components/atoms/Heading';
import Link from '../../../shared/components/atoms/Link';
import Spinner from '../../../shared/components/atoms/Spinner';
import Text from '../../../shared/components/atoms/Text';
import AlertMessage from '../../../shared/components/molecules/AlertMessage';
import FormField from '../../../shared/components/molecules/FormField';

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
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Email is invalid';
    }

    if (!formData.password) {
      errors.password = 'Password is required';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) { return; }

    const loginResult = await dispatch(loginUser(formData));

    if (loginResult.meta.requestStatus === 'fulfilled') {
      await dispatch(fetchCurrentUser());
      const from = location.state?.from?.pathname ?? '/';
      navigate(from, { replace: true });
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
          Sign In
        </Heading>

        {error && (
          <AlertMessage className="mb-4" variant="error">
            {error}
          </AlertMessage>
        )}

        <form className="space-y-4" onSubmit={handleSubmit}>
          <FormField
            disabled={isLoading}
            error={formErrors.email}
            label="Email"
            name="email"
            onChange={handleInputChange}
            placeholder="Enter your email"
            required
            type="email"
            value={formData.email}
          />

          <FormField
            disabled={isLoading}
            error={formErrors.password}
            label="Password"
            name="password"
            onChange={handleInputChange}
            placeholder="Enter your password"
            required
            type="password"
            value={formData.password}
          />

          <Button
            className="w-full"
            disabled={isLoading}
            type="submit"
          >
            {isLoading ? (
              <div className="flex items-center gap-2">
                <Spinner size="sm" />
                <span>Signing in...</span>
              </div>
            ) : (
              'Sign In'
            )}
          </Button>
        </form>

        <Text className="mt-4 text-center text-gray-600" variant="small">
          Don&apos;t have an account?
          {' '}
          <Link className="font-medium" to="/register">
            Sign up
          </Link>
        </Text>
      </div>
    </div>
  );
}
