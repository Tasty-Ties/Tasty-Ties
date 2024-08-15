import { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";

const AlbumPagination = ({ pageCount, currentPage, totalPage }) => {
  const totalPages = totalPage;
  const [start, setStart] = useState(1);
  const [searchParams] = useSearchParams();
  const noPrev = start === 1;
  const noNext = start + pageCount - 1 >= totalPages;

  useEffect(() => {
    if (currentPage === start + pageCount) setStart((prev) => prev + pageCount);
    if (currentPage < start) setStart((prev) => prev - pageCount);
  }, [currentPage, pageCount, start]);

  return (
    <div className="flex justify-center items-center mt-8">
      <ul className="flex">
        <li className={`mx-1 ${noPrev ? "invisible" : ""}`}>
          <Link
            to={`?${new URLSearchParams({
              ...Object.fromEntries(searchParams),
              page: start - 1,
            })}`}
            className="px-3 py-2 rounded-md bg-gray-200 text-gray-700"
          >
            이전
          </Link>
        </li>
        {[...Array(pageCount)].map(
          (_, i) =>
            start + i <= totalPages && (
              <li key={i}>
                <Link
                  to={`?${new URLSearchParams({
                    ...Object.fromEntries(searchParams),
                    page: start + i,
                  })}`}
                  className={`px-3 py-2 rounded-full mx-0.5 ${
                    currentPage === start + i
                      ? "bg-teal-600 text-white"
                      : "bg-gray-200 text-gray-700"
                  }`}
                >
                  {start + i}
                </Link>
              </li>
            )
        )}
        <li className={`mx-1 ${noNext ? "invisible" : ""}`}>
          <Link
            to={`?${new URLSearchParams({
              ...Object.fromEntries(searchParams),
              page: start + pageCount,
            })}`}
            className="px-3 py-2 rounded-md bg-gray-200 text-gray-700"
          >
            다음
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default AlbumPagination;
