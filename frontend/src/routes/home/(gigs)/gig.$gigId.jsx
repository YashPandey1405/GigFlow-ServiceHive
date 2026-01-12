import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import apiClient from "../../../../services/apiClient";
import { authStore } from "../../../store/authStore";
import Navbar from "../../../../Components/Navbar";

export const Route = createFileRoute("/home/(gigs)/gig/$gigId")({
  component: RouteComponent,
});

function RouteComponent() {
  const { gigId } = Route.useParams();
  const router = useRouter();

  const loggedInUserIdZudtand = authStore((state) => state.loggedInUserId);

  const [gigData, setGigData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isOwner, setIsOwner] = useState(false);
  const [error, setError] = useState(false);
  const [message, setMessage] = useState("");

  // 🔹 Fetch gig details
  useEffect(() => {
    const fetchGigByID = async () => {
      try {
        const response = await apiClient.getGigByID(gigId);

        if (response?.success) {
          setGigData(response.data);
          setMessage(response.message || "");

          const ownerId = response.data.gig.ownerId;
          setIsOwner(String(ownerId) === String(loggedInUserIdZudtand));
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
  }, [gigId, loggedInUserIdZudtand]);

  // 🔹 Accept Bid (Owner only)
  const handleAcceptBid = async (bidId) => {
    try {
      const response = await apiClient.selectBid(bidId);

      if (response?.success) {
        router.navigate({ to: "/home" });
      }
    } catch (err) {
      alert("Failed to accept bid. Please try again.");
    }
  };

  // 🔹 Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-zinc-900 via-black to-zinc-900 text-zinc-400 flex items-center justify-center">
        Fetching gig details...
      </div>
    );
  }

  // 🔹 Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-zinc-900 via-black to-zinc-900 flex items-center justify-center">
        <div className="bg-red-500/10 text-red-400 border border-red-500/30 px-6 py-4 rounded-lg">
          {message}
        </div>
      </div>
    );
  }

  const { gig, bids, totalBids } = gigData;

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-900 via-black to-zinc-900 text-white">
      <Navbar />

      <main className="max-w-5xl mx-auto px-6 py-10 space-y-10">
        {/* ================= GIG DETAILS ================= */}
        <section
          className={`rounded-2xl border p-8 transition ${
            gig.status === "assigned"
              ? "bg-emerald-500/10 border-emerald-500/30"
              : "bg-indigo-500/10 border-indigo-500/30"
          }`}
        >
          <div className="flex items-start justify-between mb-4">
            <h1 className="text-3xl font-bold">{gig.title}</h1>

            <span
              className={`px-4 py-1 rounded-full text-sm font-medium capitalize ${
                gig.status === "assigned"
                  ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/40"
                  : "bg-indigo-500/20 text-indigo-400 border border-indigo-500/40"
              }`}
            >
              {gig.status}
            </span>
          </div>

          <p className="text-zinc-400 mb-8">{gig.description}</p>

          <div className="flex flex-wrap gap-8 text-sm">
            <div>
              <span className="text-zinc-500">Budget</span>
              <p
                className={`font-semibold text-lg ${
                  gig.status === "assigned"
                    ? "text-emerald-400"
                    : "text-indigo-400"
                }`}
              >
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

        {/* ================= BIDS SECTION ================= */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold">Freelancer Bids</h2>

            {/* Place Bid (Non-owner only) */}
            {gig.status !== "assigned" && !isOwner && (
              <Link
                to="/home/bid/$gigId"
                params={{ gigId: gig._id }}
                className="rounded-lg bg-zinc-700 hover:bg-zinc-600 transition px-4 py-2 text-sm font-medium"
              >
                Place Bid
              </Link>
            )}
          </div>

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

                  <p className="text-sm text-zinc-400 mb-4">{bid.message}</p>

                  <div className="flex items-center justify-between">
                    <span className="text-xs text-zinc-500">
                      Bid placed on{" "}
                      {new Date(bid.createdAt).toLocaleDateString()}
                    </span>

                    {/* ✅ Accept Button (OWNER ONLY) */}
                    {isOwner &&
                      gig.status !== "assigned" &&
                      bid.status !== "hired" && (
                        <button
                          onClick={() => handleAcceptBid(bid._id)}
                          className="rounded-lg bg-emerald-600 hover:bg-emerald-700 transition px-4 py-2 text-sm font-medium"
                        >
                          Accept
                        </button>
                      )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}

export default RouteComponent;
