import { createFileRoute, useRouter, Link } from "@tanstack/react-router";
import { useState } from "react";
import apiClient from "../../../services/apiClient";
import { authStore } from "../../store/authStore";

export const Route = createFileRoute("/(auth)/login")({
  component: RouteComponent,
});

function RouteComponent() {
  const router = useRouter();
  const isLoggedInZustand = authStore((state) => state.isLoggedIn);
  const loginUserZustand = authStore((state) => state.loginUser);

  const [formData, setFormData] = useState({
    email: "",
    username: "",
    password: "",
  });
  const [data, setData] = useState(null);
  const [showAlert, setShowAlert] = useState(true);
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoggingIn(true);
    setShowAlert(true);

    try {
      const loginUser = await apiClient.login(
        formData.email,
        formData.username,
        formData.password
      );
      setData(loginUser);

      if (loginUser.success) {
        let userId = loginUser.data._id;
        let userAvatorURl = loginUser.data.avatar?.url;
        loginUserZustand(userId, userAvatorURl);

        setTimeout(() => {
          router.navigate({ to: "/home" });
        }, 1500);
      }
    } catch (error) {
      setData({
        success: false,
        message: "Login failed. Please try again.",
      });
    }

    setIsLoggingIn(false);
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-zinc-900 via-black to-zinc-900 flex items-center justify-center px-4">
      <div className="w-full max-w-md rounded-2xl bg-zinc-900/80 backdrop-blur border border-zinc-800 shadow-2xl p-8">
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-white">GigFlow</h1>
          <p className="text-sm text-zinc-400 mt-1">
            Log in to manage your gigs seamlessly
          </p>
        </div>

        {/* Alert */}
        {data && showAlert && (
          <div
            className={`mb-4 rounded-lg px-4 py-3 text-sm flex justify-between items-center ${
              data.success
                ? "bg-green-500/10 text-green-400 border border-green-500/30"
                : "bg-red-500/10 text-red-400 border border-red-500/30"
            }`}
          >
            <span>{data.message}</span>
            <button
              onClick={() => setShowAlert(false)}
              className="text-lg leading-none"
            >
              ×
            </button>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm text-zinc-400 mb-1">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              autoComplete="email"
              className="w-full rounded-lg bg-zinc-800 border border-zinc-700 px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-sm text-zinc-400 mb-1">Username</label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
              autoComplete="username"
              className="w-full rounded-lg bg-zinc-800 border border-zinc-700 px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-sm text-zinc-400 mb-1">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              autoComplete="current-password"
              className="w-full rounded-lg bg-zinc-800 border border-zinc-700 px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <button
            type="submit"
            disabled={isLoggingIn}
            className="w-full mt-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 transition text-white font-medium py-2 disabled:opacity-60"
          >
            {isLoggingIn ? "Logging in..." : "Login"}
          </button>
        </form>

        {/* Footer */}
        <p className="text-center text-sm text-zinc-400 mt-6">
          Don’t have an account?{" "}
          <Link to="/signup" className="text-indigo-400 hover:underline">
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
}
