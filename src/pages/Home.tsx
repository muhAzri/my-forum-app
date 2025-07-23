import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { ThreadList } from '../components/threads/ThreadList';
import type { AppDispatch, RootState } from '../store';
import { fetchCurrentUser } from '../store/slices/authSlice';

export function Home() {
  const dispatch = useDispatch<AppDispatch>();
  const { token, user } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    if (token && !user) {
      dispatch(fetchCurrentUser());
    }
  }, [dispatch, token, user]);

  return <ThreadList />;
}