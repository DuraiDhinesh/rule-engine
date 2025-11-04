import axios from "axios";

// Centralized Axios instance
const apiClient = axios.create({
  baseURL: "http://localhost:4000", // your backend root
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // include cookies if needed
});

export default apiClient;
