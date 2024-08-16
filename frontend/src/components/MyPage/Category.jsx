import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import instalogo from "../../assets/MyPage/insta.png";
import youtubelogo from "../../assets/MyPage/Youtube.png";
import useMyPageStore from "../../store/MyPageStore";
import ProfileButton from "../../common/components/ProfileButton";
import CountryFlags from "../../common/components/CountryFlags";
import Imageprofile from "../../assets/MyPage/기본프로필사진.jpg";

const Category = () => {
  const nav = useNavigate();
  const informations = useMyPageStore((state) => state.informations);
  const fetchInformations = useMyPageStore((state) => state.fetchInformations);

  useEffect(() => {
    fetchInformations();
  }, [fetchInformations]);

  return (
    <div className="grid grid-cols-4 gap">
      <div className="flex-shrink-0 col-span-1">
        <br />
        <div className="flex flex-col">
          <div className="flex w-96">
            <ProfileButton
              image={informations.profileImageUrl}
              type="rounded"
              size="lg"
              onClick={() => nav("/mypage")}
            />
            &nbsp;&nbsp;
            <div className="flex flex-col mt-2">
              <CountryFlags
                countryCode={informations.country?.countryCode}
                size="w-5"
              />

              <p className="text-base ml-1 mt-1">{informations.nickname}</p>
              <p className="text-base text-gray-700 ml-1 mt-1">
                {informations.description || ""}
              </p>
            </div>
          </div>
          <div className="flex justify-around mt-2">
            <div className="flex">
              <img src={instalogo} alt="인스타로고" className="size-6" />
              &nbsp;&nbsp;
              <a
                className="text-base text-gray-700"
                href={informations.instagramUrl}
              >
                {informations.instagramHandle || ""}
              </a>
            </div>
            &nbsp;&nbsp;&nbsp;&nbsp;
            <div className="flex">
              <img src={youtubelogo} alt="유튜브로고" className="size-6" />
              &nbsp;&nbsp;
              <a
                className="text-base text-gray-700"
                href={informations.youtubeUrl}
              >
                {informations.youtubeHandle || ""}
              </a>
            </div>
          </div>
        </div>
        <br />
        <br />
        <ul>
          <li className="font-bold text-2xl mb-1">클래스</li>
          <hr className="border border-first mb-2" />
          <div>
            <NavLink
              to="reserve"
              className={({ isActive }) => (isActive ? "bg-first-100 " : "")}
            >
              <div className="bg-inherit text-lg my-1">예약한 클래스</div>
            </NavLink>
          </div>
          <li>
            <NavLink
              to="teach"
              className={({ isActive }) => (isActive ? "bg-first-100 " : "")}
            >
              <div className="bg-inherit text-lg my-1">수업할 클래스</div>
            </NavLink>
          </li>
          <li>
            <NavLink
              to="attend"
              className={({ isActive }) => (isActive ? "bg-first-100 " : "")}
            >
              <div className="bg-inherit text-lg my-1">참여한 클래스</div>
            </NavLink>
          </li>
        </ul>

        <br />
        <br />
        <ul className=" flex flex-col">
          <li className="font-bold text-2xl mb-1">나의 활동</li>
          <hr className="border border-first mb-2" />

          <li>
            <NavLink
              to=""
              end
              className={({ isActive }) => (isActive ? "bg-first-100 " : "")}
            >
              <div className="bg-inherit text-lg my-1">내 정보</div>
            </NavLink>
          </li>
          <li>
            <NavLink
              to="point"
              className={({ isActive }) => (isActive ? "bg-first-100 " : "")}
            >
              <div className="bg-inherit text-lg my-1">마일리지</div>
            </NavLink>
          </li>
        </ul>
      </div>
      <div className="m-8 ml-36 justify-center col-span-3">
        <Outlet />
      </div>
    </div>
  );
};

export default Category;
