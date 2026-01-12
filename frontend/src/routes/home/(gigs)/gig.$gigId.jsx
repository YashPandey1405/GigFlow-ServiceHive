import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import apiClient from "../../../../services/apiClient";

export const Route = createFileRoute("/home/(gigs)/gig/$gigId")({
  component: RouteComponent,
});

function RouteComponent() {
  const { gigId } = Route.useParams();

  const [gigData, setGigData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchGigByID = async () => {
      try {
        const response = await apiClient.getGigByID(gigId);

        if (response?.success) {
          setGigData(response.data);
          setMessage(response.message || "");
        } else {
          setError(true);
          setMessage(response?.message || "Failed to fetch gig.");
        }
      } catch (err) {
        setError(true);
        setMessage("Server is not reachable. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchGigByID();
  }, [gigId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-linear-to-br from-zinc-900 via-black to-zinc-900 text-zinc-400 flex items-center justify-center">
        Fetching gig details...
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-linear-to-br from-zinc-900 via-black to-zinc-900 flex items-center justify-center">
        <div className="bg-red-500/10 text-red-400 border border-red-500/30 px-6 py-4 rounded-lg">
          {message}
        </div>
      </div>
    );
  }

  const { gig, bids, totalBids } = gigData;

  return (
    <div className="min-h-screen bg-linear-to-br from-zinc-900 via-black to-zinc-900 text-white">
      {/* Navbar */}
      <nav className="flex items-center justify-between px-6 py-4 border-b border-zinc-800 bg-zinc-900/80 backdrop-blur">
        <Link to="/home" className="text-xl font-bold">
          GigFlow
        </Link>

        <Link to="/profile" className="flex items-center gap-3">
          <span className="text-sm text-zinc-300">Profile</span>
          <img
            src="https://via.placeholder.com/40"
            alt="User"
            className="w-10 h-10 rounded-full border border-zinc-700"
          />
        </Link>
      </nav>

      {/* Main */}
      <main className="max-w-5xl mx-auto px-6 py-10 space-y-10">
        {/* Gig Details */}
        <section className="rounded-2xl bg-zinc-900/70 border border-zinc-800 p-8">
          <h1 className="text-3xl font-bold mb-4">{gig.title}</h1>

          <p className="text-zinc-400 mb-6">{gig.description}</p>

          <div className="flex flex-wrap gap-6 text-sm">
            <div>
              <span className="text-zinc-500">Budget</span>
              <p className="text-indigo-400 font-semibold text-lg">
                ₹ {gig.budget}
              </p>
            </div>

            <div>
              <span className="text-zinc-500">Posted On</span>
              <p className="text-zinc-300">
                {new Date(gig.createdAt).toLocaleDateString()}
              </p>
            </div>

            <div>
              <span className="text-zinc-500">Total Bids</span>
              <p className="text-zinc-300">{totalBids}</p>
            </div>
          </div>
        </section>

        {/* Bids Section */}
        <section>
          <h2 className="text-2xl font-semibold mb-6">Freelancer Bids</h2>

          {bids.length === 0 && (
            <div className="text-zinc-400 bg-zinc-900/50 border border-zinc-800 rounded-lg p-6 text-center">
              No bids have been placed yet.
            </div>
          )}

          <div className="space-y-6">
            {bids.map((bid) => (
              <div
                key={bid._id}
                className="rounded-2xl bg-zinc-900/70 border border-zinc-800 p-6 flex gap-6"
              >
                {/* Avatar */}
                <img
                  src={
                    bid.freelancerId.avatar?.url ||
                    "https://via.placeholder.com/80"
                  }
                  alt="Freelancer"
                  className="w-16 h-16 rounded-full border border-zinc-700 object-cover"
                />

                {/* Content */}
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <h3 className="font-semibold">
                        {bid.freelancerId.fullname}
                      </h3>
                      <p className="text-xs text-zinc-400">
                        @{bid.freelancerId.username}
                      </p>
                    </div>

                    {/* Status Badge */}
                    <span
                      className={`text-xs px-3 py-1 rounded-full border ${
                        bid.status === "hired"
                          ? "bg-green-500/10 text-green-400 border-green-500/30"
                          : "bg-yellow-500/10 text-yellow-400 border-yellow-500/30"
                      }`}
                    >
                      {bid.status}
                    </span>
                  </div>

                  <p className="text-sm text-zinc-400 mb-3">{bid.message}</p>

                  <span className="text-xs text-zinc-500">
                    Bid placed on {new Date(bid.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
