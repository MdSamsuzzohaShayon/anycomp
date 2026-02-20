import axios, { AxiosError } from "axios";

// Base API configuration
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';
const FIVE_MINUTE =  5 * 60 * 1000;
// Create axios instance with default config
const apiClient = axios.create({
    baseURL: API_BASE_URL,
    timeout: FIVE_MINUTE,
});


// Request interceptor for adding auth token
apiClient.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor for centralized error handling
apiClient.interceptors.response.use(
    (response) => response,
    (error: AxiosError) => {
        console.error("RAW AXIOS ERROR:", error);
        return Promise.reject(handleApiError(error));
    }
);

// Centralized error handler
export interface ApiError {
    message: string;
    status?: number;
    code?: string;
    details?: any;
}

export function handleApiError(error: AxiosError): ApiError {
    if (error.response) {
        // Server responded with error status
        const status = error.response.status;
        const data = error.response.data as any;

        switch (status) {
            case 400:
                return {
                    message: data?.message || 'Invalid request. Please check your input.',
                    status,
                    code: 'BAD_REQUEST',
                    details: data,
                };
            case 401:
                return {
                    message: 'Authentication required. Please log in.',
                    status,
                    code: 'UNAUTHORIZED',
                };
            case 403:
                return {
                    message: 'You do not have permission to perform this action.',
                    status,
                    code: 'FORBIDDEN',
                };
            case 404:
                return {
                    message: data?.message || 'Resource not found.',
                    status,
                    code: 'NOT_FOUND',
                };
            case 409:
                return {
                    message: data?.message || 'Conflict. Resource already exists.',
                    status,
                    code: 'CONFLICT',
                    details: data,
                };
            case 422:
                return {
                    message: data?.message || 'Validation error. Please check your input.',
                    status,
                    code: 'VALIDATION_ERROR',
                    details: data,
                };
            case 500:
                return {
                    message: 'Server error. Please try again later.',
                    status,
                    code: 'SERVER_ERROR',
                };
            default:
                return {
                    message: data?.message || 'An unexpected error occurred.',
                    status,
                    code: 'UNKNOWN_ERROR',
                };
        }
    } else if (error.request) {
        // Request made but no response
        return {
            message: 'Network error. Please check your connection.',
            code: 'NETWORK_ERROR',
        };
    } else {
        // Error in request setup
        return {
            message: error.message || 'An unexpected error occurred.',
            code: 'REQUEST_ERROR',
        };
    }
}




export default apiClient;


