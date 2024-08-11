import { NavLink, Outlet } from "react-router-dom";
import instalogo from "../../assets/MyPage/insta.png";
import youtubelogo from "../../assets/MyPage/Youtube.png";
import CountryFlags from "../../common/components/CountryFlags";
import ProfileButton from "../../common/components/ProfileButton";

const OtherCategory = (informations) => {
  const information = informations.informations;
  console.log(information);

  return (
    <div className="flex">
      <div className="w-56">
        <br />
        <div className="flex flex-col">
          {information.userProfileDto && (
            <div className="flex">
              <ProfileButton
                image={information.userProfileDto.profileImageUrl}
                type="square"
                size="size-16"
              />
              &nbsp;&nbsp;
              <div className="flex flex-col mt-2">
                <p>
                  <CountryFlags
                    countryCode={
                      information.userProfileDto.country?.countryCode
                    }
                    size="w-5"
                  />
                </p>

                <p className="text-sm ml-1 mt-1">
                  {information.userProfileDto?.nickname}
                </p>
                <p className="text-sm ml-1 mt-1">
                  {information.userProfileDto?.description}
                </p>
              </div>
            </div>
          )}
          <div className="flex mt-1">
            <p className="flex">
              <img src={instalogo} alt="인스타로고" className="size-6" />
              &nbsp;
              <p className="text-sm">
                {information.userProfileDto?.instagramHandle}
              </p>
              &nbsp;&nbsp;
              <img src={youtubelogo} alt="유튜브로고" className="size-6" />
              &nbsp;
              <p className="text-sm">
                {information.userProfileDto?.youtubeHandle}
              </p>
            </p>
          </div>
        </div>

        <br />
        <hr />
        <ul>
          <li>
            <NavLink
              to=""
              end
              className={({ isActive }) => (isActive ? "bg-first-100 " : "")}
            >
              <div className="bg-inherit">홈</div>
            </NavLink>
          </li>
          <li>
            <NavLink
              to="teach"
              className={({ isActive }) => (isActive ? "bg-first-100 " : "")}
            >
              <div className="bg-inherit">진행한 클래스</div>
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
          <li>
            <NavLink
              to="review"
              className={({ isActive }) => (isActive ? "bg-first-100 " : "")}
            >
              <div className="bg-inherit">수강평</div>
            </NavLink>
          </li>
        </ul>
        <br />
      </div>
      <div className="m-8 ml-36">
        <Outlet
          context={{
            informations: informations,
          }}
        />
      </div>
    </div>
  );
};

export default OtherCategory;
