import { useState, useCallback, useEffect } from 'react';
import { authService, type AuthResponse, type UserInfo } from '../services/auth';

interface AuthState {
  user: UserInfo | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

function getInitialState(): AuthState {
  if (typeof window === 'undefined') return { user: null, isAuthenticated: false, isLoading: false };
  try {
    return {
      user: authService.getUser(),
      isAuthenticated: authService.isAuthenticated(),
      isLoading: false,
    };
  } catch {
    return { user: null, isAuthenticated: false, isLoading: false };
  }
}

export function useAuth() {
  const [state, setState] = useState<AuthState>(getInitialState);
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    if (!initialized) setInitialized(true);
  }, [initialized]);

  const login = useCallback(async (email: string, password: string) => {
    setState(prev => ({ ...prev, isLoading: true }));
    try {
      const response = await authService.login({ email, password });
      setState({ user: response.user, isAuthenticated: true, isLoading: false });
      return response;
    } catch (error) {
      setState(prev => ({ ...prev, isLoading: false }));
      throw error;
    }
  }, []);

  const register = useCallback(async (email: string, password: string, name: string) => {
    setState(prev => ({ ...prev, isLoading: true }));
    try {
      const response = await authService.register({ email, password, name });
      setState({ user: response.user, isAuthenticated: true, isLoading: false });
      return response;
    } catch (error) {
      setState(prev => ({ ...prev, isLoading: false }));
      throw error;
    }
  }, []);

  const logout = useCallback(async () => {
    await authService.logout();
    setState({ user: null, isAuthenticated: false, isLoading: false });
  }, []);

  return { ...state, initialized, login, register, logout };
}
