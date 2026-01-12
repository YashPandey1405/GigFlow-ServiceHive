import { createFileRoute, useRouter } from "@tanstack/react-router";
import apiClient from "../../../../../services/apiClient";
import { useState } from "react";

export const Route = createFileRoute("/home/(gigs)/gig/create")({
  component: RouteComponent,
});

function RouteComponent() {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [budget, setBudget] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await apiClient.postgig(title, description, budget);

      if (response?.success) {
        router.navigate({ to: "/home" });
      } else {
        setError(response?.message || "Failed to post gig.");
      }
    } catch (err) {
      setError("Server error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-zinc-900 via-black to-zinc-900 flex items-center justify-center px-4 text-white">
      <div className="w-full max-w-lg rounded-2xl bg-zinc-900/80 backdrop-blur border border-zinc-800 shadow-2xl p-8">
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold">Post a New Gig</h1>
          <p className="text-sm text-zinc-400 mt-1">
            Share your requirement with the community
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
              Gig Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              placeholder="e.g. Full Stack MERN Developer"
              className="w-full rounded-lg bg-zinc-800 border border-zinc-700 px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-sm text-zinc-400 mb-1">
              Description
            </label>
            <textarea
              rows={5}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              placeholder="Describe the work, expectations, skills required..."
              className="w-full rounded-lg bg-zinc-800 border border-zinc-700 px-4 py-3 text-white resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-sm text-zinc-400 mb-1">
              Budget (₹)
            </label>
            <input
              type="number"
              value={budget}
              onChange={(e) => setBudget(e.target.value)}
              required
              placeholder="e.g. 20000"
              className="w-full rounded-lg bg-zinc-800 border border-zinc-700 px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-indigo-600 hover:bg-indigo-700 transition text-white font-medium py-2 disabled:opacity-60"
          >
            {loading ? "Posting Gig..." : "Post Gig"}
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
