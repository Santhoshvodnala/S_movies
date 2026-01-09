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
    <nav className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 shadow-lg sticky top-0 z-50 backdrop-blur-sm border-b border-slate-700/50">
      {/* Left */}
      <div className="flex items-center space-x-8">
        <Link to="/" className="group">
          <img
            src={LOGO}
            className="w-12 h-12 object-contain rounded-lg transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3"
            alt="Logo"
          />
        </Link>

        <div className="hidden md:flex items-center space-x-6">
          <Link
            to="/"
            className="relative text-lg font-medium text-slate-200 transition-all duration-300 hover:text-white after:content-[''] after:absolute after:w-0 after:h-0.5 after:bg-amber-400 after:left-0 after:-bottom-1 after:transition-all after:duration-300 hover:after:w-full"
          >
            Movies
          </Link>

          <Link
            to="/Watchlist"
            className="relative text-lg font-medium text-slate-200 transition-all duration-300 hover:text-white after:content-[''] after:absolute after:w-0 after:h-0.5 after:bg-amber-400 after:left-0 after:-bottom-1 after:transition-all after:duration-300 hover:after:w-full"
          >
            Watchlist
          </Link>
        </div>
      </div>

      {/* Search */}
      <form onSubmit={handleSearch} className="flex items-center">
        <div className="relative flex items-center">
          <input
            type="text"
            placeholder="Search movies..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-48 md:w-64 px-5 py-2.5 pr-12 rounded-full bg-slate-700/50 border border-slate-600 text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-400/50 focus:border-amber-400 transition-all duration-300 focus:w-56 md:focus:w-80"
          />
          <button
            type="submit"
            className="absolute right-1 p-2 rounded-full bg-amber-500 text-slate-900 font-semibold hover:bg-amber-400 transition-all duration-300 hover:shadow-lg hover:shadow-amber-500/25"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </button>
        </div>
      </form>

      {/* Right: Login OR Avatar */}
      <div>
        {!isAuthenticated ? (
          <Link
            to="/Login"
            className="px-6 py-2.5 rounded-full text-base font-semibold bg-gradient-to-r from-amber-500 to-orange-500 text-slate-900 shadow-lg shadow-amber-500/25 hover:shadow-amber-500/40 hover:scale-105 transition-all duration-300"
          >
            Login
          </Link>
        ) : (
          <Link to="/profile" title="View Profile">
            <div className="w-11 h-11 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 text-slate-900 flex items-center justify-center font-bold text-lg cursor-pointer hover:scale-110 transition-all duration-300 shadow-lg shadow-amber-500/30 hover:shadow-amber-500/50 ring-2 ring-slate-700">
              {user?.username?.charAt(0).toUpperCase()}
            </div>
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
