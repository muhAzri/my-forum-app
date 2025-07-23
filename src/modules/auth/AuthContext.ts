import { createContext } from 'react';

import type { AuthContextValue } from './types/AuthTypes';

export const AuthContext = createContext<AuthContextValue | null>(null);