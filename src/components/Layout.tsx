import { Link, Outlet } from 'react-router-dom'

import { AuthButton } from '@/components/auth/AuthButton'
import { NavigationBar } from '@/components/navigation/NavigationBar'
import { navigationItems } from '@/config/navigationConfig'
import { ServiceContainer } from '@/services/ServiceContainer'

export default function Layout() {
  const serviceContainer = ServiceContainer.getInstance()
  const authService = serviceContainer.getAuthService()
  const isAuthenticated = authService.isAuthenticated()

  const handleSignIn = () => {
    // Sign in logic will be implemented here
  }

  const handleSignOut = () => {
    authService.removeToken()
    window.location.reload()
  }

  return (
    <div className="min-h-screen bg-background">
      <nav className="border-b">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <Link className="text-xl font-bold" to="/">
              My Forum
            </Link>
            <div className="flex items-center space-x-4">
              <NavigationBar items={navigationItems} />
              <AuthButton 
                isAuthenticated={isAuthenticated}
                onSignIn={handleSignIn}
                onSignOut={handleSignOut}
              />
            </div>
          </div>
        </div>
      </nav>
      <main>
        <Outlet />
      </main>
    </div>
  )
}