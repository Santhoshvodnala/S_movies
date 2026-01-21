import React, { useEffect, useState } from "react";
import Navbar from "./components/Navbar";
import Login from "./components/Login";
import Movies from "./components/Movies";
import Watchlist from "./components/Watchlist";
import { Route, Routes } from "react-router-dom";
import Banner from "./components/Banner";
import Register from "./components/Register";
import SearchResults from "./components/Search";
import Profile from "./components/Profile";
import Toast from "./components/Toast";
import MovieDetails from "./components/MovieDetails";

function App() {
  const [watchlist, setWatchlist] = useState([]);

  const handleWatchList = (movieObj) => {
    const newWatchList = [...watchlist, movieObj];
    localStorage.setItem("movieskey", JSON.stringify(newWatchList));
    setWatchlist(newWatchList);
  };

  useEffect(() => {
    const movies = localStorage.getItem("movieskey");
    if (movies) {
      setWatchlist(JSON.parse(movies));
    }
  }, []);

  const handleRemoveFromWatchlist = (movieObj) => {
    const filtered = watchlist.filter((m) => m.id !== movieObj.id);
    setWatchlist(filtered);
    localStorage.setItem("movieskey", JSON.stringify(filtered));
  };

  return (
    <div>
      <Navbar />

      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route
          path="/search"
          element={
            <SearchResults
              watchlist={watchlist}
              handleWatchList={handleWatchList}
              handleRemoveFromWatchlist={handleRemoveFromWatchlist}
            />
          }
        />

        <Route
          path="/"
          element={
            <>
              <Banner
                poster_path="gDVgC9jd917NdAcqBdRRDUYi4Tq.jpg"
                name="Avatar: Fire and Ash"
              />

              <Movies
                watchlist={watchlist}
                handleWatchList={handleWatchList}
                handleRemoveFromWatchlist={handleRemoveFromWatchlist}
              />
            </>
          }
        />

        <Route
          path="/watchlist"
          element={
            <Watchlist
              watchlist={watchlist}
              handleRemoveFromWatchlist={handleRemoveFromWatchlist}
              setWatchlist={setWatchlist}
            />
          }
        />

        <Route path="/movie/:id" element={<MovieDetails />} />

        <Route path="/profile" element={<Profile />} />
        <Route path="/toast" element={<Toast />} />
      </Routes>
    </div>
  );
}

export default App;
