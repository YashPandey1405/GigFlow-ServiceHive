import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import apiClient from "../../../services/apiClient";

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
      <nav className="flex items-center justify-between px-6 py-4 border-b border-zinc-800 bg-zinc-900/80 backdrop-blur">
        <h1 className="text-xl font-bold">GigFlow</h1>

        <div className="flex items-center gap-4">
          {/* Profile Avatar */}
          <Link to="/profile">
            <img
              src="https://via.placeholder.com/40"
              alt="User"
              className="w-10 h-10 rounded-full border border-zinc-700 hover:border-indigo-500 transition"
            />
          </Link>

          {/* Logout Button */}
          <Link to="/logout">
            <button className="rounded-lg bg-red-600 hover:bg-red-700 transition px-4 py-2 text-sm font-medium text-white">
              Logout
            </button>
          </Link>
        </div>
      </nav>

      <main className="max-w-5xl mx-auto px-6 py-10">
        <h2 className="text-4xl font-bold text-center mb-10">Available Gigs</h2>

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
            {gigs.map((gig) => (
              <div
                key={gig._id}
                className="rounded-2xl bg-zinc-900/70 border border-zinc-800 p-6 hover:border-indigo-500 transition"
              >
                <h3 className="text-xl font-semibold mb-3">{gig.title}</h3>

                <p className="text-sm text-zinc-400 mb-6">{gig.description}</p>

                <div className="flex items-center justify-between mb-6">
                  <span className="text-indigo-400 font-semibold text-lg">
                    ₹ {gig.budget}
                  </span>

                  <span className="text-xs text-zinc-500">
                    {new Date(gig.createdAt).toLocaleDateString()}
                  </span>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3">
                  <Link
                    to="/home/gig/$gigId"
                    params={{ gigId: gig._id }}
                    className="flex-1 text-center rounded-lg bg-indigo-600 hover:bg-indigo-700 transition py-2 text-sm font-medium"
                  >
                    View
                  </Link>

                  {/* <Link to="/home/gig/edit/$gigId" params={{ gigId: gig._id }}>
                    Edit
                  </Link> */}

                  <button
                    onClick={() => handleDelete(gig._id)}
                    className="flex-1 text-center rounded-lg bg-zinc-700 hover:bg-zinc-600 transition py-2 text-sm font-medium"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(gig._id)}
                    className="flex-1 rounded-lg bg-red-600/80 hover:bg-red-600 transition py-2 text-sm font-medium"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
