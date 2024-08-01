import { Link } from "react-router-dom";
import useAuthStore from "../store/AuthStore";

const Header = () => {
  const { logout } = useAuthStore();

  return (
    <div style={{ height: "50px" }}>
      <Link to="/classregist">등록</Link> | <Link to="/class">리스트</Link> |
      <Link to="/">홈</Link> |<Link to="/signup">회원가입</Link> |
      <Link to="/login">로그인</Link> |{" "}
      <button onClick={logout}>로그아웃</button>
      {/* <Link to="/classdetail">상세</Link> */}
    </div>
  );
};
export default Header;
