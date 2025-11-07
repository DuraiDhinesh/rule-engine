import { useState } from "react";
import { forgotPassword } from "../auth";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await forgotPassword(email);
    if (result.success) setSubmitted(true);
    else setError(result.error);
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <form className="bg-white p-6 rounded shadow-md" onSubmit={handleSubmit}>
        <h1 className="text-xl font-bold mb-4">Forgot Password</h1>
        {error && <p className="text-red-500">{error}</p>}
        {submitted ? (
          <p className="text-green-500">
            Password reset instructions sent to your email.
          </p>
        ) : (
          <>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2 border rounded mb-4"
            />
            <button className="bg-blue-600 text-white px-4 py-2 rounded">
              Submit
            </button>
          </>
        )}
      </form>
    </div>
  );
}
