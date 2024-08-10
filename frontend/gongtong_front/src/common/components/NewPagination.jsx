import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const NewPagination = ({
  totalItems,
  itemCountPerPage,
  pageCount,
  currentPage,
  setCurrentPage,
}) => {
  const totalPages = Math.ceil(totalItems / itemCountPerPage);
  const [start, setStart] = useState(1);
  const noPrev = start === 1;
  const noNext = start + pageCount - 1 >= totalPages;

  useEffect(() => {
    if (currentPage === start + pageCount) setStart((prev) => prev + pageCount);
    if (currentPage < start) setStart((prev) => prev - pageCount);
  }, [currentPage, pageCount, start]);

  return (
    <div className="flex flex-row justify-center items-center mt-8 text-gray-500 text-sm">
      <ul className="list-none flex">
        <li
          className={`relative cursor-pointer mx-2 ${
            noPrev ? "invisible" : ""
          }`}
          onClick={() => setCurrentPage(start - 1)}
        >
          <span className="block w-12 text-center py-1">이전</span>
        </li>
        {[...Array(pageCount)].map((_, i) => (
          <li key={i} className="relative">
            {start + i <= totalPages && (
              <span
                onClick={() => setCurrentPage(start + i)}
                className={`block w-6 h-6 flex items-center justify-center mx-1 rounded-full cursor-pointer border text-center ${
                  currentPage === start + i
                    ? "bg-teal-700 text-white font-semibold border-teal-700"
                    : "border-transparent"
                } hover:border-gray-400`}
              >
                {start + i}
              </span>
            )}
          </li>
        ))}
        <li
          className={`relative cursor-pointer mx-2 ${
            noNext ? "invisible" : ""
          }`}
          onClick={() => setCurrentPage(start + pageCount)}
        >
          <span className="block w-12 text-center py-1">다음</span>
        </li>
      </ul>
    </div>
  );
};

export default NewPagination;
