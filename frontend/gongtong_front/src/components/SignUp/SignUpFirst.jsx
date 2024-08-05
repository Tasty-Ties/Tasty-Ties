import { useState } from "react";
import { useNavigate } from "react-router-dom";
import userStore from "../../store/UserStore";
import axios from "../../service/Axios";

const SignUpFirst = () => {
  const nav = useNavigate();
  const { userForm, setForm } = userStore();

  const [lengthValid, setLengthValid] = useState(null);
  const [charValid, setCharValid] = useState(null);
  const [isEmailAvailable, setIsEmailAvailable] = useState(null);
  const [Emailvalid, setEmailvalid] = useState(null);
  const [isUsernameAvailable, setIsUsernameAvailable] = useState(null);
  const [isPwLengthValid, setPwLengthValid] = useState(null);
  const [isPwCharValid, setPwCharValid] = useState(null);
  const [passwordMatch, setPasswordMatch] = useState(null);

  const onChangeInput = (e) => {
    let name = e.target.name;
    let value = e.target.value;

    setForm(name, value);

    if (name === "email") {
      validateEmail(value);
      if (Emailvalid === true) {
        setForm("emailId", value.substring(0, value.indexOf("@")));
        setForm("emailDomain", value.substring(value.indexOf("@") + 1));
      }
    } else if (name === "username") {
      validateUsername(value);
    } else if (name === "password") {
      validatePassword(value);
    } else if (name === "verifyPassword") {
      passwordDoubleCheck(userForm.password, value);
    }
  };

  const validateEmail = (email) => {
    const isEmailCharValid =
      /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+\.[a-zA-Z]{2,}$/.test(
        email
      );

    setEmailvalid(isEmailCharValid);
  };

  const validateUsername = (username) => {
    const isIdLengthValid = username.length >= 4 && username.length <= 20;
    const isIdCharValid = /^(?=.*[A-Za-z])(?=.*\d)/.test(username);

    setLengthValid(isIdLengthValid);
    setCharValid(isIdCharValid);
  };

  const validatePassword = (password) => {
    const isPwLengthValid = password.length >= 8 && password.length <= 20;
    const isPwCharValid = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])/.test(
      password
    );

    setPwLengthValid(isPwLengthValid);
    setPwCharValid(isPwCharValid);
  };

  const passwordDoubleCheck = (password, verifyPassword) => {
    const isPasswordMatch = password === verifyPassword;
    setPasswordMatch(isPasswordMatch);
  };

  const checkEmail = async () => {
    if (Emailvalid === false) {
      setIsEmailAvailable(false);
      return;
    }

    try {
      const emailId = userForm.email.substring(0, userForm.email.indexOf("@"));
      const emailDomain = userForm.email.substring(
        userForm.email.indexOf("@") + 1
      );

      const response = await axios.get(
        `/users/check-email?email_id=${emailId}&email_domain=${emailDomain}`
      );
      if (response.data.stateCode === 200) {
        setIsEmailAvailable(true);
      } else {
        setIsEmailAvailable(false);
      }
    } catch (error) {
      if (error.response && error.response.status === 409) {
        setIsEmailAvailable(false);
        setForm("email", "");
      } else {
        console.log(error);
      }
    }
  };

  const checkUsername = async () => {
    try {
      const response = await axios.get(
        `/users/check-username?username=${userForm.username}`
      );
      if (response.data.stateCode === 200) {
        setIsUsernameAvailable(true);
      } else {
        setIsUsernameAvailable(false);
      }
    } catch (error) {
      if (error.response && error.response.status === 409) {
        setIsUsernameAvailable(false);
        setForm("username", "");
      } else {
        console.log(error);
      }
    }
  };

  return (
    <>
      <section>
        <div>이메일</div>
        <input
          name="email"
          value={userForm.email}
          onChange={onChangeInput}
          placeholder="ssafy@abc.com"
        ></input>
        {userForm.email !== "" && Emailvalid === false && (
          <div className="emailfail-message">
            이메일은 형식에 맞게 입력해주세요.
          </div>
        )}
        {isEmailAvailable === true && (
          <div className="emailsuccess-message">
            사용할 수 있는 이메일입니다.
          </div>
        )}
        {isEmailAvailable === false && (
          <div className="emailfail-message2">이미 사용된 이메일입니다.</div>
        )}
        <button onClick={checkEmail}>인증</button>
      </section>

      <section>
        <div>아이디</div>
        <input
          name="username"
          value={userForm.username}
          onChange={onChangeInput}
        ></input>
        {userForm.username !== "" &&
          (lengthValid === false || charValid === false) && (
            <div className="idfail-message">
              아이디는 영문,숫자를 조합하여 4~20글자로 입력해주세요.
            </div>
          )}

        {isUsernameAvailable === true && (
          <div className="idsuccess-message">사용할 수 있는 아이디입니다.</div>
        )}
        {isUsernameAvailable === false && (
          <div className="idfail-message2">이미 사용된 아이디입니다.</div>
        )}
        <button onClick={checkUsername}>중복확인</button>
      </section>

      <section>
        <div>비밀번호</div>
        <input
          name="password"
          type="password"
          value={userForm.password}
          onChange={onChangeInput}
        ></input>
        {userForm.password !== "" &&
          (isPwLengthValid === false || isPwCharValid === false) && (
            <div className="pwfail-message">
              비밀번호는 영문,숫자,특수기호를 조합해 8~20글자로 입력해주세요.
            </div>
          )}
      </section>

      <div>비밀번호 확인</div>
      <input
        name="verifyPassword"
        type="password"
        value={userForm.verifyPassword}
        onChange={onChangeInput}
      ></input>
      {userForm.verifyPassword !== "" && passwordMatch === false && (
        <div className="pwmatchfail-message">비밀번호와 일치하지 않습니다.</div>
      )}
      <button onClick={() => nav("/signupfin")}>→</button>
    </>
  );
};

export default SignUpFirst;
