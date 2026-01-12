import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import apiClient from "../../../services/apiClient";
import { authStore } from "../../store/authStore.js";
import Navbar from "../../../Components/Navbar.jsx";

export const Route = createFileRoute("/home/")({
  component: RouteComponent,
});

function RouteComponent() {
  const [gigs, setGigs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchGigs = async () => {
      try {
        const response = await apiClient.getAllGigs();

        if (response?.success) {
          setGigs(response.data || []);
          setMessage(response.message || "");
        } else {
          setError(true);
          setMessage(response?.message || "Failed to fetch gigs.");
        }
      } catch (err) {
        setError(true);
        setMessage("Server is not reachable. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchGigs();
  }, []);

  // 🔥 DELETE HANDLER
  const handleDelete = async (gigId) => {
    alert("This Will Be Done By Version-2");
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-zinc-900 via-black to-zinc-900 text-white">
      {/* Navbar */}
      <Navbar />

      <main className="max-w-5xl mx-auto px-6 py-10">
        <div className="relative mb-10 flex items-center justify-center">
          {/* Center Title */}
          <h2 className="text-4xl font-bold">Available Gigs</h2>

          {/* Right Action Button */}
          <div className="absolute right-0">
            <Link
              to="/home/gig/create"
              className="rounded-lg bg-indigo-600 hover:bg-indigo-700 transition px-5 py-2 text-sm font-medium"
            >
              + Post Gig
            </Link>
          </div>
        </div>

        {/* Loading */}
        {loading && (
          <div className="text-center py-20 text-zinc-400 text-lg">
            Fetching gigs from GigFlow...
          </div>
        )}

        {/* Error / Empty */}
        {!loading && (error || gigs.length === 0) && (
          <div
            className={`max-w-xl mx-auto rounded-lg px-4 py-3 text-sm border text-center ${
              error
                ? "bg-red-500/10 text-red-400 border-red-500/30"
                : "bg-yellow-500/10 text-yellow-400 border-yellow-500/30"
            }`}
          >
            {message || "No gigs available right now."}
          </div>
        )}

        {/* Gigs Grid */}
        {!loading && gigs.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {gigs.map((gig) => {
              const isAssigned = gig.status === "assigned";

              return (
                <div
                  key={gig._id}
                  className={`
            relative rounded-2xl p-6 transition
            bg-zinc-900/70 border
            ${
              isAssigned
                ? "border-green-500/40 shadow-green-500/10"
                : "border-indigo-500/30 hover:border-indigo-500"
            }
          `}
                >
                  {/* Status Badge */}
                  <span
                    className={`
              absolute top-4 right-4 text-xs font-medium px-3 py-1 rounded-full
              ${
                isAssigned
                  ? "bg-green-500/15 text-green-400 border border-green-500/30"
                  : "bg-indigo-500/15 text-indigo-400 border border-indigo-500/30"
              }
            `}
                  >
                    {isAssigned ? "✔ Assigned" : "● Open"}
                  </span>

                  {/* Title */}
                  <h3 className="text-xl font-semibold mb-3 pr-20">
                    {gig.title}
                  </h3>

                  {/* Description */}
                  <p className="text-sm text-zinc-400 mb-6">
                    {gig.description}
                  </p>

                  {/* Meta */}
                  <div className="flex items-center justify-between mb-6">
                    <span
                      className={`font-semibold text-lg ${
                        isAssigned ? "text-green-400" : "text-indigo-400"
                      }`}
                    >
                      ₹ {gig.budget}
                    </span>

                    <span className="text-xs text-zinc-500">
                      {new Date(gig.createdAt).toLocaleDateString()}
                    </span>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-3">
                    <Link
                      to="/home/gig/$gigId"
                      params={{ gigId: gig._id }}
                      className={`flex-1 text-center rounded-lg py-2 text-sm font-medium transition
                ${
                  isAssigned
                    ? "bg-green-600/80 hover:bg-green-600"
                    : "bg-indigo-600 hover:bg-indigo-700"
                }
              `}
                    >
                      View
                    </Link>

                    <Link
                      to="/home/gig/edit/$gigId"
                      params={{ gigId: gig._id }}
                      className="flex-1 text-center rounded-lg bg-zinc-700 hover:bg-zinc-600 transition py-2 text-sm font-medium"
                    >
                      Edit
                    </Link>

                    <button
                      onClick={() => handleDelete(gig._id)}
                      className="flex-1 rounded-lg bg-red-600/80 hover:bg-red-600 transition py-2 text-sm font-medium"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
