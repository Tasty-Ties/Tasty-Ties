import { useNavigate } from "react-router-dom";

const AttendeeList = ({ setOpen, users, nickname }) => {
  const defaultImage =
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRF1IwK6-SxM83UpFVY6WtUZxXx-phss_gAUfdKbkTfau6VWVkt";

  console.log("이동경로 확인이요", users);

  const nav = useNavigate();

  const toProfilePage = (user) => {
    nav(`/otherpage/${user}`);
  };

  console.log(users);

  return (
    <>
      <div className="absolute w-full h-full flex flex-row">
        <div
          className="w-2/3 h-full bg-gray-500 bg-opacity-75"
          onClick={() => setOpen(false)}
        ></div>
        <div className="w-1/3 h-full bg-white">
          <div className="bg-yellow-200 text-xl pl-5 py-2 flex flex-row justify-between">
            <p>참가자 ({users?.length})</p>
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
