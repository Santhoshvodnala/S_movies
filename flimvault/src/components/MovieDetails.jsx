import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import LoginModal from "./LoginModal";
import { useAuth } from "./AppContext";

function MovieDetails() {
  const { id } = useParams();
  const { isAuthenticated, loading } = useAuth();

  const [movie, setMovie] = useState(null);
  const [pageLoading, setPageLoading] = useState(true);
  const [openLoginModal, setOpenLoginModal] = useState(false);

  const API_KEY = "89c5847955a7ad9c03e4344656a4e6d4";

  // ✅ Open login modal only if user NOT logged in
  useEffect(() => {
    if (!loading && !isAuthenticated) {
      setOpenLoginModal(true);
    }
  }, [loading, isAuthenticated]);

  // ✅ Always fetch movie details
  useEffect(() => {
    async function fetchMovieDetails() {
      try {
        setPageLoading(true);
        const res = await fetch(
          `https://api.themoviedb.org/3/movie/${id}?api_key=${API_KEY}&language=en-US`
        );
        const data = await res.json();

        if (!res.ok || data.success === false) {
          setMovie(null);
          return;
        }

        setMovie(data);
      } catch (error) {
        setMovie(null);
      } finally {
        setPageLoading(false);
      }
    }

    fetchMovieDetails();
  }, [id]);

  if (pageLoading) {
    return (
      <div className="min-h-screen flex justify-center items-center text-white bg-slate-950">
        Loading movie details...
      </div>
    );
  }

  if (!movie) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center text-white bg-slate-950">
        <p className="mb-3">Movie not found ❌</p>
        <Link to="/" className="text-amber-400 font-semibold">
          ⬅ Go Back
        </Link>
      </div>
    );
  }

  return (
    <>
      {/* ✅ Login Modal Popup */}
      <LoginModal
        isOpen={openLoginModal}
        onClose={() => setOpenLoginModal(false)}
      />

      {/* ✅ Movie Details Page with blur when modal open */}
      <div
        className={`min-h-screen bg-slate-950 text-white transition-all duration-300 ${
          openLoginModal ? "blur-sm opacity-50 pointer-events-none" : ""
        }`}
      >
        {/* Back Button */}
        <div className="p-6 ">
          <Link
            to="/"
            className="text-amber-400 hover:text-amber-300 font-semibold"
          >
            ⬅ Back
          </Link>
        </div>

        {/* Hero Section */}
        <div className="relative w-full min-h-[70vh]">
          <img
            src={
              movie.backdrop_path
                ? `https://image.tmdb.org/t/p/original${movie.backdrop_path}`
                : "https://via.placeholder.com/1200x600?text=No+Backdrop"
            }
            alt={movie.title}
            className="w-full h-full object-cover opacity-40"
          />

          <div className="absolute inset-0 flex items-end p-8 bg-gradient-to-t from-slate-950 via-transparent to-transparent">
            <div className="flex flex-col md:flex-row gap-6 items-end">
              {/* Poster */}
              <img
                src={
                  movie.poster_path
                    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                    : "https://via.placeholder.com/500x750?text=No+Image"
                }
                alt={movie.title}
                className="w-28 h-[210px] md:w-40 md:h-[300px] object-cover rounded-lg shadow-lg border border-slate-700"
              />

              {/* Info */}
              <div>
                <h1 className="text-3xl md:text-5xl font-bold mb-2">
                  {movie.title}
                </h1>

                <p className="text-slate-300 max-w-2xl mb-4">
                  {movie.overview || "No overview available."}
                </p>

                <div className="flex flex-wrap gap-3 text-sm">
                  <span className="px-3 py-1 rounded-full bg-slate-800 border border-slate-700">
                    ⭐ {movie.vote_average?.toFixed(1)} / 10
                  </span>

                  <span className="px-3 py-1 rounded-full bg-slate-800 border border-slate-700">
                    📅 {movie.release_date || "N/A"}
                  </span>

                  <span className="px-3 py-1 rounded-full bg-slate-800 border border-slate-700">
                    ⏱ {movie.runtime ? `${movie.runtime} min` : "N/A"}
                  </span>
                </div>

                {/* Genres */}
                <div className="mt-4 flex flex-wrap gap-2">
                  {movie.genres?.length > 0 ? (
                    movie.genres.map((g) => (
                      <span
                        key={g.id}
                        className="px-3 py-1 rounded-full bg-amber-500/20 border border-amber-500/30 text-amber-300 text-xs"
                      >
                        {g.name}
                      </span>
                    ))
                  ) : (
                    <span className="text-slate-400 text-sm">
                      No genres found
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* More Details */}
        <div className="p-8">
          <h2 className="text-2xl font-bold mb-4">More Details</h2>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-slate-900/50 border border-slate-700 rounded-xl p-6">
              <p className="text-slate-400 text-sm">Budget</p>
              <p className="font-semibold">
                {movie.budget ? `$${movie.budget.toLocaleString()}` : "N/A"}
              </p>
            </div>

            <div className="bg-slate-900/50 border border-slate-700 rounded-xl p-6">
              <p className="text-slate-400 text-sm">Revenue</p>
              <p className="font-semibold">
                {movie.revenue ? `$${movie.revenue.toLocaleString()}` : "N/A"}
              </p>
            </div>

            <div className="bg-slate-900/50 border border-slate-700 rounded-xl p-6">
              <p className="text-slate-400 text-sm">Popularity</p>
              <p className="font-semibold">{movie.popularity || "N/A"}</p>
            </div>

            <div className="bg-slate-900/50 border border-slate-700 rounded-xl p-6">
              <p className="text-slate-400 text-sm">Status</p>
              <p className="font-semibold">{movie.status || "N/A"}</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default MovieDetails;
