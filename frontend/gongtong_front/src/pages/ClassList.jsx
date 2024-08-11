import { useEffect, useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";

import ClassListItem from "./../components/ClassList/ClassListItem";
import SearchBar from "./../components/ClassList/SearchBar";
import useCookingClassStore from "./../store/CookingClassStore";
import Cookies from "js-cookie";

const FRONT_SERVER_URL = import.meta.env.VITE_FRONT_SERVER;

const ClassList = () => {
  const navigate = useNavigate();
  const { classLists, fetchClassLists, hasMoreContent } =
    useCookingClassStore();
  const [page, setPage] = useState(0);
  const observerRef = useRef(null);

  let cookie = Cookies.get("accessToken");

  useEffect(() => {
    const fetchClassListData = async () => {
      if (hasMoreContent) {
        fetchClassLists(page);
      }
    };
    fetchClassListData();
  }, [page]);

  useEffect(() => {
    const handleObserver = (entries) => {
      const target = entries[0];
      if (target.isIntersecting && hasMoreContent) {
        setPage((prev) => prev + 1);
      }
    };

    const options = {
      root: null,
      rootMargin: "0px",
      threshold: 0.5,
    };

    const observer = new IntersectionObserver(handleObserver, options);
    if (observerRef.current) {
      observer.observe(observerRef.current);
    }

    return () => {
      if (observerRef.current) {
        observer.unobserve(observerRef.current);
      }
    };
  }, [hasMoreContent]);

  return (
    <>
      <div className="w-2/3 mt-16 mx-auto content-center relative">
        <SearchBar page={page} />
        <hr className="mt-10" />
        <div className="mt-10 grid grid-cols-4 gap-6">
          {classLists &&
            classLists.map((content, index) => (
              <div key={index}>
                <Link to={`/class/${content.uuid}`}>
                  <ClassListItem content={content} />
                </Link>
              </div>
            ))}
        </div>
      </div>
      <div ref={observerRef} id="observer" style={{ height: "10px" }}></div>
      {cookie ? (
        <Link
          to="/classregist"
          className="fixed bottom-48 right-36 float-right"
        >
          <img
            src={"/images/classImages/add-icon.svg"}
            alt="요리클래스 등록하기"
          />
        </Link>
      ) : (
        <Link to="/login" />
      )}
    </>
  );
};

export default ClassList;
