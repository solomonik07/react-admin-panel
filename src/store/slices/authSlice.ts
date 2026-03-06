import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { authService } from '../../services/authService';
import { LoginCredentials, AuthState } from '../../types/auth.types';

const getInitialToken = (): string | null => {
  return localStorage.getItem('token') || sessionStorage.getItem('token');
};

const initialState: AuthState = {
  token: getInitialToken(),
  isLoading: false,
  error: null,
};

export const login = createAsyncThunk(
  'auth/login',
  async ({ credentials, rememberMe }: { credentials: LoginCredentials; rememberMe: boolean }) => {
    const response = await authService.login(credentials);
    console.log('Login response:', response);

    const token = response.accessToken;
    console.log('Token to save:', token);

    authService.saveToken(token, rememberMe);
    return token;
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.token = null;
      state.error = null;
      authService.removeToken();
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isLoading = false;
        state.token = action.payload;
        console.log('State updated with token:', action.payload);
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Ошибка авторизации';
        console.log('Login rejected:', action.error);
      });
  },
});

export const { logout, clearError } = authSlice.actions;
export default authSlice.reducer;