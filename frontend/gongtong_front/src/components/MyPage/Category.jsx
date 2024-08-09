import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import instalogo from "../../assets/MyPage/insta.png";
import youtubelogo from "../../assets/MyPage/Youtube.png";
import useMyPageStore from "../../store/MyPageStore";
import ProfileButton from "../../common/components/ProfileButton";
import CountryFlags from "../../common/components/CountryFlags";

const Category = () => {
  const nav = useNavigate();
  const informations = useMyPageStore((state) => state.informations);
  const fetchInformations = useMyPageStore((state) => state.fetchInformations);

  useEffect(() => {
    fetchInformations();
  }, [fetchInformations]);

  return (
    <div className="flex">
      <div className="w-60">
        <br />
        <div className="flex flex-col">
          <div className="flex">
            <ProfileButton
              image={informations.profileImageUrl}
              type="square"
              size="size-16"
              onClick={() => nav("/mypage")}
            />
            &nbsp;&nbsp;
            <div className="flex flex-col mt-2">
              <p>
                <CountryFlags
                  countryCode={informations.country?.countryCode}
                  size="w-5"
                />
              </p>
              <p className="text-sm ml-1 mt-1">이름:{informations.nickname}</p>
              <p className="text-sm ml-1 mt-1">
                자기소개:{informations.description}
              </p>
            </div>
          </div>
          <div className="flex mt-1">
            <p className="flex">
              <img src={instalogo} alt="인스타로고" className="size-6" />
              &nbsp;
              <p className="text-sm">{informations.instagramHandle}</p>
            </p>
            &nbsp;&nbsp;
            <p className="flex">
              <img src={youtubelogo} alt="유튜브로고" className="size-6" />
              &nbsp;
              <p className="text-sm">{informations.youtubeHandle}</p>
            </p>
          </div>
        </div>
        <br />
        <hr />
        <ul>
          <li className="font-bold text-xl">클래스</li>
          <hr className="border border-first" />
          <div>
            <NavLink
              to="reserve"
              className={({ isActive }) => (isActive ? "bg-first-100 " : "")}
            >
              <div className="bg-inherit">예약한 클래스</div>
            </NavLink>
          </div>
          <li>
            <NavLink
              to="teach"
              className={({ isActive }) => (isActive ? "bg-first-100 " : "")}
            >
              <div className="bg-inherit">수업할 클래스</div>
            </NavLink>
          </li>
          <li>
            <NavLink
              to="attend"
              className={({ isActive }) => (isActive ? "bg-first-100 " : "")}
            >
              <div className="bg-inherit">참여한 클래스</div>
            </NavLink>
          </li>
        </ul>

        <br />
        <ul className=" flex flex-col">
          <li className="font-bold text-xl">나의 활동</li>
          <hr className="border border-first" />

          <li>
            <NavLink
              to=""
              end
              className={({ isActive }) => (isActive ? "bg-first-100 " : "")}
            >
              <div className="bg-inherit">내 정보</div>
            </NavLink>
          </li>
          <li>
            <NavLink
              to="point"
              className={({ isActive }) => (isActive ? "bg-first-100 " : "")}
            >
              <div className="bg-inherit">마일리지</div>
            </NavLink>
          </li>
          <li>
            <NavLink
              to="shorts"
              className={({ isActive }) => (isActive ? "bg-first-100 " : "")}
            >
              <div className="bg-inherit">숏폼</div>
            </NavLink>
          </li>
        </ul>
      </div>
      <div>
        <Outlet />
      </div>
    </div>
  );
};

export default Category;
