import React, { useState } from "react";
import genre_ids from "../Utility/Genre";

function Watchlist({ watchlist, handleRemoveFromWatchlist, setWatchlist }) {
  const [search, setSearch] = useState("");
  const [activeSort, setActiveSort] = useState("");

  let handleSearch = (e) => {
    setSearch(e.target.value);
  };

  let sortIncrease = () => {
    let add = watchlist.sort((movieA, movieB) => {
      return movieA.vote_average - movieB.vote_average;
    });
    setWatchlist([...add]);
    setActiveSort("ratingAsc");
  };

  let sortDecrease = () => {
    let addWatch = watchlist.sort((movieA, movieB) => {
      return movieB.vote_average - movieA.vote_average;
    });
    setWatchlist([...addWatch]);
    setActiveSort("ratingDesc");
  };

  let highPopularity = () => {
    let high = watchlist.sort((movieA, movieB) => {
      return movieA.popularity - movieB.popularity;
    });
    setWatchlist([...high]);
    setActiveSort("popAsc");
  };

  let lowPopularity = () => {
    let low = watchlist.sort((movieA, movieB) => {
      return movieB.popularity - movieA.popularity;
    });
    setWatchlist([...low]);
    setActiveSort("popDesc");
  };

  const filteredWatchlist = watchlist.filter((movieObj) => {
    return movieObj.title?.toLowerCase().includes(search.toLowerCase());
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 px-4 md:px-8 py-10">
      {/* Header Section */}
      <div className="text-center mb-10">
        <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-amber-400 via-orange-400 to-amber-500 bg-clip-text text-transparent mb-3">
          My Watchlist
        </h1>
        <div className="flex items-center justify-center gap-2">
          <span className="h-1 w-12 bg-gradient-to-r from-transparent to-amber-500 rounded-full"></span>
          <span className="h-1.5 w-20 bg-amber-500 rounded-full"></span>
          <span className="h-1 w-12 bg-gradient-to-l from-transparent to-amber-500 rounded-full"></span>
        </div>
        <p className="text-slate-400 mt-4 text-lg">
          {watchlist.length} {watchlist.length === 1 ? "movie" : "movies"} saved
        </p>
      </div>

      {/* Search Bar */}
      <div className="flex justify-center mb-8">
        <div className="relative w-full max-w-md">
          <input
            onChange={handleSearch}
            value={search}
            type="text"
            placeholder="Search your watchlist..."
            className="w-full px-5 py-3 pl-12 rounded-xl bg-slate-800/70 border border-slate-700 text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 transition-all duration-300"
          />
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
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
        </div>
      </div>

      {/* Empty State */}
      {watchlist.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20">
          <div className="w-24 h-24 rounded-full bg-slate-800 flex items-center justify-center mb-6">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-12 w-12 text-slate-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
              />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-slate-300 mb-2">
            Your watchlist is empty
          </h3>
          <p className="text-slate-500">
            Start adding movies to keep track of what you want to watch!
          </p>
        </div>
      ) : (
        /* Table Container */
        <div className="overflow-x-auto rounded-xl border border-slate-700/50 bg-slate-800/30 backdrop-blur-sm shadow-xl">
          <table className="w-full text-left">
            {/* Table Header */}
            <thead>
              <tr className="bg-slate-800/80 border-b border-slate-700">
                <th className="px-6 py-4 text-slate-300 font-semibold text-sm uppercase tracking-wider">
                  Movie
                </th>

                <th className="px-6 py-4 text-slate-300 font-semibold text-sm uppercase tracking-wider">
                  <div className="flex items-center gap-1">
                    <button
                      onClick={sortIncrease}
                      className={`p-1.5 rounded-lg transition-all duration-200 ${
                        activeSort === "ratingAsc"
                          ? "bg-amber-500 text-slate-900"
                          : "hover:bg-slate-700 text-slate-400 hover:text-amber-400"
                      }`}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M5 15l7-7 7 7"
                        />
                      </svg>
                    </button>
                    <span className="px-2">Rating</span>
                    <button
                      onClick={sortDecrease}
                      className={`p-1.5 rounded-lg transition-all duration-200 ${
                        activeSort === "ratingDesc"
                          ? "bg-amber-500 text-slate-900"
                          : "hover:bg-slate-700 text-slate-400 hover:text-amber-400"
                      }`}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </button>
                  </div>
                </th>

                <th className="px-6 py-4 text-slate-300 font-semibold text-sm uppercase tracking-wider">
                  <div className="flex items-center gap-1">
                    <button
                      onClick={highPopularity}
                      className={`p-1.5 rounded-lg transition-all duration-200 ${
                        activeSort === "popAsc"
                          ? "bg-amber-500 text-slate-900"
                          : "hover:bg-slate-700 text-slate-400 hover:text-amber-400"
                      }`}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M5 15l7-7 7 7"
                        />
                      </svg>
                    </button>
                    <span className="px-2">Popularity</span>
                    <button
                      onClick={lowPopularity}
                      className={`p-1.5 rounded-lg transition-all duration-200 ${
                        activeSort === "popDesc"
                          ? "bg-amber-500 text-slate-900"
                          : "hover:bg-slate-700 text-slate-400 hover:text-amber-400"
                      }`}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </button>
                  </div>
                </th>

                <th className="px-6 py-4 text-slate-300 font-semibold text-sm uppercase tracking-wider">
                  Genre
                </th>

                <th className="px-6 py-4 text-slate-300 font-semibold text-sm uppercase tracking-wider">
                  Action
                </th>
              </tr>
            </thead>

            {/* Table Body */}
            <tbody className="divide-y divide-slate-700/50">
              {filteredWatchlist.map((movieObj, index) => (
                <tr
                  key={movieObj.id}
                  className="group hover:bg-slate-700/30 transition-all duration-300"
                  style={{
                    animation: `fadeIn 0.3s ease-out ${index * 0.05}s forwards`,
                    opacity: 0,
                  }}
                >
                  {/* Movie Info */}
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      <div className="h-20 w-14 flex-shrink-0 overflow-hidden rounded-lg shadow-lg group-hover:shadow-amber-500/20 transition-shadow duration-300">
                        <img
                          src={`https://image.tmdb.org/t/p/w200/${movieObj.poster_path}`}
                          alt={movieObj.original_title}
                          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
                        />
                      </div>
                      <div>
                        <h3 className="font-semibold text-slate-100 group-hover:text-amber-400 transition-colors duration-300">
                          {movieObj.original_title}
                        </h3>
                        <p className="text-sm text-slate-500">
                          {movieObj.release_date?.split("-")[0]}
                        </p>
                      </div>
                    </div>
                  </td>

                  {/* Rating */}
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 text-amber-400"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                      <span className="text-slate-200 font-medium">
                        {movieObj.vote_average?.toFixed(1)}
                      </span>
                    </div>
                  </td>

                  {/* Popularity */}
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 text-orange-400"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span className="text-slate-200 font-medium">
                        {movieObj.popularity?.toFixed(0)}
                      </span>
                    </div>
                  </td>

                  {/* Genre */}
                  <td className="px-6 py-4">
                    <span className="px-3 py-1 rounded-full text-sm font-medium bg-slate-700/50 text-slate-300 border border-slate-600">
                      {genre_ids[movieObj.genre_ids?.[0]] || "N/A"}
                    </span>
                  </td>

                  {/* Delete Action */}
                  <td className="px-6 py-4">
                    <button
                      onClick={() => handleRemoveFromWatchlist(movieObj)}
                      className="group/btn flex items-center gap-2 px-4 py-2 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 hover:bg-red-500 hover:text-white hover:border-red-500 transition-all duration-300"
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
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                      <span className="hidden sm:inline">Remove</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* No Results */}
          {filteredWatchlist.length === 0 && search && (
            <div className="py-12 text-center">
              <p className="text-slate-400">
                No movies found matching "{search}"
              </p>
            </div>
          )}
        </div>
      )}

      {/* Animation Keyframes */}
      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateX(-10px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
      `}</style>
    </div>
  );
}

export default Watchlist;
