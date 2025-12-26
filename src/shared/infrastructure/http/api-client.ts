import axios from 'axios';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: true,
});

// Interceptor to handle API errors globally
// apiClient.interceptors.response.use(
//   (response) => response,
//   (error) => {
//     console.log(error)
//     // You can add logic here to handle 401 Unauthorized errors,
//     // like redirecting to the login page.
//     const message = error.response?.data?.message || 'An unknown error occurred';
//     return Promise.reject(new Error(message));
//   }
// );

export default apiClient;