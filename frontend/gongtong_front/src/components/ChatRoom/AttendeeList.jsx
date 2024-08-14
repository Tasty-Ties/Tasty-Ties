import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import profileimage from "./../../assets/MyPage/기본프로필사진.jpg";

const AttendeeList = ({ setOpen, users, nickname, subscribers }) => {
  const defaultImage = profileimage;

  console.log(subscribers);

  const nav = useNavigate();
  const location = useLocation();

  const [isInLiveClass, setIsInLiveClass] = useState(false);

  useEffect(() => {
    if (location.pathname === "/liveclass") {
      setIsInLiveClass(true);
    }
  }, []);

  const toProfilePage = (user) => {
    nav(`/otherpage/${user}`);
  };

  console.log(users);

  return (
    <>
      <div
        className={`${
          isInLiveClass ? "" : "absolute"
        } w-full h-full flex flex-row`}
      >
        {!isInLiveClass && (
          <div
            className="w-2/3 h-full bg-gray-500 bg-opacity-75"
            onClick={() => setOpen(false)}
          ></div>
        )}
        <div
          className={`${isInLiveClass ? "w-full" : "w-1/3"} h-full bg-white`}
        >
          <div className="bg-yellow-200 text-xl pl-5 py-2 flex flex-row justify-between">
            <p>참가자 ({users ? Object.keys(users).length : 0})</p>
            <button className="px-2" onClick={() => setOpen(false)}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="size-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18 18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
          <div className="self-stretch bg-white py-3 flex flex-col">
            {users &&
              Object.values(users).map((user, i) => (
                <div
                  key={i}
                  className="flex flex-row space-y-2 py-1 px-2"
                  onClick={() => toProfilePage(user[3])}
                >
                  <img
                    alt=""
                    src={user[1] ? user[1] : defaultImage}
                    className="h-12 w-12 flex-none rounded-full self-center"
                  />
                  <div className="px-2 text-lg">
                    {user[0]} {user[2] === "HOST" ? "(호스트)" : ""}{" "}
                    {user[0] === nickname ? "(나)" : ""}
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default AttendeeList;
