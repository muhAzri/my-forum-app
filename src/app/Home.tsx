import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import type { AppDispatch, RootState } from '../core/store';
import { fetchCurrentUser } from '../core/store/slices/authSlice';
import { ThreadList } from '../modules/threads/components/ThreadList';

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