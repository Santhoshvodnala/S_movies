import React from "react";

function MovieCard({
  poster_path,
  name,
  handleWatchList,
  movieObj,
  watchlist,
  handleRemoveFromWatchlist,
}) {
  const inWatchlist = watchlist.some((m) => m.id === movieObj.id);

  return (
    <div
      className="relative h-[50vh] w-60 ml-2 mr-2 bg-cover bg-center hover:scale-110 duration-300 hover:cursor-pointer rounded-lg shadow-md group"
      style={{ backgroundImage: `url(https://image.tmdb.org/t/p/original/${poster_path})` }}
    >
      
      <div className="absolute top-2 left-2 z-20">
        <div className="relative">
          <div
            onClick={() =>
              inWatchlist ? handleRemoveFromWatchlist(movieObj) : handleWatchList(movieObj)
            }
            className="bg-gray-900/60 w-8 h-8 rounded-lg flex items-center justify-center text-white text-sm cursor-pointer select-none peer"
            aria-label={inWatchlist ? "Remove from Watchlist" : "Add to Watchlist"}
          >
            {inWatchlist ? "❌" : "😁"}
          </div>

          
          <div className="absolute -top-2 left-10 -translate-y-full bg-black text-white text-xs px-2 py-1 rounded opacity-0 peer-hover:opacity-100 transition-opacity whitespace-nowrap z-30">
            {inWatchlist ? "Remove from Watchlist" : "Add to Watchlist"}
          </div>
        </div>
      </div>


      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none group-hover:pointer-events-auto z-10">
        <button className="bg-red-600 text-white p-4 rounded-full text-2xl shadow-lg hover:scale-110 transition">
          ▶
        </button>
      </div>


      <div className="absolute bottom-0 w-full bg-gray-800/70 text-white text-center p-2 text-sm rounded-b-lg z-10">
        {name}
      </div>
    </div>
  );
}

export default MovieCard;
