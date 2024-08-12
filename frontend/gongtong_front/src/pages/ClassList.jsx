import { useEffect, useState, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import ClassListItem from "./../components/ClassList/ClassListItem";
import SearchBar from "./../components/ClassList/SearchBar";
import useCookingClassStore from "./../store/CookingClassStore";
import Cookies from "js-cookie";

const ClassList = () => {
  const { classLists, hasMoreContent, getClassLists } = useCookingClassStore();
  const [page, setPage] = useState(0);
  const observerRef = useRef(null);
  const [searchParams, setSearchParams] = useState({
    sort: "createTime,desc",
  });
  const isLoading = useRef(false);
  const location = useLocation();

  let cookie = Cookies.get("accessToken");

  useEffect(() => {
    console.log(searchParams);
    setPage(0);
    fetchClassListData(0, searchParams);
  }, [location]);

  const handleSearch = (searchParams) => {
    setSearchParams(searchParams);
    setPage(0);
    fetchClassListData(0, searchParams);
  };

  const fetchClassListData = async (page, params) => {
    if (isLoading.current) return;

    isLoading.current = true;

    try {
      const searchResults = await getClassLists(page, params);
      useCookingClassStore.setState((state) => ({
        classLists:
          page === 0 ? searchResults : [...state.classLists, ...searchResults],
        hasMoreContent: searchResults.length === 12,
      }));
    } catch (error) {
      console.error("Failed to fetch class list data", error);
    } finally {
      isLoading.current = false;
    }
  };

  useEffect(() => {
    if (page > 0) {
      fetchClassListData(page, searchParams);
    }
  }, [page]);

  useEffect(() => {
    const handleObserver = (entries) => {
      const target = entries[0];
      if (target.isIntersecting && hasMoreContent && !isLoading.current) {
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
      <div className="w-2/3 mt-16 mx-auto content-center relative">
        <SearchBar onSearch={handleSearch} />
        <hr className="mt-10" />
        <div className="mt-10 grid grid-cols-4 gap-6">
          {classLists.length > 0 ? (
            classLists.map((content, index) => (
              <div key={index}>
                <Link to={`/class/${content.uuid}`}>
                  <ClassListItem content={content} />
                </Link>
              </div>
            ))
          ) : (
            <div className="mt-20 col-span-4 text-4xl text-center text-gray-500">
              <div>
                <img
                  src="/images/classImages/alert.svg"
                  className="mx-auto w-16 mb-5"
                />
              </div>
              <div>검색 결과가 없습니다.</div>
            </div>
          )}
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
