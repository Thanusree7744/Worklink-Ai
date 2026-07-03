/**
 * Custom Hooks for API Calls
 * Provides reusable hooks for common API operations
 */

import { useState, useCallback } from 'react';
import { apiClient, ApiError } from '../services/api';

export interface UseApiState<T> {
  data: T | null;
  isLoading: boolean;
  error: ApiError | null;
}

export interface UseApiOptions {
  onSuccess?: (data: unknown) => void;
  onError?: (error: ApiError) => void;
}

/**
 * Hook for making GET requests
 */
export const useApi = <T,>(endpoint: string, immediate = false) => {
  const [state, setState] = useState<UseApiState<T>>({
    data: null,
    isLoading: immediate,
    error: null,
  });

  const execute = useCallback(async () => {
    setState({ data: null, isLoading: true, error: null });
    try {
      const data = await apiClient.get<T>(endpoint);
      setState({ data, isLoading: false, error: null });
      return data;
    } catch (err) {
      const error = err as ApiError;
      setState({ data: null, isLoading: false, error });
      throw error;
    }
  }, [endpoint]);

  // Auto-fetch if immediate is true
  if (immediate && !state.data && !state.isLoading && !state.error) {
    execute();
  }

  return { ...state, execute, refetch: execute };
};

/**
 * Hook for making POST requests
 */
export const usePost = <T,>(
  endpoint: string,
  options?: UseApiOptions
) => {
  const [state, setState] = useState<UseApiState<T>>({
    data: null,
    isLoading: false,
    error: null,
  });

  const execute = useCallback(
    async (payload?: Record<string, unknown>) => {
      setState({ data: null, isLoading: true, error: null });
      try {
        const data = await apiClient.post<T>(endpoint, payload);
        setState({ data, isLoading: false, error: null });
        options?.onSuccess?.(data);
        return data;
      } catch (err) {
        const error = err as ApiError;
        setState({ data: null, isLoading: false, error });
        options?.onError?.(error);
        throw error;
      }
    },
    [endpoint, options]
  );

  return { ...state, execute };
};

/**
 * Hook for making PUT requests
 */
export const usePut = <T,>(
  endpoint: string,
  options?: UseApiOptions
) => {
  const [state, setState] = useState<UseApiState<T>>({
    data: null,
    isLoading: false,
    error: null,
  });

  const execute = useCallback(
    async (payload?: Record<string, unknown>) => {
      setState({ data: null, isLoading: true, error: null });
      try {
        const data = await apiClient.put<T>(endpoint, payload);
        setState({ data, isLoading: false, error: null });
        options?.onSuccess?.(data);
        return data;
      } catch (err) {
        const error = err as ApiError;
        setState({ data: null, isLoading: false, error });
        options?.onError?.(error);
        throw error;
      }
    },
    [endpoint, options]
  );

  return { ...state, execute };
};

/**
 * Hook for making DELETE requests
 */
export const useDelete = <T,>(
  endpoint: string,
  options?: UseApiOptions
) => {
  const [state, setState] = useState<UseApiState<T>>({
    data: null,
    isLoading: false,
    error: null,
  });

  const execute = useCallback(async () => {
    setState({ data: null, isLoading: true, error: null });
    try {
      const data = await apiClient.delete<T>(endpoint);
      setState({ data, isLoading: false, error: null });
      options?.onSuccess?.(data);
      return data;
    } catch (err) {
      const error = err as ApiError;
      setState({ data: null, isLoading: false, error });
      options?.onError?.(error);
      throw error;
    }
  }, [endpoint, options]);

  return { ...state, execute };
};

/**
 * Hook for resource list fetching with pagination
 */
export interface ListResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
}

export const useList = <T,>(
  endpoint: string,
  pageSize: number = 20
) => {
  const [page, setPage] = useState(1);
  const [state, setState] = useState<UseApiState<ListResponse<T>>>({
    data: null,
    isLoading: false,
    error: null,
  });

  const execute = useCallback(async (pageNum: number = page) => {
    setState({ data: null, isLoading: true, error: null });
    try {
      const data = await apiClient.get<ListResponse<T>>(
        `${endpoint}?page=${pageNum}&pageSize=${pageSize}`
      );
      setState({ data, isLoading: false, error: null });
      setPage(pageNum);
      return data;
    } catch (err) {
      const error = err as ApiError;
      setState({ data: null, isLoading: false, error });
      throw error;
    }
  }, [endpoint, page, pageSize]);

  const nextPage = () => execute(page + 1);
  const prevPage = () => execute(Math.max(1, page - 1));

  return {
    ...state,
    page,
    execute,
    nextPage,
    prevPage,
    goToPage: (pageNum: number) => execute(pageNum),
  };
};
