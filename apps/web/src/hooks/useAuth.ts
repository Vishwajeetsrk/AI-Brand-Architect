import { useState, useCallback } from 'react';
import { authService, type AuthResponse } from '../services/auth';

interface AuthState {
  user: AuthResponse['user'] | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export function useAuth() {
  const [state, setState] = useState<AuthState>({
    user: authService.getUser(),
    isAuthenticated: authService.isAuthenticated(),
    isLoading: false,
  });

  const login = useCallback(async (email: string, password: string) => {
    setState((prev: AuthState) => ({ ...prev, isLoading: true }));
    try {
      const response = await authService.login({ email, password });
      setState({ user: response.user, isAuthenticated: true, isLoading: false });
      return response;
    } catch (error) {
      setState((prev: AuthState) => ({ ...prev, isLoading: false }));
      throw error;
    }
  }, []);

  const register = useCallback(async (email: string, password: string, name: string) => {
    setState((prev: AuthState) => ({ ...prev, isLoading: true }));
    try {
      const response = await authService.register({ email, password, name });
      setState({ user: response.user, isAuthenticated: true, isLoading: false });
      return response;
    } catch (error) {
      setState((prev: AuthState) => ({ ...prev, isLoading: false }));
      throw error;
    }
  }, []);

  const logout = useCallback(async () => {
    await authService.logout();
    setState({ user: null, isAuthenticated: false, isLoading: false });
  }, []);

  return { ...state, login, register, logout };
}
