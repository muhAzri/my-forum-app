import { Provider } from 'react-redux'

import { store } from './store'
import { AppRouter } from './router/AppRouter'

export function App() {
  return (
    <Provider store={store}>
      <AppRouter />
    </Provider>
  )
}