import { createFileRoute, useRouter } from "@tanstack/react-router";
import apiClient from "../../../../services/apiClient";
import { useState } from "react";

export const Route = createFileRoute("/home/(bids)/bid/$gigId")({
  component: RouteComponent,
});

function RouteComponent() {
  const router = useRouter();
  const { gigId } = Route.useParams();

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // 🔁 Adjust method name if needed
      const response = await apiClient.placeBid(gigId, { message });

      if (response?.success) {
        router.navigate({
          to: "/home/gig/$gigId",
          params: { gigId },
        });
      } else {
        router.navigate({ to: "/home" });
      }
    } catch (err) {
      setError("Failed to place bid. Please try again.");
      setTimeout(() => {
        router.navigate({ to: "/home" });
      }, 1200);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-zinc-900 via-black to-zinc-900 flex items-center justify-center px-4 text-white">
      <div className="w-full max-w-lg rounded-2xl bg-zinc-900/80 backdrop-blur border border-zinc-800 shadow-2xl p-8">
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold">Place a Bid</h1>
          <p className="text-sm text-zinc-400 mt-1">
            Tell the client why you’re the right fit
          </p>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-4 rounded-lg px-4 py-3 text-sm bg-red-500/10 text-red-400 border border-red-500/30">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm text-zinc-400 mb-1">
              Your Proposal
            </label>
            <textarea
              rows={5}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              required
              placeholder="Write a short message explaining your skills, timeline, or approach..."
              className="w-full rounded-lg bg-zinc-800 border border-zinc-700 px-4 py-3 text-white resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-indigo-600 hover:bg-indigo-700 transition text-white font-medium py-2 disabled:opacity-60"
          >
            {loading ? "Submitting Bid..." : "Submit Bid"}
          </button>
        </form>

        {/* Footer */}
        <button
          onClick={() => router.navigate({ to: "/home" })}
          className="mt-6 text-sm text-zinc-400 hover:underline block mx-auto"
        >
          Cancel and go back
        </button>
      </div>
    </div>
  );
}
