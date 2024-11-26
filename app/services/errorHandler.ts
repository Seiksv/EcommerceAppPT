import axios, { AxiosError } from 'axios';
import { Alert } from 'react-native';

export interface ApiError {
  message: string;
  status?: number;
}

export const handleApiError = (error: unknown): ApiError => {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError;
    
    if (axiosError.response) {
      switch (axiosError.response.status) {
        case 400:
          return { 
            message: 'Bad Request. Please check your input.', 
            status: 400 
          };
        case 401:
          return { 
            message: 'Unauthorized. Please log in again.', 
            status: 401 
 
          };
        case 403:
          return { 
            message: 'Forbidden. You do not have permission.', 
            status: 403 
          };
        case 404:
          return { 
            message: 'Resource not found.', 
            status: 404 
          };
        case 500:
          return { 
            message: 'Server error. Please try again later.', 
            status: 500 
          };
        default:
          return { 
            message: 'An unexpected error occurred.', 
            status: axiosError.response.status 
          };
      }
    } else if (axiosError.request) {
      return { 
        message: 'No response from server. Check your internet connection.', 
        status: 0 
      };
    } else {
      return { 
        message: 'Error setting up the request.', 
        status: undefined 
      };
    }
  }

  return { 
    message: error instanceof Error ? error.message : 'An unknown error occurred', 
    status: undefined 
  };
};

export const showErrorAlert = (error: ApiError) => {
  Alert.alert(
    'Error',
    error.message,
    [{ text: 'OK', style: 'cancel' }]
  );
};