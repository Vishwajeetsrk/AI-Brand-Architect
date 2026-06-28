import { api } from './api';

export interface LoginDto {
  email: string;
  password: string;
}

export interface RegisterDto {
  email: string;
  password: string;
  name: string;
}

export interface UserInfo {
  id: string;
  email: string;
  name: string;
  role: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  userId: string;
  email: string;
  role: string;
  name: string;
  user: UserInfo;
}

const TOKEN_KEY = 'nexora_token';
const REFRESH_KEY = 'nexora_refresh';
const USER_KEY = 'nexora_user';

export const authService = {
  async login(data: LoginDto): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>('/auth/login', data);
    this.persistAuth(response);
    return response;
  },

  async register(data: RegisterDto): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>('/auth/register', data);
    this.persistAuth(response);
    return response;
  },

  async refresh(): Promise<AuthResponse | null> {
    const refreshToken = localStorage.getItem(REFRESH_KEY);
    if (!refreshToken) return null;
    try {
      const response = await api.post<AuthResponse>('/auth/refresh', { refreshToken });
      this.persistAuth(response);
      return response;
    } catch {
      this.clearAuth();
      return null;
    }
  },

  async logout(): Promise<void> {
    const refreshToken = localStorage.getItem(REFRESH_KEY);
    if (refreshToken) {
      try { await api.post('/auth/logout', { refreshToken }); } catch { }
    }
    this.clearAuth();
  },

  async logoutAll(): Promise<void> {
    try { await api.post('/auth/logout-all'); } catch { }
    this.clearAuth();
  },

  getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  },

  getRefreshToken(): string | null {
    return localStorage.getItem(REFRESH_KEY);
  },

  getUser(): UserInfo | null {
    const user = localStorage.getItem(USER_KEY);
    return user ? JSON.parse(user) : null;
  },

  isAuthenticated(): boolean {
    return !!this.getToken();
  },

  persistAuth(response: AuthResponse): void {
    localStorage.setItem(TOKEN_KEY, response.accessToken);
    localStorage.setItem(REFRESH_KEY, response.refreshToken);
    localStorage.setItem(USER_KEY, JSON.stringify(response.user));
  },

  clearAuth(): void {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(REFRESH_KEY);
    localStorage.removeItem(USER_KEY);
  },
};
