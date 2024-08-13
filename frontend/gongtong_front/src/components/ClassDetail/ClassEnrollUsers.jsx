import { Menu } from "@headlessui/react";
import React from "react";
import { Link } from "react-router-dom";

const ClassEnrollUsers = ({ classDetail }) => {
  return (
    <Menu as="div" className="relative text-left">
      <Menu.Button className="inline-flex w-full justify-center gap-x-1.5 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900">
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M0 20V17.225C0 16.6583 0.141667 16.1333 0.425 15.65C0.708333 15.1667 1.1 14.8 1.6 14.55C1.83333 14.4333 2.05833 14.325 2.275 14.225C2.50833 14.125 2.75 14.0333 3 13.95V20H0ZM4 13C3.16667 13 2.45833 12.7083 1.875 12.125C1.29167 11.5417 1 10.8333 1 10C1 9.16667 1.29167 8.45833 1.875 7.875C2.45833 7.29167 3.16667 7 4 7C4.83333 7 5.54167 7.29167 6.125 7.875C6.70833 8.45833 7 9.16667 7 10C7 10.8333 6.70833 11.5417 6.125 12.125C5.54167 12.7083 4.83333 13 4 13ZM4 11C4.28333 11 4.51667 10.9083 4.7 10.725C4.9 10.525 5 10.2833 5 10C5 9.71667 4.9 9.48333 4.7 9.3C4.51667 9.1 4.28333 9 4 9C3.71667 9 3.475 9.1 3.275 9.3C3.09167 9.48333 3 9.71667 3 10C3 10.2833 3.09167 10.525 3.275 10.725C3.475 10.9083 3.71667 11 4 11ZM4 20V17.2C4 16.6333 4.14167 16.1167 4.425 15.65C4.725 15.1667 5.11667 14.8 5.6 14.55C6.63333 14.0333 7.68333 13.65 8.75 13.4C9.81667 13.1333 10.9 13 12 13C13.1 13 14.1833 13.1333 15.25 13.4C16.3167 13.65 17.3667 14.0333 18.4 14.55C18.8833 14.8 19.2667 15.1667 19.55 15.65C19.85 16.1167 20 16.6333 20 17.2V20H4ZM6 18H18V17.2C18 17.0167 17.95 16.85 17.85 16.7C17.7667 16.55 17.65 16.4333 17.5 16.35C16.6 15.9 15.6917 15.5667 14.775 15.35C13.8583 15.1167 12.9333 15 12 15C11.0667 15 10.1417 15.1167 9.225 15.35C8.30833 15.5667 7.4 15.9 6.5 16.35C6.35 16.4333 6.225 16.55 6.125 16.7C6.04167 16.85 6 17.0167 6 17.2V18ZM12 12C10.9 12 9.95833 11.6083 9.175 10.825C8.39167 10.0417 8 9.1 8 8C8 6.9 8.39167 5.95833 9.175 5.175C9.95833 4.39167 10.9 4 12 4C13.1 4 14.0417 4.39167 14.825 5.175C15.6083 5.95833 16 6.9 16 8C16 9.1 15.6083 10.0417 14.825 10.825C14.0417 11.6083 13.1 12 12 12ZM12 10C12.55 10 13.0167 9.80833 13.4 9.425C13.8 9.025 14 8.55 14 8C14 7.45 13.8 6.98333 13.4 6.6C13.0167 6.2 12.55 6 12 6C11.45 6 10.975 6.2 10.575 6.6C10.1917 6.98333 10 7.45 10 8C10 8.55 10.1917 9.025 10.575 9.425C10.975 9.80833 11.45 10 12 10ZM20 13C19.1667 13 18.4583 12.7083 17.875 12.125C17.2917 11.5417 17 10.8333 17 10C17 9.16667 17.2917 8.45833 17.875 7.875C18.4583 7.29167 19.1667 7 20 7C20.8333 7 21.5417 7.29167 22.125 7.875C22.7083 8.45833 23 9.16667 23 10C23 10.8333 22.7083 11.5417 22.125 12.125C21.5417 12.7083 20.8333 13 20 13ZM20 11C20.2833 11 20.5167 10.9083 20.7 10.725C20.9 10.525 21 10.2833 21 10C21 9.71667 20.9 9.48333 20.7 9.3C20.5167 9.1 20.2833 9 20 9C19.7167 9 19.475 9.1 19.275 9.3C19.0917 9.48333 19 9.71667 19 10C19 10.2833 19.0917 10.525 19.275 10.725C19.475 10.9083 19.7167 11 20 11ZM21 20V13.95C21.25 14.0333 21.4833 14.125 21.7 14.225C21.9333 14.325 22.1667 14.4333 22.4 14.55C22.9 14.8 23.2917 15.1667 23.575 15.65C23.8583 16.1333 24 16.6583 24 17.225V20H21Z"
            fill="#000"
          />
        </svg>

        <span>
          {classDetail.reservedCount}/{classDetail.quota}
        </span>
      </Menu.Button>
      {(classDetail.userEnrolled || classDetail.host) &&
        classDetail.userProfiles?.length > 0 && (
          <Menu.Items className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 transition focus:outline-none data-[closed]:scale-95 data-[closed]:transform data-[closed]:opacity-0 data-[enter]:duration-100 data-[leave]:duration-75 data-[enter]:ease-out data-[leave]:ease-in">
            {classDetail.userProfiles &&
              classDetail.userProfiles.length > 0 &&
              classDetail.userProfiles.map((userProfile, index) => (
                <Menu.Item
                  key={index}
                  className="block px-4 py-2 text-sm text-gray-700 data-[focus]:bg-gray-100 data-[focus]:text-gray-900"
                >
                  {({ active }) => (
                    <Link
                      to={`/otherpage/${userProfile.username}`} // 여기에 이동할 주소 입력
                      className={`block px-4 py-2 text-sm ${
                        active ? "bg-blue-100" : ""
                      }`}
                    >
                      <div className="flex items-center">
                        <img
                          src={userProfile.profileImageUrl}
                          alt={userProfile.username}
                          className="w-6 h-6 rounded-full mr-2"
                        />
                        <span>{userProfile.username}</span>
                      </div>
                    </Link>
                  )}
                </Menu.Item>
              ))}
          </Menu.Items>
        )}
    </Menu>
  );
};

export default ClassEnrollUsers;
