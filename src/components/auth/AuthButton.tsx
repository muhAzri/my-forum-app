import { Button } from '@/components/ui/button';

interface AuthButtonProps {
  isAuthenticated: boolean
  onSignIn: () => void
  onSignOut: () => void
}

export function AuthButton({ isAuthenticated, onSignIn, onSignOut }: AuthButtonProps) {
  if (isAuthenticated) {
    return (
      <Button onClick={onSignOut} variant="outline">
        Sign Out
      </Button>
    );
  }

  return (
    <Button onClick={onSignIn} variant="outline">
      Sign In
    </Button>
  );
}