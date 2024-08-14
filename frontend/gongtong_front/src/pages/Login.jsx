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
import {
  pushApiErrorNotification,
  pushNotification,
} from "../components/common/Toast";

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

      if (response.status === 200) {
        const accessToken = response.data.data.accessToken;
        const refreshToken = response.data.data.refreshToken;
        document.cookie = `accessToken=${accessToken}; path=/; SameSite=Lax`;
        document.cookie = `refreshToken=${refreshToken}; path=/; SameSite=Lax`;
        nav("/");
      }
    } catch (e) {
      const status = e.response.status;

      if (status === 401) {
        pushNotification("error", "입력하신 비밀번호가 일치하지 않습니다.");
      } else if (status === 500) {
        pushNotification(
          "error",
          "입력하신 아이디에 해당하는 사용자가 없습니다."
        );
      } else {
        pushApiErrorNotification(e);
      }
    }
  };

  return (
    <div
      className="font-nanum h-screen flex justify-center items-center bg-cover bg-center" // <- 여기
      style={{ backgroundImage: `url(/images/loginImages/login_bg.png)` }} // <- 여기
    >
      <div className="w-1/2"></div>
      <div className="w-1/2 flex h-full">
        <Card
          color="transparent"
          shadow={false}
          className="flex flex-col p-8 bg-white rounded-none shadow-lg w-full"
        >
          <Typography color="blue-gray" className="font-nanum">
            Welcome !, Bienvenue!, ようこそ!, Welkom!, स्वागत है!
          </Typography>
          <Typography
            variant="h4"
            color="blue-gray"
            className="font-nanum mt-5"
          >
            로그인
          </Typography>
          <Typography color="blue-gray" className="font-nanum mt-2 mb-10">
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
            <Typography
              color="blue-gray"
              className="font-nanum text-sm text-center mt-20"
            >
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
