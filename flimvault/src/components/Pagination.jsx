import React from "react";

function Pagination({ handlePageClick, pageNo, totalPages }) {
  const getPageNumbers = () => {
    const pages = [];

    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (pageNo <= 4) {
        pages.push(1, 2, 3, 4, 5, "...", totalPages);
      } else if (pageNo >= totalPages - 3) {
        pages.push(1, "...", totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
      } else {
        pages.push(
          1,
          "...",
          pageNo - 1,
          pageNo,
          pageNo + 1,
          "...",
          totalPages
        );
      }
    }

    return pages;
  };

  const pageNumbers = getPageNumbers();

  return (
    <div className="bg-gray-400 flex justify-center p-4 mt-8 gap-4 text-xl font-semibold flex-wrap">
      {pageNumbers.map((number, index) => (
        <div
          key={index}
          className={`
            px-4 py-2 rounded 
            ${number === pageNo ? "bg-blue-600 text-white" : "hover:bg-gray-200 cursor-pointer"} 
            ${number === "..." ? "cursor-default hover:bg-transparent" : ""}
          `}
          onClick={() => typeof number === "number" && handlePageClick(number)}
        >
          {number}
        </div>
      ))}
    </div>
  );
}

export default Pagination;
