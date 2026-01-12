import { createFileRoute, useRouter, Link } from "@tanstack/react-router";
import { useState } from "react";
import apiClient from "../../../services/apiClient";
import { authStore } from "../../store/authStore";

export const Route = createFileRoute("/(auth)/signup")({
  component: RouteComponent,
});

function RouteComponent() {
  const router = useRouter();
  const isLoggedInZustand = authStore((state) => state.isLoggedIn);
  const loginUserZustand = authStore((state) => state.loginUser);

  const [email, setEmail] = useState("");
  const [fullname, setFullname] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [profileImage, setProfileImage] = useState(null);

  const [data, setData] = useState(null);
  const [showAlert, setShowAlert] = useState(true);
  const [isSigningIn, setIsSigningIn] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSigningIn(true);
    setShowAlert(true);

    const formData = new FormData();
    formData.append("email", email);
    formData.append("username", username);
    formData.append("fullname", fullname);
    formData.append("password", password);
    formData.append("profileImage", profileImage);

    try {
      const signupUser = await apiClient.signup(formData);
      setData(signupUser);

      if (signupUser.success) {
        let userId = signupUser.data._id;
        let userAvatorURl = signupUser.data.avatar?.url;
        loginUserZustand(userId, userAvatorURl);
        setTimeout(() => {
          router.navigate({ to: "/home" });
        }, 1500);
      }
    } catch (error) {
      setData({
        success: false,
        message: "Signup failed. Please try again.",
      });
    }

    setIsSigningIn(false);
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-zinc-900 via-black to-zinc-900 flex items-center justify-center px-4">
      <div className="w-full max-w-lg rounded-2xl bg-zinc-900/80 backdrop-blur border border-zinc-800 shadow-2xl p-8">
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-white">GigFlow</h1>
          <p className="text-sm text-zinc-400 mt-1">
            Create your account to start managing gigs
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
        <form
          onSubmit={handleSubmit}
          encType="multipart/form-data"
          className="space-y-4"
        >
          <div>
            <label className="block text-sm text-zinc-400 mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full rounded-lg bg-zinc-800 border border-zinc-700 px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-zinc-400 mb-1">
                Username
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="w-full rounded-lg bg-zinc-800 border border-zinc-700 px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-sm text-zinc-400 mb-1">
                Full Name
              </label>
              <input
                type="text"
                value={fullname}
                onChange={(e) => setFullname(e.target.value)}
                required
                className="w-full rounded-lg bg-zinc-800 border border-zinc-700 px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm text-zinc-400 mb-1">
              Profile Image
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setProfileImage(e.target.files[0])}
              className="w-full text-sm text-zinc-300 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-zinc-800 file:text-zinc-300 hover:file:bg-zinc-700"
            />
          </div>

          <div>
            <label className="block text-sm text-zinc-400 mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full rounded-lg bg-zinc-800 border border-zinc-700 px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <button
            type="submit"
            disabled={isSigningIn}
            className="w-full mt-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 transition text-white font-medium py-2 disabled:opacity-60"
          >
            {isSigningIn ? "Creating account..." : "Sign Up"}
          </button>
        </form>

        {/* Footer */}
        <p className="text-center text-sm text-zinc-400 mt-6">
          Already have an account?{" "}
          <Link to="/login" className="text-indigo-400 hover:underline">
            Log In
          </Link>
        </p>
      </div>
    </div>
  );
}
