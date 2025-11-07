import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { login } from "../api/auth";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await login({ email, password });

    if (result.success) {
      sessionStorage.setItem("authToken", result.data.token);
      if (remember) localStorage.setItem("authToken", result.data.token);
      navigate("/home");
    } else {
      alert("Invalid credentials");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-500 to-blue-700 flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-8">
        {/* Logo */}
        <div className="flex justify-center mb-6">
          <div className="bg-blue-100 rounded-full p-4">
            <svg xmlns="http://www.w3.org/2000/svg"
              className="h-8 w-8 text-blue-600"
              fill="none" viewBox="0 0 24 24"
              stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 11a4 4 0 100-8 4 4 0 000 8z"/>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 21v-2a6 6 0 0112 0v2"/>
            </svg>
          </div>
        </div>

        <h2 className="text-2xl font-semibold text-center text-gray-900 mb-2">
          Admin Portal
        </h2>
        <p className="text-center text-gray-600 mb-6">
          Please sign in to access the dashboard
        </p>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Email Address
            </label>
            <input type="email" value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@demo.com"
              className="mt-1 block w-full rounded-md border px-3 py-2 shadow-sm"
              required />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input type="password" value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              className="mt-1 block w-full rounded-md border px-3 py-2 shadow-sm"
              required />
          </div>

          {/* Remember Me + Forgot */}
          <div className="flex items-center justify-between">
            <label className="flex items-center text-sm text-gray-600">
              <input type="checkbox" checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
                className="mr-2 h-4 w-4 text-indigo-600 border-gray-300 rounded" />
              Remember me
            </label>
            <Link to="/forgotpassword" className="text-sm text-indigo-600 hover:underline">
              Forgot password?
            </Link>
          </div>

          {/* Submit */}
          <button type="submit"
            className="w-full flex justify-center items-center rounded-md bg-blue-600 px-4 py-2 text-white font-medium hover:bg-blue-700">
            Sign In
            <svg xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 ml-2" fill="none"
              viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7"/>
            </svg>
          </button>

          {/* Signup link */}
          <div className="mt-6 text-center">
            <Link to="/signup" className="text-sm text-indigo-600 hover:underline">
              Don't have an account? Sign up
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
