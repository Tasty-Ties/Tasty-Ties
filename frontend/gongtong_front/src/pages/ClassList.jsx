import { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";

import ClassItem from "@components/ClassList/ClassListItem";
import ClassListSearch from "@components/ClassList/ClassListSearch";

import useClassRegistStore from "../store/ClassRegistStore";
import "@styles/ClassList/ClassList.css";

const FRONT_SERVER_URL = import.meta.env.VITE_FRONT_SERVER;

const ClassList = () => {
  const { classLists, fetchClassLists, hasMoreContent } = useClassRegistStore();
  const [page, setPage] = useState(0);
  const observerRef = useRef(null);

  useEffect(() => {
    const fetchClassListData = async () => {
      if (hasMoreContent) {
        fetchClassLists(page);
      }
    };
    fetchClassListData();
  }, [page, hasMoreContent]);

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
      threshold: 0.1,
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
      <div className="classlist-components-box">
        <ClassListSearch />
        <div className="classlist-item-box">
          {classLists &&
            classLists.map((content, index) => (
              <div key={index}>
                <Link to={`/class/${content.uuid}`}>
                  <ClassItem content={content} />
                </Link>
              </div>
            ))}
        </div>
      </div>
      <div ref={observerRef} id="observer" style={{ height: "10px" }}></div>
      <Link to="/classregist" className="add-class-button">
        <img
          src={`${FRONT_SERVER_URL}/images/classImages/add-icon.png`}
          alt="요리클래스 등록하기"
        />
      </Link>
    </>
  );
};

export default ClassList;
