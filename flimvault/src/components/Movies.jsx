import React, { useEffect, useState } from "react";
import axios from "axios";
import MovieCard from "./MovieCard";
import Pagination from "./Pagination";

function Movies({ handleWatchList, watchlist, handleRemoveFromWatchlist }) {
  const [movies, setMovies] = useState([]);
  const [pageNo, setPageNo] = useState(1);
  const [totalPages, setTotalPages] = useState(20);

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
    axios
      .get(
        `https://api.themoviedb.org/3/discover/movie?api_key=89c5847955a7ad9c03e4344656a4e6d4&include_adult=false&include_video=false&language=en-US&page=${pageNo}&sort_by=popularity.desc`
      )
      .then((res) => {
        setMovies(res.data.results);
        setTotalPages(res.data.total_pages);
      })
      .catch((err) => {
        console.error(err);
      });
  }, [pageNo]);

  const handlePageClick = (pageNumber) => {
    setPageNo(pageNumber);
  };

  return (
    <div className="p-5">
      <div className="text-2xl text-center font-bold m-6">Trending Movies</div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
        {movies.map((movieObj) => (
          <MovieCard
            key={movieObj.id}
            movieObj={movieObj}
            poster_path={movieObj.poster_path}
            name={movieObj.original_title}
            handleWatchList={handleWatchList}
            handleRemoveFromWatchlist={handleRemoveFromWatchlist}
            watchlist={watchlist}
          />
        ))}
      </div>

      <Pagination
        pageNo={pageNo}
        // totalPages={totalPages}
        handlePageClick={handlePageClick}
      />
    </div> //
  );
}

export default Movies;
