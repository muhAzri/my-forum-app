import { Link, Outlet } from 'react-router-dom';

import { navigationItems } from '../../../core/config/navigationConfig';
import { AuthButton } from '../../../modules/auth/components/AuthButton';

import { NavigationBar } from './NavigationBar';

export function Layout() {
  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link className="text-xl font-bold text-gray-900" to="/">
              Forum App
            </Link>
            <div className="flex items-center space-x-4">
              <NavigationBar items={navigationItems} />
              <AuthButton />
            </div>
          </div>
        </div>
      </nav>
      <main>
        <Outlet />
      </main>
    </div>
  );
}