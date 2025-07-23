import { Provider } from 'react-redux';

import { AppRouter } from '@/core/router/AppRouter';
import { store } from '@/core/store';

export function App() {
  return (
    <Provider store={store}>
      <AppRouter />
    </Provider>
  );
}