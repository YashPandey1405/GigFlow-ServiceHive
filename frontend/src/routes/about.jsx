import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/about")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="min-h-screen bg-linear-to-br from-zinc-900 via-black to-zinc-900 text-white">
      {/* Navbar */}
      <nav className="flex items-center justify-between px-6 py-4 border-b border-zinc-800 bg-zinc-900/80 backdrop-blur">
        <Link to="/" className="text-xl font-bold">
          GigFlow
        </Link>

        <Link
          to="/login"
          className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 transition text-sm font-medium"
        >
          Login
        </Link>
      </nav>

      {/* Hero Section */}
      <section className="max-w-5xl mx-auto px-6 py-20 text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-6">
          Building <span className="text-indigo-400">GigFlow</span>
        </h1>

        <p className="text-zinc-400 max-w-3xl mx-auto text-lg leading-relaxed mb-10">
          GigFlow is a modern freelancing platform focused on real-world hiring,
          scalability, and clean system design. It is built to reflect how gigs,
          freelancers, and hiring actually work — not just how they look on
          paper.
        </p>

        {/* About You */}
        <div className="mt-12 max-w-4xl mx-auto rounded-2xl bg-zinc-900/70 border border-zinc-800 p-8 text-left">
          <h2 className="text-2xl font-semibold mb-4 text-indigo-400">
            About the Builder
          </h2>

          <p className="text-zinc-300 leading-relaxed mb-4">
            Hi, I’m{" "}
            <span className="font-semibold text-white">Yash Pandey</span> a
            full-stack MERN developer and backend-focused engineer with a strong
            interest in scalable systems, real-time architecture, and clean
            code.
          </p>

          <p className="text-zinc-400 leading-relaxed mb-4">
            GigFlow is not just a UI project for me. It’s a system-driven
            platform where I experiment with real production concepts like
            authentication, role-based access, API design, CORS handling,
            deployment pipelines, and future integrations such as WebSockets,
            Redis, and AI-assisted workflows.
          </p>

          <p className="text-zinc-400 leading-relaxed">
            This project reflects my approach to engineering — slow, consistent,
            practical, and focused on long-term growth rather than shortcuts.
          </p>
        </div>
      </section>

      {/* Mission + Vision */}
      <section className="max-w-5xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-2 gap-10">
        <div className="rounded-2xl bg-zinc-900/70 border border-zinc-800 p-8">
          <h2 className="text-2xl font-semibold mb-4 text-indigo-400">
            Our Mission
          </h2>
          <p className="text-zinc-400 leading-relaxed">
            To simplify the freelancing ecosystem by providing a transparent,
            fast, and developer-first platform where gigs, bids, and hiring
            decisions are handled with clarity and trust.
          </p>
        </div>

        <div className="rounded-2xl bg-zinc-900/70 border border-zinc-800 p-8">
          <h2 className="text-2xl font-semibold mb-4 text-indigo-400">
            Our Vision
          </h2>
          <p className="text-zinc-400 leading-relaxed">
            To evolve GigFlow into a scalable gig marketplace with real-time
            collaboration, smart matching, and AI-assisted hiring — built for
            the next generation of freelancers and startups.
          </p>
        </div>
      </section>

      {/* Tech Stack / Values */}
      <section className="max-w-5xl mx-auto px-6 py-16">
        <h2 className="text-3xl font-bold text-center mb-12">
          What Powers GigFlow
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="rounded-xl bg-zinc-900/60 border border-zinc-800 p-6">
            <h3 className="text-lg font-semibold mb-2">Modern Stack</h3>
            <p className="text-sm text-zinc-400">
              Built using MERN, TanStack Router, TailwindCSS, and scalable
              backend services with clean API contracts.
            </p>
          </div>

          <div className="rounded-xl bg-zinc-900/60 border border-zinc-800 p-6">
            <h3 className="text-lg font-semibold mb-2">Real-world Design</h3>
            <p className="text-sm text-zinc-400">
              Designed around real hiring flows — gigs, bids, ownership, and
              permissions — not just UI demos.
            </p>
          </div>

          <div className="rounded-xl bg-zinc-900/60 border border-zinc-800 p-6">
            <h3 className="text-lg font-semibold mb-2">Scalable by Nature</h3>
            <p className="text-sm text-zinc-400">
              Architecture ready for WebSockets, Redis, role-based access, and
              future AI integrations.
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="text-center py-20 px-6">
        <h2 className="text-3xl font-bold mb-4">Ready to explore GigFlow?</h2>
        <p className="text-zinc-400 mb-8">
          Log in and start discovering gigs or managing your freelance journey.
        </p>

        <Link
          to="/login"
          className="inline-block px-8 py-3 rounded-lg bg-indigo-600 hover:bg-indigo-700 transition font-medium"
        >
          Get Started
        </Link>
      </section>

      {/* Footer */}
      <footer className="border-t border-zinc-800 py-6 text-center text-sm text-zinc-500">
        © {new Date().getFullYear()} GigFlow. Built with focus and discipline.
      </footer>
    </div>
  );
}
