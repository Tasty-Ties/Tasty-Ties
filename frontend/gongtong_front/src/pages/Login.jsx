import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../service/Api";
import Cookies from "js-cookie";
import { getFcmToken } from "../firebase/firebaseCloudMessaging";

import {
  Card,
  Input,
  Checkbox,
  Button,
  Typography,
} from "@material-tailwind/react";

const Login = () => {
  const nav = useNavigate();

  const [input, setInput] = useState({
    username: "",
    password: "",
  });

  const onChangeInput = (e) => {
    setInput({
      ...input,
      [e.target.name]: e.target.value,
    });
  };

  useEffect(() => {
    if (
      Cookies.get("fcmToken") === undefined &&
      Notification.permission === "granted"
    ) {
      getFcmToken();
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post("/auth/login", {
        username: input.username,
        password: input.password,
        fcmToken: Cookies.get("fcmToken"),
      });
      console.log(response);

      if (response.status === 200) {
        const accessToken = response.data.data.accessToken;
        const refreshToken = response.data.data.refreshToken;
        document.cookie = `accessToken=${accessToken}; path=/; SameSite=Lax`;
        document.cookie = `refreshToken=${refreshToken}; path=/; SameSite=Lax`;
        nav("/");
      }
    } catch (error) {
      console.log(error);
      if (error.response.status === 401) {
        alert("아이디 또는 비밀번호가 잘못되었습니다.");
      } else if (error.response.status === 500) {
        alert("탈퇴한 사용자입니다.");
      } else {
        alert("인증 오류가 발생했습니다.");
      }
    }
  };

  return (
    <div
      className="h-screen flex justify-center items-center bg-cover bg-center" // <- 여기
      style={{ backgroundImage: `url(/images/loginImages/login_bg.png)` }} // <- 여기
    >
      <div className="w-1/2"></div>
      <div className="w-1/2 flex h-full">
        <Card
          color="transparent"
          shadow={false}
          className="flex flex-col p-8 bg-white rounded-none shadow-lg w-full"
        >
          <Typography color="blue-gray">
            Welcome !, Bienvenue!, ようこそ!, Welkom!, स्वागत है!
          </Typography>
          <Typography variant="h4" color="blue-gray" className="mt-5">
            로그인
          </Typography>
          <Typography color="blue-gray" className="mt-2 mb-10">
            맛,잇다의 세계로 들어와 다양한 문화의 음식을 즐겨보세요!!
          </Typography>
          <form onSubmit={handleSubmit}>
            <div className="text-md font-semibold text-gray-700 mb-2 mt-4">
              아이디
            </div>
            <Input
              type="text"
              name="username"
              value={input.username}
              onChange={onChangeInput}
              placeholder="Username"
              required
              className="h-14"
            />
            <div className="text-md font-semibold text-gray-700 mb-2 mt-8">
              비밀번호
            </div>
            <Input
              type="password"
              name="password"
              value={input.password}
              onChange={onChangeInput}
              placeholder="Password"
              required
              className="h-14"
            />
            <div className="mt-5 mb-5"> </div>
            <Button className="bg-first mt-20" type="submit" fullWidth={true}>
              Login
            </Button>
            <Typography color="blue-gray" className="text-sm text-center mt-20">
              아직 맛,잇다의 회원이 아니신가요?{" "}
              <span
                className="font-bold text-black cursor-pointer"
                onClick={() => nav("/signup")}
              >
                지금 가입 하세요!
              </span>
            </Typography>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default Login;
