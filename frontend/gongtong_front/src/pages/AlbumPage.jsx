import { useEffect, useRef, useState } from "react";
import { DndProvider } from "react-dnd/dist";
import { HTML5Backend } from "react-dnd-html5-backend/dist";
import AlbumSort from "./../components/Album/AlbumSort";
import AlbumDetail from "./../components/Album/AlbumDetail";
import CountryFlags from "./../common/components/CountryFlags";
import useAlbumStore from "./../store/AlbumStore";

const AlbumPage = () => {
  const [open, setOpen] = useState(false);
  const { albumLists, fetchAlbumLists, hasMoreContent } = useAlbumStore();
  const [countryCode, setCountryCode] = useState();
  const [countryName, setCountryName] = useState();
  const [folderId, setFolderId] = useState(null);
  const [page, setPage] = useState(0);
  const observerRef = useRef(null);

  useEffect(() => {
    fetchAlbumLists(0, countryCode);
  }, [countryCode]);

  useEffect(() => {
    if (page !== 0) {
      fetchAlbumLists(page, countryCode);
    }
  }, [page, countryCode]);

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
      <div className="w-9/12 mx-auto mt-24">
        <div className="flex justify-between items-center mb-8">
          {!countryCode && (
            <div className="text-3xl font-extrabold flex items-baseline gap-x-2 ">
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
          {albumLists.map((album) => (
            <img
              key={album.folderId}
              src={album.mainImgUrl}
              className=" rounded-3xl"
              onClick={() => {
                setFolderId(album.folderId);
                setOpen(true);
              }}
            />
          ))}
        </div>
        <DndProvider backend={HTML5Backend}>
          <AlbumDetail open={open} setOpen={setOpen} folderId={folderId} />
        </DndProvider>
      </div>
      <div ref={observerRef} id="observer" style={{ height: "10px" }}></div>
    </>
  );
};
export default AlbumPage;
