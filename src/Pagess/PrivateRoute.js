import { Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getCurrentUser } from "../api/auth";

export default function PrivateRoute({ children }) {
  const [loading, setLoading] = useState(true);
  const [isAuth, setIsAuth] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token =
          localStorage.getItem("authToken") ||
          sessionStorage.getItem("authToken");

        if (!token) {
          setIsAuth(false);
          setLoading(false);
          return;
        }

        // ✅ validate token against backend
        const result = await getCurrentUser(token);

        if (result.success) {
          setIsAuth(true);
        } else {
          setIsAuth(false);
          localStorage.removeItem("authToken");
          sessionStorage.removeItem("authToken");
        }
      } catch (err) {
        console.error("Auth check failed:", err);
        setIsAuth(false);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-gray-600">Checking authentication...</p>
      </div>
    );
  }

  return isAuth ? children : <Navigate to="/login" replace />;
}
