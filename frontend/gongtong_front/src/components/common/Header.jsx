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
import logo from "../../assets/맛잇다로고3.png";
import NotificationButton from "../Notification/NotificationButton";

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
      <NavItem text="숏폼" link="" />
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

  useEffect(() => {
    if (accessToken) {
      setIsLogin(true);
    } else {
      setIsLogin(false);
    }
  }, [accessToken]);

  const goLogin = () => {
    nav("/login");
  };

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
    } catch (error) {
      console.log(error);
    }

    Cookies.remove("accessToken");
    Cookies.remove("refreshToken");
    // Remove FCM token
    Cookies.remove("fcmToken");
    nav("/");
  };

  return (
    <Navbar className="sticky top-0 z-10 h-max max-w-full rounded-none px-6 py-2 lg:px-8 lg:py-4">
      <div className="flex items-center justify-between text-blue-gray-900">
        <Link to="/">
          <img src={logo} alt="맛잇다로고"  className="w-28 h-auto"/>
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
                    <Avatar
                      src="https://docs.material-tailwind.com/img/face-2.jpg"
                      alt="avatar"
                      size="sm"
                    />
                  </MenuHandler>
                  <MenuList>
                    <MenuItem onClick={goMypage}>마이페이지</MenuItem>
                    <MenuItem onClick={handleLogout}>로그아웃</MenuItem>
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
