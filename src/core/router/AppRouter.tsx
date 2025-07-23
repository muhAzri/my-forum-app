import { BrowserRouter, Routes, Route } from 'react-router-dom';

import { AuthProvider } from '@/modules/auth/components/AuthProvider';
import { ProtectedRoute } from '@/modules/auth/components/ProtectedRoute';
import { Login } from '@/modules/auth/pages/Login';
import { Register } from '@/modules/auth/pages/Register';
import { Leaderboard } from '@/modules/leaderboard/pages/Leaderboard';
import { CreateThread } from '@/modules/threads/pages/CreateThread';
import { Home } from '@/modules/threads/pages/Home';
import { ThreadDetail } from '@/modules/threads/pages/ThreadDetail';
import { Threads } from '@/modules/threads/pages/Threads';
import { Layout } from '@/shared/components/layout/Layout';

export function AppRouter() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route element={<Layout />} path="/">
            <Route element={<Home />} index />
            <Route element={<Threads />} path="threads" />
            <Route element={<ThreadDetail />} path="threads/:id" />
            <Route
              element={
                <ProtectedRoute>
                  <CreateThread />
                </ProtectedRoute>
              }
              path="create-thread"
            />
            <Route element={<Leaderboard />} path="leaderboard" />
            <Route element={<Login />} path="login" />
            <Route element={<Register />} path="register" />
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}