import { LogOut, User } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

import type { AppDispatch, RootState } from '../../store';
import { logout } from '../../store/slices/authSlice';
import { Button } from '../ui/button';

export function AuthButton() {
  const dispatch = useDispatch<AppDispatch>();
  const { user, token, isInitialized, isLoading } = useSelector((state: RootState) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
  };

  // Show loading state while initializing auth
  if (!isInitialized || isLoading) {
    return (
      <div className="flex items-center space-x-2">
        <div className="w-8 h-8 rounded-full bg-gray-200 animate-pulse" />
        <div className="w-16 h-4 bg-gray-200 rounded animate-pulse" />
      </div>
    );
  }

  if (token && user) {
    return (
      <div className="flex items-center space-x-3">
        <div className="flex items-center space-x-2">
          {user.avatar ? (
            <img
              alt={user.name}
              className="w-8 h-8 rounded-full"
              src={user.avatar}
            />
          ) : (
            <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
              <User className="w-4 h-4 text-gray-500" />
            </div>
          )}
          <span className="text-sm font-medium text-gray-700">{user.name}</span>
        </div>
        <Button
          className="text-gray-600 hover:text-gray-900"
          onClick={handleLogout}
          size="sm"
          variant="ghost"
        >
          <LogOut className="w-4 h-4 mr-1" />
          Logout
        </Button>
      </div>
    );
  }

  return (
    <div className="flex items-center space-x-2">
      <Button asChild size="sm" variant="ghost">
        <Link to="/login">Sign In</Link>
      </Button>
      <Button asChild size="sm">
        <Link to="/register">Sign Up</Link>
      </Button>
    </div>
  );
}