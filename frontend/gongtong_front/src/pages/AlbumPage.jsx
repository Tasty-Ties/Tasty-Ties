import { useEffect, useRef, useState } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import AlbumSort from "./../components/Album/AlbumSort";
import AlbumDetail from "./../components/Album/AlbumDetail";
import CountryFlags from "./../common/components/CountryFlags";
import useAlbumStore from "./../store/AlbumStore";
import Button from "../common/components/Button";
import { useNavigate } from "react-router-dom";

const AlbumPage = () => {
  const [open, setOpen] = useState(false);
  const { albumLists, fetchAlbumLists, hasMoreContent } = useAlbumStore();
  const [countryCode, setCountryCode] = useState(null);
  const [countryName, setCountryName] = useState(null);
  const [folderId, setFolderId] = useState(null);
  const [page, setPage] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const observerRef = useRef(null);
  const navigate = useNavigate();

  const isInitialLoad = useRef(true);

  useEffect(() => {
    const loadAlbums = async () => {
      setIsLoading(true);
      await fetchAlbumLists(page, countryCode);
      setIsLoading(false);
      isInitialLoad.current = false;
    };

    if (!isLoading && (page === 0 || hasMoreContent)) {
      loadAlbums();
    }
  }, [page, countryCode, fetchAlbumLists, hasMoreContent]);

  useEffect(() => {
    const handleObserver = (entries) => {
      const target = entries[0];
      if (target.isIntersecting && !isLoading && hasMoreContent) {
        setPage((prev) => prev + 1);
      }
    };

    const options = {
      root: null,
      rootMargin: "0px",
      threshold: 1.0,
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
  }, [isLoading, hasMoreContent]);

  return (
    <>
      <div className="w-9/12 mx-auto mt-24">
        <div className="flex justify-between items-center mb-8">
          {!countryCode && (
            <div className="text-3xl font-extrabold flex items-baseline gap-x-2">
              <p>전체보기</p>
            </div>
          )}
          {countryCode && (
            <CountryFlags
              countryCode={countryCode}
              countryName={countryName}
              size={"w-8"}
            />
          )}
          <div>
            <AlbumSort
              setCountryCode={setCountryCode}
              setCountryName={setCountryName}
            />
          </div>
        </div>
        <div className="grid grid-cols-4 gap-5">
          {albumLists.length > 0 ? (
            albumLists.map((album) => (
              <img
                key={album.folderId}
                src={album.mainImgUrl}
                className="rounded-3xl w-full h-48"
                onClick={() => {
                  setFolderId(album.folderId);
                  setOpen(true);
                }}
              />
            ))
          ) : (
            <>
              <div className="mt-20 col-span-4 text-center text-gray-500">
                <div>
                  <img
                    src="/images/classImages/alert.svg"
                    className="mx-auto w-12 mb-5"
                  />
                </div>
                <div className="mb-5 text-2xl ">
                  앨범 목록이 존재하지 않습니다.
                </div>
                <div className="">
                  <Button
                    text="앨범 만들러 가기"
                    type="green-short"
                    onClick={() => {
                      navigate("/class");
                    }}
                  />
                </div>
              </div>
            </>
          )}
        </div>
        <DndProvider backend={HTML5Backend}>
          <AlbumDetail open={open} setOpen={setOpen} folderId={folderId} />
        </DndProvider>
      </div>
      <div ref={observerRef} id="observer" style={{ height: "10px" }}></div>
      {isLoading && (
        <div className="loading-spinner">Loading...</div> // 로딩 중일 때 표시
      )}
    </>
  );
};

export default AlbumPage;
