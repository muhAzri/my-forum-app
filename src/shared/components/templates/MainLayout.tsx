import React from 'react';
import { Outlet } from 'react-router-dom';

import { navigationItems } from '../../../core/config/navigationConfig';
import Heading from '../atoms/Heading';
import Link from '../atoms/Link';
import NavigationBar from '../organisms/NavigationBar';

interface MainLayoutProps {
  AuthButton?: React.ComponentType;
}

function MainLayout({ AuthButton }: MainLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link to="/" underline="none">
              <Heading className="text-gray-900" level={4} weight="bold">
                Forum App
              </Heading>
            </Link>
            <div className="flex items-center space-x-4">
              <NavigationBar items={navigationItems} />
              {AuthButton && <AuthButton />}
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

export default MainLayout;
