import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import MovieCard from "./MovieCard";

const API_KEY = "89c5847955a7ad9c03e4344656a4e6d4";

const SearchResults = ({
  watchlist,
  handleWatchList,
  handleRemoveFromWatchlist,
}) => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);

  const location = useLocation();
  const query = new URLSearchParams(location.search).get("query");

  useEffect(() => {
    if (query) {
      fetchMovies(query);
    }
  }, [query]);

  const fetchMovies = async (searchQuery) => {
    setLoading(true);
    try {
      const response = await fetch(
        `https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&query=${searchQuery}`,
      );
      const data = await response.json();

      setMovies(data.results || []);
    } catch (error) {
      console.error("Error fetching movies ", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <p className="text-center mt-10 text-xl">Loading.....</p>;
  }

  return (
    <div className="p-5">
      <h2 className="text-3xl font-bold mb-5">Search Results for "{query}"</h2>

      {movies.length === 0 ? (
        <p>No movies found.</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
          {movies.map((movie) => (
            <MovieCard
              key={movie.id}
              poster_path={movie.poster_path}
              name={movie.title}
              movieObj={movie}
              watchlist={watchlist}
              handleWatchList={handleWatchList}
              handleRemoveFromWatchlist={handleRemoveFromWatchlist}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchResults;
