import axios from 'axios';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: true,
});

// Interceptor to handle API errors globally
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.data) {
      // 1. Check if the error comes from the backend (has a response & data)
      const apiErrorMessage = error.response.data.message;
      // console.error(error)
      // 2. Reject with a standard JS Error containing ONLY that message
      return Promise.reject(new Error(apiErrorMessage));
    }

    // 3. Fallback for network errors (no response from server)
    return Promise.reject(new Error(error.message || 'An unexpected network error occurred'));
  }
);

export default apiClient;