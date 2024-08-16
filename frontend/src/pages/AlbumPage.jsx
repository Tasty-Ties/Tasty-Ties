import { useEffect, useRef, useState } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import AlbumSort from "./../components/Album/AlbumSort";
import AlbumDetail from "./../components/Album/AlbumDetail";
import CountryFlags from "./../common/components/CountryFlags";
import Button from "../common/components/Button";
import { useNavigate } from "react-router-dom";
import { pushApiErrorNotification } from "../components/common/Toast";
import AlbumPagination from "../components/Album/AlbumPagination";
import { useSearchParams } from "react-router-dom";
import { getAlbums } from "../service/AlbumAPI";

const AlbumPage = () => {
  const [open, setOpen] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const [countryCode, setCountryCode] = useState(null);
  const [albumLists, setAlbumLists] = useState([]);
  const [countryName, setCountryName] = useState(null);
  const [folderId, setFolderId] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPage, setTotalPage] = useState(0);
  const navigate = useNavigate();
  const [country, setCountry] = useState(
    searchParams.get("countryCode") || null
  );
  const currentPage = parseInt(searchParams.get("page") || "1", 10);
  const pageCount = 12;

  const fetchAlbumLists = async (page, countryCode) => {
    try {
      const response = await getAlbums(page, countryCode);
      setAlbumLists(response.folderListDtoPage.content);
      setTotalPage(response.folderListDtoPage.totalPages);
    } catch (e) {
      pushApiErrorNotification(e);
    }
  };

  useEffect(() => {
    setPage(currentPage);
    try {
      fetchAlbumLists(currentPage, countryCode);
    } catch (e) {
      pushApiErrorNotification(e);
    }
  }, [currentPage, countryCode]);

  return (
    <>
      <div className="w-9/12 mx-auto mt-14">
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
          {albumLists ? (
            albumLists.map((album) => (
              <img
                key={album.folderId}
                src={album.mainImgUrl}
                className="rounded-3xl w-full h-48 cursor-pointer"
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
        <div className="my-10">
          <AlbumPagination
            pageCount={pageCount}
            currentPage={currentPage}
            totalPage={totalPage}
          />
        </div>
        <DndProvider backend={HTML5Backend}>
          <AlbumDetail open={open} setOpen={setOpen} folderId={folderId} />
        </DndProvider>
      </div>
    </>
  );
};

export default AlbumPage;
