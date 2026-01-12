import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import apiClient from "../../../services/apiClient";
import { authStore } from "../../store/authStore";
import Navbar from "../../../Components/Navbar.jsx";

export const Route = createFileRoute("/(auth)/profile")({
  component: RouteComponent,
});

function RouteComponent() {
  const isLoggedIn = authStore((state) => state.isLoggedIn);
  const loggedInUserId = authStore((state) => state.loggedInUserId);

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isLoggedIn || !loggedInUserId) return;

    const fetchUser = async () => {
      try {
        const response = await apiClient.getCurrentUser(loggedInUserId);
        if (response?.success) {
          setProfile(response.data);
        }
      } catch (error) {
        console.error("Failed to fetch user", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [isLoggedIn, loggedInUserId]);

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-gradient-to-br from-zinc-900 via-black to-zinc-900 flex items-center justify-center text-zinc-400">
          Loading profile...
        </div>
      </>
    );
  }

  if (!profile) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-gradient-to-br from-zinc-900 via-black to-zinc-900 flex items-center justify-center text-red-400">
          Failed to load profile
        </div>
      </>
    );
  }

  const { user, totalGigs, totalBids } = profile;

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-900 via-black to-zinc-900 text-white">
      <Navbar />

      <main className="max-w-5xl mx-auto px-6 py-10">
        {/* Profile Card */}
        <div className="rounded-2xl bg-zinc-900/70 backdrop-blur border border-zinc-800 p-8 mb-10">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
            {/* Avatar */}
            <img
              src={user.avatar?.url}
              alt="User Avatar"
              className="w-28 h-28 rounded-full border-2 border-indigo-500 object-cover"
            />

            {/* Info */}
            <div className="flex-1 text-center sm:text-left">
              <h2 className="text-3xl font-bold">{user.fullname}</h2>

              <p className="text-zinc-400 mt-1">@{user.username}</p>

              <p className="text-sm text-zinc-400 mt-3">{user.email}</p>

              {/* Email Verification */}
              <div className="mt-4">
                {user.isEmailVerified ? (
                  <span className="inline-flex items-center gap-2 text-green-400 text-sm bg-green-500/10 border border-green-500/30 px-3 py-1 rounded-full">
                    ✔ Email Verified
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-2 text-yellow-400 text-sm bg-yellow-500/10 border border-yellow-500/30 px-3 py-1 rounded-full">
                    ⚠ Email Not Verified
                  </span>
                )}
              </div>
            </div>

            {/* Joined Date */}
            <div className="text-sm text-zinc-500">
              Joined on <br />
              {new Date(user.createdAt).toLocaleDateString()}
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="rounded-xl bg-zinc-900/70 border border-zinc-800 p-6 text-center">
            <p className="text-zinc-400 text-sm mb-1">Total Gigs Posted</p>
            <h3 className="text-4xl font-bold text-indigo-400">{totalGigs}</h3>
          </div>

          <div className="rounded-xl bg-zinc-900/70 border border-zinc-800 p-6 text-center">
            <p className="text-zinc-400 text-sm mb-1">Total Bids Placed</p>
            <h3 className="text-4xl font-bold text-green-400">{totalBids}</h3>
          </div>
        </div>
      </main>
    </div>
  );
}
