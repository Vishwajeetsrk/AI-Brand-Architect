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

export interface AuthResponse {
  accessToken: string;
  user: {
    id: string;
    email: string;
    name: string;
    role: string;
  };
}

export const authService = {
  async login(data: LoginDto): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>('/auth/login', data);
    localStorage.setItem('nexora_token', response.accessToken);
    localStorage.setItem('nexora_user', JSON.stringify(response.user));
    return response;
  },

  async register(data: RegisterDto): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>('/auth/register', data);
    localStorage.setItem('nexora_token', response.accessToken);
    localStorage.setItem('nexora_user', JSON.stringify(response.user));
    return response;
  },

  async logout(): Promise<void> {
    try { await api.post('/auth/logout'); } catch {}
    localStorage.removeItem('nexora_token');
    localStorage.removeItem('nexora_user');
  },

  getToken(): string | null {
    return localStorage.getItem('nexora_token');
  },

  getUser(): AuthResponse['user'] | null {
    const user = localStorage.getItem('nexora_user');
    return user ? JSON.parse(user) : null;
  },

  isAuthenticated(): boolean {
    return !!this.getToken();
  },
};
