import { useEffect } from 'react';
import { Provider, useDispatch } from 'react-redux';

import { AppRouter } from '@/core/router/AppRouter';
import { store, type AppDispatch } from '@/core/store';
import { fetchCurrentUser, setInitialized } from '@/core/store/slices/authSlice';

function AppContent() {
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      dispatch(fetchCurrentUser());
    } else {
      dispatch(setInitialized());
    }
  }, [dispatch]);

  return <AppRouter />;
}

export function App() {
  return (
    <Provider store={store}>
      <AppContent />
    </Provider>
  );
}