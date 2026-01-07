import React, { useEffect, useState } from "react";
import Navbar from "./components/Navbar";
import Login from "./components/Login";
import Movies from "./components/Movies";
import Watchlist from "./components/Watchlist";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Banner from "./components/Banner";
import Register from "./components/Register";
import SearchResults from "./components/Search";

function App() {
  let [watchlist, setWatchlist] = useState([]);

  let handleWatchList = (movieObj) => {
    let newWatchList = [...watchlist, movieObj];
    localStorage.setItem("movieskey", JSON.stringify(newWatchList));
    setWatchlist(newWatchList);
    console.log(newWatchList);
  };

  useEffect(() => {
    let MOviesInLocalStorage = localStorage.getItem("movieskey");
    if (!MOviesInLocalStorage) {
      return;
    }
    setWatchlist(JSON.parse(MOviesInLocalStorage));
  }, []);

  let handleRemoveFromWatchlist = (movieObj) => {
    let FilterWatchlist = watchlist.filter((movie) => movie.id !== movieObj.id);
    setWatchlist(FilterWatchlist);
    localStorage.setItem("movieskey", JSON.stringify(FilterWatchlist));
  };

  return (
    <div>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/Login" element={<Login />} />
          <Route path="/Register" element={<Register />}></Route>

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
            path="/Watchlist"
            element={
              <Watchlist
                watchlist={watchlist}
                handleRemoveFromWatchlist={handleRemoveFromWatchlist}
                setWatchlist={setWatchlist}
              />
            }
          />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
