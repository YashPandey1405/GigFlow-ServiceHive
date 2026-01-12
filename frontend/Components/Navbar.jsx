import { useRouter } from "@tanstack/react-router";
import { Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { authStore } from "../src/store/authStore";

const Navbar = () => {
  const router = useRouter();

  const isLoggedInZustand = authStore((state) => state.isLoggedIn);
  const userAvatorURl = authStore((state) => state.userAvatorURl);

  return (
    <nav className="flex items-center justify-between px-6 py-4 border-b border-zinc-800 bg-zinc-900/80 backdrop-blur">
      <h1 className="text-xl font-bold">GigFlow</h1>

      <div className="flex items-center gap-4">
        {/* Profile Avatar */}
        <Link to="/profile">
          <img
            src={userAvatorURl}
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
  );
};

export default Navbar;
