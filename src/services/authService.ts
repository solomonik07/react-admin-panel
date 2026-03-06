import axios from 'axios';
import { LoginCredentials, AuthResponse } from '../types/auth.types';

const API_BASE_URL = 'https://dummyjson.com';

export const authService = {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      const response = await axios.post(`${API_BASE_URL}/auth/login`, {
        username: credentials.username,
        password: credentials.password,
        expiresInMins: 60,
      });

      console.log('API Response:', response.data);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw new Error(error.response.data.message || 'Неверный логин или пароль');
      }
      throw new Error('Ошибка соединения с сервером');
    }
  },

  saveToken(token: string, rememberMe: boolean): void {
    if (rememberMe) {
      localStorage.setItem('token', token);
    } else {
      sessionStorage.setItem('token', token);
    }
  },

  getToken(): string | null {
    return localStorage.getItem('token') || sessionStorage.getItem('token');
  },

  removeToken(): void {
    localStorage.removeItem('token');
    sessionStorage.removeItem('token');
  },

  isAuthenticated(): boolean {
    return !!this.getToken();
  },
};