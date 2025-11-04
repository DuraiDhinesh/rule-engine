import apiClient from './apiClient';

// Login API call
export const login = async (username, password) => {
  const response = await apiClient.post('https://7843-2409-40f4-204c-c7c8-71c2-82fb-6f2d-fd0a.ngrok-free.app/login', { username, password });
  
  // Make sure response contains token
  if (response.status == 200) {
    // Store token and user data in sessionStorage
    sessionStorage.setItem('user', JSON.stringify(username));
  }

  return response.data;  // Return the data, but token is already set
};