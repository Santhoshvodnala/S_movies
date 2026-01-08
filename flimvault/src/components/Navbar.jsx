import React, { useState } from "react";
import LOGO from "../LOGO2.png";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "./AppContext";

const Navbar = () => {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/search?query=${query}`);
      setQuery("");
    }
  };

  return (
    <div
      className="flex items-center justify-between pl-3 py-3"
      style={{ backgroundColor: "#9b9ea2ff" }}
    >
      {/* Left */}
      <div className="flex items-center space-x-10">
        <Link to="/">
          <img src={LOGO} className="w-[50px]" alt="Logo" />
        </Link>

        <Link
          to="/"
          className="text-2xl font-semibold text-black hover:scale-105 transition-all"
        >
          Movies
        </Link>

        <Link
          to="/Watchlist"
          className="text-2xl font-semibold text-black hover:scale-105 transition-all"
        >
          Watchlist
        </Link>
      </div>

      {/* Search */}
      <form onSubmit={handleSearch} className="flex items-center space-x-2">
        <input
          type="text"
          placeholder="Search movies..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="px-4 py-2 rounded-full border border-gray-400 focus:ring-2 focus:ring-purple-500"
        />
        <button
          type="submit"
          className="px-4 py-2 rounded-full bg-purple-500 text-white font-semibold hover:bg-purple-600"
        >
          Search
        </button>
      </form>

      {/* Right: Login OR Avatar */}
      <div className="mr-4">
        {!isAuthenticated ? (
          <Link
            to="/Login"
            className="px-6 py-2 rounded-full text-2xl font-semibold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-600 text-white hover:scale-110 transition-all animate-pulse"
          >
            Login
          </Link>
        ) : (
          <Link to="/profile" title="View Profile">
            <div className="w-10 h-10 rounded-full bg-purple-600 text-white flex items-center justify-center font-bold text-lg cursor-pointer hover:scale-110 transition">
              {user?.username?.charAt(0).toUpperCase()}
            </div>
          </Link>
        )}
      </div>
    </div>
  );
};

export default Navbar;
