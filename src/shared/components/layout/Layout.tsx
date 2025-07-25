import { Menu, X } from 'lucide-react';
import { useState } from 'react';
import { Link, Outlet } from 'react-router-dom';

import { navigationItems } from '../../../core/config/navigationConfig';
import { AuthButton } from '../../../modules/auth/components/AuthButton';

import { NavigationBar } from './NavigationBar';

export function Layout() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link className="text-xl font-bold text-gray-900" to="/">
              Forum App
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-4">
              <NavigationBar items={navigationItems} />
              <AuthButton />
            </div>

            {/* Mobile menu button */}
            <button
              className="md:hidden p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              type="button"
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>

          {/* Mobile Navigation Menu */}
          {isMobileMenuOpen && (
            <div className="md:hidden">
              <div className="px-2 pt-2 pb-3 space-y-1 border-t border-gray-200">
                {navigationItems.map((item) => (
                  <Link
                    key={item.to}
                    className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
                    onClick={() => setIsMobileMenuOpen(false)}
                    to={item.to}
                  >
                    {item.label}
                  </Link>
                ))}
                <div className="pt-4 border-t border-gray-200 mt-4">
                  <AuthButton />
                </div>
              </div>
            </div>
          )}
        </div>
      </nav>
      <main className="pb-16 md:pb-0">
        <Outlet />
      </main>
    </div>
  );
}
