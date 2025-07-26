import { configureStore } from '@reduxjs/toolkit';
import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';

import authReducer from '../../../../core/store/slices/authSlice';
import { LoginForm } from '../LoginForm';

const mockNavigate = jest.fn();
const mockLocation = { state: { from: { pathname: '/dashboard' } } };

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
  useLocation: () => mockLocation,
}));

describe('LoginForm Component Tests', () => {
  let store: any;

  const createMockStore = (initialState = {}) => configureStore({
    reducer: {
      auth: authReducer,
    },
    preloadedState: {
      auth: {
        user: null,
        token: null,
        isLoading: false,
        error: null,
        isInitialized: true,
        ...initialState,
      },
    },
  });

  const renderWithProviders = (ui: React.ReactElement, { storeState = {} } = {}) => {
    store = createMockStore(storeState);
    return render(
      <Provider store={store}>
        <BrowserRouter>
          {ui}
        </BrowserRouter>
      </Provider>,
    );
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockNavigate.mockClear();
  });

  describe('basic rendering', () => {
    test('should render all form elements', () => {
      const { getByRole, getByLabelText } = renderWithProviders(<LoginForm />);

      expect(getByRole('heading', { name: /sign in/i })).toBeInTheDocument();
      expect(getByLabelText(/email/i)).toBeInTheDocument();
      expect(getByLabelText(/password/i)).toBeInTheDocument();
      expect(getByRole('button', { name: /sign in/i })).toBeInTheDocument();
    });

    test('should have empty initial form state', () => {
      const { getByLabelText } = renderWithProviders(<LoginForm />);

      const emailInput = getByLabelText(/email/i);
      const passwordInput = getByLabelText(/password/i);

      expect(emailInput).toHaveValue('');
      expect(passwordInput).toHaveValue('');
    });
  });

  describe('user interaction', () => {
    test('should update form state when user types', async () => {
      const user = userEvent.setup();
      const { getByLabelText } = renderWithProviders(<LoginForm />);

      const emailInput = getByLabelText(/email/i);
      const passwordInput = getByLabelText(/password/i);

      await user.type(emailInput, 'test@example.com');
      await user.type(passwordInput, 'password123');

      expect(emailInput).toHaveValue('test@example.com');
      expect(passwordInput).toHaveValue('password123');
    });

    test('should show loading state', () => {
      const { getByRole, getByText } = renderWithProviders(<LoginForm />, {
        storeState: { isLoading: true },
      });

      const submitButton = getByRole('button');
      expect(submitButton).toBeDisabled();
      expect(getByText('Signing in...')).toBeInTheDocument();
    });
  });

  describe('form validation', () => {
    test('should display validation errors for empty fields', async () => {
      const user = userEvent.setup();
      const { getByRole, getByText } = renderWithProviders(<LoginForm />);

      const submitButton = getByRole('button', { name: /sign in/i });
      await user.click(submitButton);

      expect(getByText('Email is required')).toBeInTheDocument();
      expect(getByText('Password is required')).toBeInTheDocument();
    });

    test('should validate email format', async () => {
      const user = userEvent.setup();
      const { getByLabelText, getByRole, getByText } = renderWithProviders(<LoginForm />);

      const emailInput = getByLabelText(/email/i);
      const passwordInput = getByLabelText(/password/i);
      const submitButton = getByRole('button', { name: /sign in/i });

      await user.type(emailInput, 'invalid-email');
      await user.type(passwordInput, 'password123');
      await user.click(submitButton);

      expect(getByText('Email is invalid')).toBeInTheDocument();
    });

    test('should display error from Redux state', () => {
      const errorMessage = 'Invalid credentials';
      const { getByText } = renderWithProviders(<LoginForm />, {
        storeState: { error: errorMessage },
      });

      expect(getByText(errorMessage)).toBeInTheDocument();
    });
  });

  describe('form states', () => {
    test('should disable form during loading', () => {
      const { getByLabelText, getByRole } = renderWithProviders(<LoginForm />, {
        storeState: { isLoading: true },
      });

      const emailInput = getByLabelText(/email/i);
      const passwordInput = getByLabelText(/password/i);
      const submitButton = getByRole('button');

      expect(emailInput).toBeDisabled();
      expect(passwordInput).toBeDisabled();
      expect(submitButton).toBeDisabled();
    });

    test('should show sign up link', () => {
      const { getByRole } = renderWithProviders(<LoginForm />);

      const signUpLink = getByRole('link', { name: /sign up/i });
      expect(signUpLink).toBeInTheDocument();
      expect(signUpLink).toHaveAttribute('href', '/register');
    });
  });
});
