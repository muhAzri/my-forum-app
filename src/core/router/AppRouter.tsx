import { BrowserRouter, Routes, Route } from 'react-router-dom';

import { CreateThread } from '../../app/CreateThread';
import { Home } from '../../app/Home';
import { Leaderboard } from '../../app/Leaderboard';
import { Login } from '../../app/Login';
import { Register } from '../../app/Register';
import { ThreadDetail } from '../../app/ThreadDetail';
import { Threads } from '../../app/Threads';
import { AuthProvider } from '../../modules/auth/components/AuthProvider';
import { ProtectedRoute } from '../../modules/auth/components/ProtectedRoute';
import { Layout } from '../../shared/components/layout/Layout';

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