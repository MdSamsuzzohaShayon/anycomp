'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { AuthApiService, LoginRequest, RegisterRequest } from '../api/auth.api';
import { ApiError } from '../api/apiClient';

export const useAuth = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const login = useCallback(async (data: LoginRequest) => {
    try {
      setIsLoading(true);
      const response = await AuthApiService.login(data);
      
      // Store token in localStorage (consider using httpOnly cookies for production)
      localStorage.setItem('token', response.token);
      localStorage.setItem('user', JSON.stringify(response.user));
      
      // Redirect to dashboard
      router.push('/specialists');
      
      return { success: true, data: response };
    } catch (err) {
      const apiError = err as ApiError;
      return { success: false, error: apiError.message };
    } finally {
      setIsLoading(false);
    }
  }, [router]);

  const register = useCallback(async (data: RegisterRequest) => {
    try {
      setIsLoading(true);
      const response = await AuthApiService.register(data);
      
      // Auto login after registration
      // localStorage.setItem('token', response.token);
      // localStorage.setItem('user', JSON.stringify(response.user));
      
      // Redirect to dashboard
      router.push('/login');
      
      return { success: true, data: response };
    } catch (err) {
      const apiError = err as ApiError;
      return { success: false, error: apiError.message };
    } finally {
      setIsLoading(false);
    }
  }, [router]);

  const forgotPassword = useCallback(async (email: string) => {
    try {
      setIsLoading(true);
      const response = await AuthApiService.forgotPassword({ email });
      return { success: true, data: response };
    } catch (err) {
      const apiError = err as ApiError;
      return { success: false, error: apiError.message };
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    router.push('/login');
  }, [router]);

  return {
    login,
    register,
    forgotPassword,
    logout,
    isLoading,
  };
};