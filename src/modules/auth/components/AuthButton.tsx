import { LogOut } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

import type { AppDispatch, RootState } from '../../../core/store';
import { logout } from '../../../core/store/slices/authSlice';
import Avatar from '../../../shared/components/atoms/Avatar';
import Button from '../../../shared/components/atoms/Button';
import Icon from '../../../shared/components/atoms/Icon';
import Skeleton from '../../../shared/components/atoms/Skeleton';
import Text from '../../../shared/components/atoms/Text';

export function AuthButton() {
  const dispatch = useDispatch<AppDispatch>();
  const { user, token, isInitialized, isLoading } = useSelector((state: RootState) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
  };

  if (!isInitialized || isLoading) {
    return (
      <div className="flex items-center space-x-2">
        <Skeleton className="w-8 h-8 rounded-full" />
        <Skeleton className="w-16 h-4" />
      </div>
    );
  }

  if (token && user) {
    return (
      <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-3">
        <div className="flex items-center space-x-2">
          <Avatar
            alt={user.name}
            fallback={user.name.charAt(0).toUpperCase()}
            size="sm"
            src={user.avatar}
          />
          <Text className="text-gray-700 truncate max-w-[120px] sm:max-w-none" variant="small" weight="medium">
            {user.name}
          </Text>
        </div>
        <Button
          className="text-gray-600 hover:text-gray-900 w-full sm:w-auto"
          onClick={handleLogout}
          size="sm"
          variant="ghost"
        >
          <Icon className="mr-1" icon={LogOut} size="sm" />
          Logout
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-2 sm:space-y-0 sm:space-x-2 w-full sm:w-auto">
      <Button asChild className="w-full sm:w-auto" size="sm" variant="ghost">
        <Link to="/login">Sign In</Link>
      </Button>
      <Button asChild className="w-full sm:w-auto" size="sm">
        <Link to="/register">Sign Up</Link>
      </Button>
    </div>
  );
}