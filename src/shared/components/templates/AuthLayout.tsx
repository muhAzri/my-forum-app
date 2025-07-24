import React from 'react';

import { cn } from '../../utils/utils';
import Heading from '../atoms/Heading';
import Link from '../atoms/Link';
import Text from '../atoms/Text';

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
  footerText?: string;
  footerLink?: {
    text: string;
    to: string;
  };
  className?: string;
}

function AuthLayout({
  children,
  title,
  subtitle,
  footerText,
  footerLink,
  className,
}: AuthLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <Link className="flex justify-center" to="/" underline="none">
          <Heading className="text-primary-600" level={2} weight="bold">
            Forum App
          </Heading>
        </Link>

        <div className="mt-6 text-center">
          <Heading className="text-gray-900" level={2}>
            {title}
          </Heading>
          {subtitle && (
            <Text className="mt-2 text-gray-600" variant="body">
              {subtitle}
            </Text>
          )}
        </div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className={cn('bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10', className)}>
          {children}
        </div>

        {(footerText ?? footerLink) && (
          <div className="mt-6 text-center">
            {footerText && (
              <Text className="text-gray-600" variant="body">
                {footerText}{' '}
                {footerLink && (
                  <Link className="font-medium" to={footerLink.to}>
                    {footerLink.text}
                  </Link>
                )}
              </Text>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default AuthLayout;