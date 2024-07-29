import React, { useState } from "react";
import useApiStore from "../store/ApiStore";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const { baseURL } = useApiStore();
  const nav = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const response = await fetch(`${baseURL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    });

    if (response.ok) {
      const data = await response.json();
      console.log("Access Token:", data.data.accessToken);
      console.log("Refresh Token:", data.data.refreshToken);
      document.cookie = `accessToken=${data.data.accessToken}; path=/; SameSite=Lax`;
      document.cookie = `refreshToken=${data.data.refreshToken}; path=/; SameSite=Lax`;
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
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Username"
          required
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          required
        />
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default Login;
