import { useState } from "react";
import { useNavigate } from "react-router-dom";
import userStore from "../../store/UserStore";
import axios from "axios";

const SignUpFirst = () => {
  const nav = useNavigate();

  const { userForm, setForm, resetForm } = userStore((state) => ({
    userForm: state.userForm,
    setForm: state.setForm,
    // resetForm: state.resetForm,
  }));

  const [lengthValid, setLengthValid] = useState(null);
  const [charValid, setCharValid] = useState(null);
  const [isUsernameAvailable, setIsUsernameAvailable] = useState(null);

  const onChangeInput = (e) => {
    let name = e.target.name;
    let value = e.target.value;

    setForm(name, value);

    if (name === "username") {
      validateUsername(value);
    }
  };

  const validateUsername = (username) => {
    const isLengthValid = username.length >= 4 && username.length <= 20;
    const isCharValid = /^[a-zA-Z0-9]+$/.test(username);

    setLengthValid(isLengthValid);
    setCharValid(isCharValid);
  };

  const checkUsername = async () => {
    if (lengthValid && charValid) {
      try {
        const response = await axios.get(
          `http://localhost:8080/api/v1/users?username=${userForm.username}`
        );
        if (response.data.available) {
          setIsUsernameAvailable(true);
        } else {
          setIsUsernameAvailable(false);
        }
      } catch (error) {
        console.log(error);
      }
    }
  };

  // useEffect(() => {
  //   return () => {
  //     resetForm();
  //     console.log(userForm);
  //   };
  // }, []);

  return (
    <>
      <section>
        <div>이메일</div>
        <input
          name="email"
          value={userForm.email}
          onChange={onChangeInput}
        ></input>
        <button>인증</button>
      </section>

      <section>
        <div>아이디</div>
        <input
          name="username"
          value={userForm.username}
          onChange={onChangeInput}
        ></input>
        {lengthValid === false && (
          <div className="idfail-message">
            아이디는 4~20글자로 입력해주세요.
          </div>
        )}
        {charValid === false && (
          <div className="idfail-message2">영어 또는 숫자만 입력해주세요.</div>
        )}
        {isUsernameAvailable === true && (
          <div className="success-message">사용할 수 있는 아이디입니다.</div>
        )}
        {isUsernameAvailable === false && (
          <div className="success-message">이미 사용된 아이디입니다.</div>
        )}
        <button onClick={checkUsername}>중복확인</button>
      </section>

      <div>비밀번호</div>
      <input
        name="password"
        value={userForm.password}
        onChange={onChangeInput}
      ></input>
      <div>비밀번호 확인</div>
      <input
        name="verifyPassword"
        value={userForm.verifyPassword}
        onChange={onChangeInput}
      ></input>
      <button onClick={() => nav("/signupfin")}>→</button>
    </>
  );
};

export default SignUpFirst;
