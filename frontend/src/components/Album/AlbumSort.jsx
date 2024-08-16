import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";

import useAlbumStore from "./../../store/AlbumStore";
import { useEffect, useState } from "react";

const AlbumSort = ({ setCountryCode, setCountryName }) => {
  const [title, setTitle] = useState();
  const { albumSortLists, fetchAlbumSortLists } = useAlbumStore((state) => ({
    albumSortLists: state.albumSortLists,
    fetchAlbumSortLists: state.fetchAlbumSortLists,
  }));

  useEffect(() => {
    fetchAlbumSortLists();
  }, []);

  const handleAlbumFilter = (alpha2, koreanName) => {
    setCountryCode(alpha2);
    setCountryName(koreanName);
  };

  return (
    <Menu as="div" className="relative inline-block text-left">
      <div>
        <MenuButton className="inline-flex w-full justify-center gap-x-1.5 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 items-center">
          {title || "정렬"}
          <svg
            width="12"
            height="6"
            viewBox="0 0 15 9"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M1.5 1.5L7.5 7.5L13.5 1.5"
              stroke="black"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </MenuButton>
      </div>

      <MenuItems
        transition
        className="absolute right-0 z-10 mt-2 w-36 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 transition focus:outline-none data-[closed]:scale-95 data-[closed]:transform data-[closed]:opacity-0 data-[enter]:duration-100 data-[leave]:duration-75 data-[enter]:ease-out data-[leave]:ease-in"
      >
        <MenuItem>
          <a
            className="block px-4 py-1 text-sm text-gray-700 data-[focus]:bg-gray-100 data-[focus]:text-gray-900 cursor-pointer"
            onClick={() => {
              handleAlbumFilter(null, null);
              setTitle("전체보기");
            }}
          >
            전체보기
          </a>
        </MenuItem>
        {albumSortLists &&
          albumSortLists.map((country, index) => (
            <div className="py-1" key={index}>
              <MenuItem>
                <a
                  className="block px-4 py-1 text-sm text-gray-700 data-[focus]:bg-gray-100 data-[focus]:text-gray-900 cursor-pointer"
                  onClick={() => {
                    handleAlbumFilter(country.alpha2, country.koreanName);
                    setTitle(country.koreanName);
                  }}
                >
                  {country.koreanName}
                </a>
              </MenuItem>
            </div>
          ))}
      </MenuItems>
    </Menu>
  );
};

export default AlbumSort;
