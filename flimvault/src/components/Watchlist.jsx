import React, { useState } from "react";

import genre_ids  from "../Utility/Genre";

function Watchlist({ watchlist, handleRemoveFromWatchlist, setWatchlist }) {
  const [search, setSearch] = useState("");

  let handleSearch = (e) => {
    setSearch(e.target.value);
  };

  let sortIncrease = () => {
    let add = watchlist.sort((movieA, movieB) => {
      return movieA.vote_average - movieB.vote_average;
    });
    setWatchlist([...add]);
  };

  let sortDecrease = () => {
    let addWatch = watchlist.sort((movieA, movieB) => {
      return movieB.vote_average - movieA.vote_average;
    });
    setWatchlist([...addWatch]);
  };
   
   let highPopularity=()=>{
   let high= watchlist.sort((movieA,movieB)=>{
      return movieA.popularity-movieB.popularity
    });
    setWatchlist([...high])
   }

      let lowPopularity=()=>{
   let low= watchlist.sort((movieA,movieB)=>{
      return movieB.popularity-movieA.popularity
    });
    setWatchlist([...low])
   }


  return (
    <>
      <div className="flex justify-center my-6 rounded-lg ">
        <input
          onChange={handleSearch}
          type="text"
          placeholder="Search Movie"
          className="border border-gray-400 rounded px-4 py-2 w-[300px] focus:outline-none focus:ring-2 focus:ring-blue-500 "
        />
      </div>

      <div className="overflow-hidden border border-gray-200 my-8 rounded">
        <table className="w-full text-gray-700 text-left border-collapse">
          <thead>
            <tr className=" border-b-2 border-gray-300">
              <th className="px-4 py-2">Name</th>

              <th className="px-4 py-2">
                <div className="flex items-center">
                  <div onClick={sortIncrease} className="px-2 cursor-pointer">
                    <i className="fa-solid fa-arrow-up"></i>
                  </div>
                  <span className="px-2">Rating</span>
                  <div onClick={sortDecrease} className="px-2 cursor-pointer">
                    <i className="fa-solid fa-arrow-down"></i>
                  </div>
                </div>
              </th>




              <th  className="flex">
                <div className="flex">
                <div onClick={highPopularity} className="p-2"><i className="fa-solid fa-arrow-up"></i></div>
                 <span className=" p-2">Popularity</span>
                 <div onClick={lowPopularity} className="p-2"><i className="fa-solid fa-arrow-down"></i></div>
                 </div>
                 </th>
                 
              <th className="px-4 py-2">Genre</th>
              
            </tr>
          </thead>

          <tbody>
            {watchlist
              .filter((movieObj) => {
                return movieObj.title
                  .toLowerCase()
                  .includes(search.toLocaleLowerCase());
              })
              .map((movieObj) => (
                <tr
                  className="border-b hover:bg-gray-100 overflow-hidden rounded"
                  key={movieObj.id}
                >
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-4">
                      <div className="h-15 w-40 flex-shrink-0 overflow-hidden rounded">
                        <img
                          src={`https://image.tmdb.org/t/p/original/${movieObj.poster_path}`}
                          alt={movieObj.original_title}
                          className="h-full w-full object-cover object-center"
                        />
                      </div>
                      <span className="font-medium">
                        {movieObj.original_title}
                      </span>
                    </div>
                  </td>

                  <td className="px-4 py-4 justify-center">
                    {movieObj.vote_average}
                  </td>
                  <td className="px-4 py-4">{movieObj.popularity}</td>



                  <td className="px-4 py-4">{genre_ids[movieObj.genre_ids[0]]}</td>
                  <td className="px-4 py-4 text-red-500">
                    <button onClick={() => handleRemoveFromWatchlist(movieObj)}>
                      delete
                    </button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

export default Watchlist;
