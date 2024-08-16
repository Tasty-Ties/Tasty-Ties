import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const Pagination = ({
  totalItems,
  itemCountPerPage,
  pageCount,
  currentPage,
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
        >
          <Link
            to={`?page=${start - 1}`}
            className="block w-12 text-center py-1"
          >
            이전
          </Link>
        </li>
        {[...Array(pageCount)].map((_, i) => (
          <li key={i} className="relative">
            {start + i <= totalPages && (
              <Link
                to={`?page=${start + i}`}
                className={`block w-6 h-6 flex items-center justify-center mx-1 rounded-full cursor-pointer border text-center ${
                  currentPage === start + i
                    ? "bg-teal-700 text-white font-semibold border-teal-700"
                    : "border-transparent"
                } hover:border-gray-400`}
              >
                {start + i}
              </Link>
            )}
          </li>
        ))}
        <li
          className={`relative cursor-pointer mx-2 ${
            noNext ? "invisible" : ""
          }`}
        >
          <Link
            to={`?page=${start + pageCount}`}
            className="block w-12 text-center py-1"
          >
            다음
          </Link>
        </li>
      </ul>
    </div>
  );
};
export default Pagination;
