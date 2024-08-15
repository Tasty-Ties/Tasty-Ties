import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import {
  Navbar,
  Button,
  Typography,
  Avatar,
  Menu,
  MenuHandler,
  MenuList,
  MenuItem,
  IconButton,
} from "@material-tailwind/react";

import api from "../../service/Api";
import NotificationButton from "../Notification/NotificationButton";
import useMyPageStore from "../../store/MyPageStore";
import profileimage from "../../assets/MyPage/기본프로필사진.jpg";
import { pushApiErrorNotification, pushNotification } from "./Toast";

const NavItem = ({ text, link }) => {
  return (
    <Typography as="li" variant="small" color="blue-gray" className="p-1 font-normal">
      <Link to={link} className="flex items-center">
        {text}
      </Link>
    </Typography>
  );
};

const NavList = () => {
  return (
    <>
      <NavItem text="쿠킹클래스" link="/class" />
      {/* <NavItem text="숏폼" link="" /> */}
      <NavItem text="랭킹" link="/ranking" />
    </>
  );
};

const NavListWithLogin = () => {
  return (
    <>
      <NavItem text="앨범" link="/album" />
      <NavItem text="메신저" link="/chatting" />
    </>
  );
};

const Header = () => {
  const nav = useNavigate();

  const [isLogin, setIsLogin] = useState(false);

  const accessToken = Cookies.get("accessToken");

  const informations = useMyPageStore((state) => state.informations);
  const fetchInformations = useMyPageStore((state) => state.fetchInformations);

  useEffect(() => {
    if (accessToken) {
      setIsLogin(true);
    } else {
      setIsLogin(false);
    }
    fetchInformations();
  }, [accessToken]);

  const goLogin = () => {
    nav("/login");
  };

  const profileImage = informations?.profileImageUrl || profileimage;

  const nickname = informations?.nickname;

  const goMypage = () => {
    nav("/mypage");
  };

  const goSignup = () => {
    nav("/signup");
  };

  const handleLogout = async () => {
    try {
      const response = await api.post("/auth/logout");
      console.log(response);
    } catch (e) {
      pushApiErrorNotification(e);
    }

    Cookies.remove("accessToken");
    Cookies.remove("refreshToken");
    // Remove FCM token
    Cookies.remove("fcmToken");
    nav("/");
  };

  return (
    <Navbar className="sticky top-0 z-10 h-max max-w-full rounded-none px-52 py-2 lg:px-8 lg:py-4">
      <div className="flex items-center justify-between text-blue-gray-900 my-3">
        <Link to="/">
          <img src="/logo.png" alt="맛잇다로고" className="w-auto h-10" />
        </Link>
        <div className="flex items-center gap-4">
          <div className="flex items-center mr-4 lg:block">
            <ul className="flex mb-0 mt-0 flex-row items-center gap-6">
              <NavList />
              {isLogin && <NavListWithLogin />}
            </ul>
          </div>
          <div className="flex items-center gap-x-1">
            {isLogin ? (
              <>
                <NotificationButton />
                <Menu>
                  <MenuHandler className="hover:scale-105 cursor-pointer">
                    <Avatar src={profileImage} alt="avatar" size="sm" />
                  </MenuHandler>
                  <MenuList className="mt-5">
                    <MenuItem className="flex justify-center font-nanum">{nickname}</MenuItem>
                    <hr className="my-3" />
                    <MenuItem className="font-nanum" onClick={goMypage}>
                      마이페이지
                    </MenuItem>
                    <MenuItem className="font-nanum" onClick={handleLogout}>
                      로그아웃
                    </MenuItem>
                  </MenuList>
                </Menu>
              </>
            ) : (
              <>
                <Button variant="text" size="sm" className="lg:inline-block" onClick={goLogin}>
                  <span>로그인</span>
                </Button>
                <Button variant="outlined" size="sm" className="lg:inline-block" onClick={goSignup}>
                  <span>회원가입</span>
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </Navbar>
  );
};
export default Header;
