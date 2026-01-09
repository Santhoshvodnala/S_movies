import React, { useEffect, useState } from "react";
import axios from "axios";
import MovieCard from "./MovieCard";
import Pagination from "./Pagination";

function Movies({ handleWatchList, watchlist, handleRemoveFromWatchlist }) {
  const [movies, setMovies] = useState([]);
  const [pageNo, setPageNo] = useState(1);
  const [totalPages, setTotalPages] = useState(20);
  const [loading, setLoading] = useState(true);

  const handlePre = () => {
    if (pageNo > 1) {
      setPageNo(pageNo - 1);
    }
  };

  const handleNext = () => {
    if (pageNo < totalPages) {
      setPageNo(pageNo + 1);
    }
  };

  useEffect(() => {
    setLoading(true);
    axios
      .get(
        `https://api.themoviedb.org/3/discover/movie?api_key=89c5847955a7ad9c03e4344656a4e6d4&include_adult=false&include_video=false&language=en-US&page=${pageNo}&sort_by=popularity.desc`
      )
      .then((res) => {
        setMovies(res.data.results);
        setTotalPages(res.data.total_pages);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, [pageNo]);

  const handlePageClick = (pageNumber) => {
    setPageNo(pageNumber);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 px-4 md:px-8 py-10">
      {/* Header Section */}
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-amber-400 via-orange-400 to-amber-500 bg-clip-text text-transparent mb-3">
          Trending Movies
        </h1>
        <div className="flex items-center justify-center gap-2">
          <span className="h-1 w-12 bg-gradient-to-r from-transparent to-amber-500 rounded-full"></span>
          <span className="h-1.5 w-20 bg-amber-500 rounded-full"></span>
          <span className="h-1 w-12 bg-gradient-to-l from-transparent to-amber-500 rounded-full"></span>
        </div>
        <p className="text-slate-400 mt-4 text-lg">
          Discover the most popular movies right now
        </p>
      </div>

      {/* Loading State */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="flex flex-col items-center gap-4">
            <div className="w-16 h-16 border-4 border-slate-700 border-t-amber-500 rounded-full animate-spin"></div>
            <p className="text-slate-400 text-lg animate-pulse">
              Loading movies...
            </p>
          </div>
        </div>
      ) : (
        <>
          {/* Movies Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 md:grid-cols-5 gap-4 md:gap-6">
            {movies.map((movieObj, index) => (
              <div
                key={movieObj.id}
                className="transform transition-all duration-500 hover:z-10"
                style={{
                  animationDelay: `${index * 50}ms`,
                  animation: "fadeInUp 0.5s ease-out forwards",
                }}
              >
                <MovieCard
                  movieObj={movieObj}
                  poster_path={movieObj.poster_path}
                  name={movieObj.original_title}
                  handleWatchList={handleWatchList}
                  handleRemoveFromWatchlist={handleRemoveFromWatchlist}
                  watchlist={watchlist}
                />
              </div>
            ))}
          </div>

          {/* Pagination */}
          <div className="mt-12">
            <Pagination
              pageNo={pageNo}
              totalPages={totalPages}
              handlePageClick={handlePageClick}
              handlePre={handlePre}
              handleNext={handleNext}
            />
          </div>
        </>
      )}

      {/* Add keyframes for animation */}
      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}

export default Movies;
