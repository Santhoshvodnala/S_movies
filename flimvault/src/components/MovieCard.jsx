import React from "react";
import { useNavigate } from "react-router-dom";

function MovieCard({
  movieObj,
  poster_path,
  name,
  handleWatchList,
  handleRemoveFromWatchlist,
  watchlist,
}) {
  const navigate = useNavigate();

  const isInWatchlist = watchlist?.some((movie) => movie.id === movieObj.id);

  // ✅ Always go to movie details page (NO LOGIN FORCE HERE)
  const handleMovieClick = () => {
    navigate(`/movie/${movieObj.id}`);
  };

  return (
    <div
      onClick={handleMovieClick}
      className="group relative rounded-xl overflow-hidden bg-slate-800/50 border border-slate-700/50 shadow-lg hover:shadow-2xl hover:shadow-amber-500/10 transition-all duration-300 hover:scale-105 hover:border-amber-500/30 cursor-pointer"
    >
      {/* Movie Poster */}
      <div className="aspect-[2/3] overflow-hidden">
        <img
          src={
            poster_path
              ? `https://image.tmdb.org/t/p/w500${poster_path}`
              : "https://via.placeholder.com/500x750?text=No+Image"
          }
          alt={name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
      </div>

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>

      {/* Watchlist Button */}
      <button
        onClick={(e) => {
          e.stopPropagation(); // ✅ stop navigation on watchlist click
          isInWatchlist
            ? handleRemoveFromWatchlist(movieObj)
            : handleWatchList(movieObj);
        }}
        className={`absolute top-3 right-3 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 backdrop-blur-sm ${
          isInWatchlist
            ? "bg-amber-500 text-slate-900 shadow-lg shadow-amber-500/50"
            : "bg-slate-900/70 text-slate-300 hover:bg-amber-500 hover:text-slate-900"
        }`}
      >
        {isInWatchlist ? (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
              clipRule="evenodd"
            />
          </svg>
        ) : (
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
              d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4 0 00-6.364 0z"
            />
          </svg>
        )}
      </button>

      {/* Rating Badge */}
      <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-slate-900/80 backdrop-blur-sm border border-slate-700/50 flex items-center gap-1">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-4 w-4 text-amber-400"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
        <span className="text-sm font-semibold text-slate-200">
          {movieObj.vote_average?.toFixed(1)}
        </span>
      </div>

      {/* Movie Title */}
      <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-slate-900 via-slate-900/90 to-transparent transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
        <h3 className="text-white font-semibold text-sm md:text-base line-clamp-2 mb-1">
          {name}
        </h3>
        <p className="text-slate-400 text-xs">
          {movieObj.release_date?.split("-")[0]}
        </p>
      </div>
    </div>
  );
}

export default MovieCard;
