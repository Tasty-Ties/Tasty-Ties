import { Dialog } from "@headlessui/react";
import { useEffect, useMemo, useState } from "react";
import DraggableImages from "./DraggableImages";
import useAlbumStore from "./../../store/AlbumStore";
import { patchAlbumImagesOrder } from "./../../service/AlbumAPI";
import defaultImage from "./../../assets/MyPage/기본프로필사진.jpg";
import { Link } from "react-router-dom";

const AlbumDetail = ({ open, setOpen, folderId }) => {
  const { albumDetailImageLists, fetchAlbumDetailImageLists, fetchAlbumLists } =
    useAlbumStore();
  const [imageList, setImageList] = useState([]);

  useEffect(() => {
    if (open) {
      fetchAlbumDetailImageLists(folderId);
    }
  }, [folderId, open]);

  useEffect(() => {
    if (
      albumDetailImageLists.photoResponse &&
      albumDetailImageLists.photoResponse.length > 0
    ) {
      const transformedImageList = albumDetailImageLists.photoResponse.map(
        (image) => ({
          id: image.photoId,
          src: image.photoImgUrl,
        })
      );
      setImageList(transformedImageList);
    }
  }, [albumDetailImageLists]);

  const hostNickname = useMemo(() => {
    return albumDetailImageLists.host
      ? albumDetailImageLists.host.nickname
      : "Unknown";
  }, [albumDetailImageLists.host]);

  const moveImage = (fromIndex, toIndex) => {
    const updateList = [...imageList];
    const [movedImage] = updateList.splice(fromIndex, 1);
    updateList.splice(toIndex, 0, movedImage);
    setImageList(updateList);
  };

  const formatImageList = (imageList) => {
    return imageList.map((image, index) => ({
      photoId: image.id,
      orderIndex: index,
    }));
  };
  const handleSave = () => {
    patchAlbumImagesOrder(folderId, formatImageList(imageList));
    location.reload();
  };

  return (
    <Dialog
      open={open}
      onClose={() => setOpen(false)}
      className="relative z-10"
    >
      <div
        className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
        aria-hidden="true"
      />
      <div className="fixed inset-0 z-10 overflow-y-auto">
        <div className="flex min-h-full items-center justify-center p-4 text-center sm:items-center sm:p-0">
          <Dialog.Panel className="max-w-md relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-md">
            <div className="absolute top-0 right-0 pt-4 pr-4">
              <button
                type="button"
                className="rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                onClick={() => setOpen(false)}
              >
                <span className="sr-only">Close</span>
                <svg
                  className="h-5 w-5"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
            <div className="bg-white mt-4 px-2 pb-4 pt-5 sm:p-6 sm:pb-4">
              <div className="sm:flex sm:items-start">
                <div className="mt-2 text-left flex justify-center">
                  <div className="mt-2 mx-3 w-5/6">
                    {imageList.length > 0 && (
                      <DraggableImages
                        key={imageList[0].id}
                        index={0}
                        image={imageList[0]}
                        moveImage={moveImage}
                      />
                    )}
                    <div className="grid grid-cols-3 gap-3 mt-3">
                      {imageList.slice(1).map((image, index) => (
                        <DraggableImages
                          key={image.id}
                          index={index + 1}
                          image={image}
                          moveImage={moveImage}
                        />
                      ))}
                    </div>
                    <p className="text-lg font-bold text-black mt-2">
                      {albumDetailImageLists.title}
                    </p>
                    <div className="text-sm font-medium text-black flex gap-x-1 items-center mt-1">
                      <p className="mr-0.5">호스트 :</p>
                      <Link
                        to={`/otherpage/${albumDetailImageLists.host?.username}`}
                        className="flex items-center gap-x-0.5"
                      >
                        <img
                          src={
                            albumDetailImageLists.host?.profileImageUrl === null
                              ? defaultImage
                              : albumDetailImageLists.host?.profileImageUrl
                          }
                          className="size-3.5 rounded-full"
                        />
                        {hostNickname}
                      </Link>
                    </div>
                    <div className="text-sm font-medium text-black flex items-center gap-x-1 mt-1">
                      <svg
                        width="14"
                        height="14"
                        viewBox="0 0 20 20"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M13.3 14.7L14.7 13.3L11 9.6V5H9V10.4L13.3 14.7ZM10 20C8.61667 20 7.31667 19.7375 6.1 19.2125C4.88333 18.6875 3.825 17.975 2.925 17.075C2.025 16.175 1.3125 15.1167 0.7875 13.9C0.2625 12.6833 0 11.3833 0 10C0 8.61667 0.2625 7.31667 0.7875 6.1C1.3125 4.88333 2.025 3.825 2.925 2.925C3.825 2.025 4.88333 1.3125 6.1 0.7875C7.31667 0.2625 8.61667 0 10 0C11.3833 0 12.6833 0.2625 13.9 0.7875C15.1167 1.3125 16.175 2.025 17.075 2.925C17.975 3.825 18.6875 4.88333 19.2125 6.1C19.7375 7.31667 20 8.61667 20 10C20 11.3833 19.7375 12.6833 19.2125 13.9C18.6875 15.1167 17.975 16.175 17.075 17.075C16.175 17.975 15.1167 18.6875 13.9 19.2125C12.6833 19.7375 11.3833 20 10 20ZM10 18C12.2167 18 14.1042 17.2208 15.6625 15.6625C17.2208 14.1042 18 12.2167 18 10C18 7.78333 17.2208 5.89583 15.6625 4.3375C14.1042 2.77917 12.2167 2 10 2C7.78333 2 5.89583 2.77917 4.3375 4.3375C2.77917 5.89583 2 7.78333 2 10C2 12.2167 2.77917 14.1042 4.3375 15.6625C5.89583 17.2208 7.78333 18 10 18Z"
                          fill="black"
                        />
                      </svg>
                      <p>
                        요리한 날짜 :
                        {albumDetailImageLists.cookingClassStartTime &&
                          albumDetailImageLists.cookingClassEndTime &&
                          `${albumDetailImageLists.cookingClassStartTime.substring(
                            0,
                            10
                          )} 
                  ${albumDetailImageLists.cookingClassStartTime.substring(
                    11,
                    16
                  )} ~ 
                  ${albumDetailImageLists.cookingClassEndTime.substring(
                    11,
                    16
                  )}`}
                      </p>
                    </div>
                    <div className="text-sm font-medium text-black flex gap-x-1 items-center mt-1">
                      <p className="mr-0.5">참여자 :</p>
                      <div className="grid grid-cols-3 items-center gap-x-2">
                        {albumDetailImageLists.userProfiles &&
                          albumDetailImageLists.userProfiles.map((profile) => (
                            <Link
                              to={`/otherpage/${profile.username}`}
                              className="flex items-center gap-x-0.5 "
                              key={profile.username}
                            >
                              <img
                                src={
                                  profile.profileImageUrl === null
                                    ? defaultImage
                                    : profile.profileImageUrl
                                }
                                className="size-3.5 rounded-full"
                              />
                              {profile.nickname}
                            </Link>
                          ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 px-4 py-3 flex flex-row-reverse sm:flex sm:flex-row-reverse sm:px-6">
              <button
                type="button"
                className="inline-flex rounded-md border border-transparent shadow-sm px-3 py-1 bg-green-900 text-base font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-800 sm:ml-3 sm:w-auto sm:text-sm"
                onClick={() => {
                  setOpen(false);
                  handleSave(imageList);
                }}
              >
                저장
              </button>
            </div>
          </Dialog.Panel>
        </div>
      </div>
    </Dialog>
  );
};

export default AlbumDetail;
