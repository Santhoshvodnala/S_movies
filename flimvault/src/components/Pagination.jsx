import React from "react";

function Pagination({
  pageNo,
  totalPages,
  handlePageClick,
  handlePre,
  handleNext,
}) {
  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;
    let start = Math.max(1, pageNo - 2);
    let end = Math.min(totalPages, start + maxVisible - 1);

    if (end - start < maxVisible - 1) {
      start = Math.max(1, end - maxVisible + 1);
    }

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    return pages;
  };

  return (
    <div className="flex items-center justify-center gap-2 flex-wrap">
      {/* Previous Button */}
      <button
        onClick={handlePre}
        disabled={pageNo === 1}
        className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 flex items-center gap-2 ${
          pageNo === 1
            ? "bg-slate-800/50 text-slate-600 cursor-not-allowed"
            : "bg-slate-800 text-slate-300 hover:bg-amber-500 hover:text-slate-900 border border-slate-700 hover:border-amber-500"
        }`}
      >
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
            d="M15 19l-7-7 7-7"
          />
        </svg>
        Prev
      </button>

      {/* Page Numbers */}
      <div className="flex items-center gap-1">
        {getPageNumbers().map((page) => (
          <button
            key={page}
            onClick={() => handlePageClick(page)}
            className={`w-10 h-10 rounded-lg font-semibold transition-all duration-300 ${
              pageNo === page
                ? "bg-gradient-to-r from-amber-500 to-orange-500 text-slate-900 shadow-lg shadow-amber-500/30"
                : "bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-700"
            }`}
          >
            {page}
          </button>
        ))}
      </div>

      {/* Next Button */}
      <button
        onClick={handleNext}
        disabled={pageNo === totalPages}
        className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 flex items-center gap-2 ${
          pageNo === totalPages
            ? "bg-slate-800/50 text-slate-600 cursor-not-allowed"
            : "bg-slate-800 text-slate-300 hover:bg-amber-500 hover:text-slate-900 border border-slate-700 hover:border-amber-500"
        }`}
      >
        Next
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
        </svg>
      </button>

      {/* Page Info */}
      <div className="ml-4 text-slate-400 text-sm hidden md:block">
        Page <span className="text-amber-400 font-semibold">{pageNo}</span> of{" "}
        <span className="text-slate-300">{totalPages}</span>
      </div>
    </div>
  );
}

export default Pagination;
