import React, { useState } from "react";
import LOGO from "../LOGO2.png";
import { Link, useNavigate } from "react-router-dom";

const Navbar = () => {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  // Handle search submit
  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim() !== "") {
      navigate(`/search?query=${query}`); // redirect to search page with query param
      setQuery(""); // clear input after search
    }
  };

  return (
    <div
      className="flex items-center justify-between  pl-3 py-3"
      style={{ backgroundColor: "#9b9ea2ff" }}
    >
      {/* Left side (Logo + Links) */}
      <div className="flex items-center space-x-10">
        <Link to="/">
          <img src={LOGO} className="w-[50px]" alt="Logo" />
        </Link>
        <Link
          to="/"
          className="text-2xl text-black font-semibold py-2 rounded-lg transition-all duration-300 hover:scale-105"
        >
          Movies
        </Link>
        <Link
          to="/Watchlist"
          className="text-2xl text-black font-semibold py-2 rounded-lg transition-all duration-300 hover:scale-105"
        >
          Watchlist
        </Link>
      </div>

      <form onSubmit={handleSearch} className="flex items-center space-x-2">
        <input
          type="text"
          placeholder="Search movies..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="px-4 py-2 rounded-full border border-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
        <button
          type="submit"
          className="px-4 py-2 rounded-full bg-purple-500 text-white font-semibold hover:bg-purple-600 transition-all"
        >
          Search
        </button>
      </form>

      <button
        type="button"
        className="px-6 py-2 mr-2 rounded-full text-2xl font-semibold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-600 text-white transition-all duration-300 hover:scale-110 hover:bg-gradient-to-l animate-pulse"
      >
        <Link
          to="/Login"
          className="w-full h-full flex justify-center items-center m-50"
        >
          Login
        </Link>
      </button>
    </div>
  );
};

export default Navbar;
