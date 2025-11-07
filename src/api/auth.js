import apiClient from "./apiClient";

// ✅ Register
export const register = async ({ username, email, password }) => {
  try {
    const response = await apiClient.post("/auth/register", {
      username,
      email,
      password,
    });
    return { success: true, data: response.data };
  } catch (error) {
    return { success: false, error: error.response?.data || error.message };
  }
};

// ✅ Login
export const login = async ({ email, password }) => {
  try {
    const response = await apiClient.post("/auth/login", { email, password });
    return { success: true, data: response.data };
  } catch (error) {
    return { success: false, error: error.response?.data || error.message };
  }
};

// ✅ Get current user
export const getCurrentUser = async (token) => {
  try {
    const response = await apiClient.get("/auth/me", {
      headers: { Authorization: `Bearer ${token}` },
    });
    return { success: true, data: response.data };
  } catch (error) {
    return { success: false, error: error.response?.data || error.message };
  }
};
