import React from "react";
import { Link } from "react-router-dom";
import useAuthStore from "../store/AuthStore";
import logo from "../assets/맛잇다로고.png";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";

const Header = () => {
  const nav = useNavigate();
  const { logout } = useAuthStore();
  const handleLogout = () => {
    // Remove FCM token
    Cookies.remove("fcmToken");

    logout();
    nav("/");
  };

  return (
    <div style={{ height: "50px", display: "flex" }}>
      <Link to="/">
        <img src={logo} alt="맛잇다로고" />
      </Link>
      <div>
        {Cookies.get("accessToken") && <Link to="/album">앨범 |</Link>}
        <Link to="">숏폼 |</Link> <Link to="/ranking">랭킹 |</Link>
        <Link to="/class">쿠킹클래스 |</Link>
        {!Cookies.get("accessToken") && <Link to="/signup">회원가입 |</Link>}
        {Cookies.get("accessToken") && <Link to="">메신저 |</Link>}
        {Cookies.get("accessToken") ? (
          <button onClick={handleLogout}>로그아웃 |</button>
        ) : (
          <Link to="/login">로그인 |</Link>
        )}
        {Cookies.get("accessToken") && <Link to="">알람 |</Link>}
        {Cookies.get("accessToken") && <Link to="/mypage">마이페이지 |</Link>}
      </div>
    </div>
  );
};
export default Header;
