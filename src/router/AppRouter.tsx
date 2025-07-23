import { BrowserRouter, Routes, Route } from 'react-router-dom';

import { AuthProvider } from '../components/auth/AuthProvider';
import { ProtectedRoute } from '../components/auth/ProtectedRoute';
import { Layout } from '../components/Layout';
import { CreateThread } from '../pages/CreateThread';
import { Home } from '../pages/Home';
import { Leaderboard } from '../pages/Leaderboard';
import { Login } from '../pages/Login';
import { Register } from '../pages/Register';
import { ThreadDetail } from '../pages/ThreadDetail';
import { Threads } from '../pages/Threads';

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