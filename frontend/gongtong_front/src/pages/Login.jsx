import { useState } from "react";
import useApiStore from "../store/ApiStore";
import useAuthStore from "../store/AuthStore";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Login = () => {
  const { baseURL } = useApiStore();
  const { login } = useAuthStore();
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    const response = await axios.post(`${baseURL}/auth/login`, {
      username: input.username,
      password: input.password,
    });
    console.log(response);
    if (response.status === 200) {
      const accessToken = response.data.data.accessToken;
      const refreshToken = response.data.data.refreshToken;
      console.log("Access Token:", accessToken);
      console.log("Refresh Token:", refreshToken);
      document.cookie = `accessToken=${accessToken}; path=/; SameSite=Lax`;
      document.cookie = `refreshToken=${refreshToken}; path=/; SameSite=Lax`;
      login(accessToken, refreshToken);
      nav("/");
    } else if (response.status === 401) {
      alert("아이디 또는 비밀번호가 잘못되었습니다.");
    } else {
      alert("인증 오류가 발생했습니다.");
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="username"
          value={input.username}
          onChange={onChangeInput}
          placeholder="Username"
          required
        />
        <input
          type="password"
          name="password"
          value={input.password}
          onChange={onChangeInput}
          placeholder="Password"
          required
        />
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default Login;
