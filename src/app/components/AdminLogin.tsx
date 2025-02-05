"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { FaEnvelope, FaLock, FaEye, FaEyeSlash } from "react-icons/fa";

const LoginPage = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  const [passwordVisible, setPasswordVisible] = useState<boolean>(false);
  const router = useRouter();

  useEffect(() => {
    if (localStorage.getItem("isLoggedIn") === "true") {
      router.push("/admin");
    }
  }, [router]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const adminEmail = process.env.NEXT_PUBLIC_EMAIL_ADDRESS;
    const adminPassword = process.env.NEXT_PUBLIC_USER_PASSWORD;

    if (email === adminEmail && password === adminPassword) {
      setMessage("Login successful");
      localStorage.setItem("isLoggedIn", "true");
      router.push("/admin/dashboard");
    } else {
      setMessage("Invalid email or password");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-sky-400 to-pink-400">
      <div className="w-full max-w-md p-8 bg-white/10 backdrop-blur-lg shadow-xl rounded-xl">
        <h2 className="text-2xl font-bold text-white text-center mb-6">Admin Login</h2>

        {message && (
          <div className={`mb-4 p-3 text-center text-sm font-semibold rounded-md ${
            message.includes("Invalid") ? "bg-red-600 text-white" : "bg-green-500 text-white"
          }`}>
            {message}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-white text-sm font-medium">Email</label>
            <div className="relative mt-1">
              <input
                type="email"
                id="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full p-3 pl-10 bg-gray-800 text-white rounded-lg border border-gray-600 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
              <FaEnvelope className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            </div>
          </div>

          <div>
            <label htmlFor="password" className="block text-white text-sm font-medium">Password</label>
            <div className="relative mt-1">
              <input
                type={passwordVisible ? "text" : "password"}
                id="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full p-3 pl-10 bg-gray-800 text-white rounded-lg border border-gray-600 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
              <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <button
                type="button"
                onClick={() => setPasswordVisible(!passwordVisible)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-200"
              >
                {passwordVisible ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-blue-500 text-white rounded-lg font-semibold text-lg hover:bg-blue-600 transition duration-300"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
