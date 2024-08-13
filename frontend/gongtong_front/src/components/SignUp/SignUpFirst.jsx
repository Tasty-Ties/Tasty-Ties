import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import userStore from "../../store/UserStore";
import api from "../../service/Api";

import {
  Card,
  Input,
  Checkbox,
  Button,
  Typography,
} from "@material-tailwind/react";

const SignUpFirst = () => {
  const nav = useNavigate();
  const { userForm, setForm, resetForm } = userStore();

  useEffect(() => {
    return () => {
      resetForm();
    };
  }, [resetForm]);

  const [lengthValid, setLengthValid] = useState("");
  const [charValid, setCharValid] = useState("");
  const [isEmailAvailable, setIsEmailAvailable] = useState("");
  const [Emailvalid, setEmailvalid] = useState("");
  const [isUsernameAvailable, setIsUsernameAvailable] = useState("");
  const [isPwLengthValid, setPwLengthValid] = useState("");
  const [isPwCharValid, setPwCharValid] = useState("");
  const [passwordMatch, setPasswordMatch] = useState("");

  const onChangeInput = (e) => {
    let name = e.target.name;
    let value = e.target.value;

    if (name === "email") {
      setIsEmailAvailable("");
    }
    if (name === "username") {
      setIsUsernameAvailable("");
    }

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

      const response = await api.get(
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
      const response = await api.get(
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
          {/* <- 여기 추가 */}
          <Typography color="blue-gray">
            Welcome !, Bienvenue!, ようこそ!, Welkom!, स्वागत है!
          </Typography>
          <Typography variant="h4" color="blue-gray" className="mt-5">
            회원가입
          </Typography>
          <Typography color="blue-gray" className="mt-2">
            맛,잇다의 세계로 들어와 다양한 문화의 음식을 즐겨보세요!!
          </Typography>
          <section>
            <div className="text-md font-semibold text-gray-700 mb-2 mt-10">
              이메일
            </div>
            <div className="flex items-center gap-2">
              <Input
                name="email"
                value={userForm.email}
                onChange={onChangeInput}
                placeholder="ssafy@abc.com"
              ></Input>
              <Button
                variant="outlined"
                onClick={checkEmail}
                className="h-full whitespace-nowrap w-32 border-green-900"
              >
                인증
              </Button>
            </div>
            {userForm.email !== "" && Emailvalid === false && (
              <Typography color="red" className="text-sm emailfail-message">
                이메일은 형식에 맞게 입력해주세요.
              </Typography>
            )}
            {isEmailAvailable === true && (
              <Typography
                color="green"
                className="text-sm emailsuccess-message"
              >
                사용할 수 있는 이메일입니다.
              </Typography>
            )}
            {isEmailAvailable === false && (
              <Typography color="red" className="emailfail-message2">
                이미 사용된 이메일입니다.
              </Typography>
            )}
          </section>
          <section>
            <div className="text-md font-semibold text-gray-700 mb-2 mt-4">
              아이디
            </div>
            <div className="flex items-center gap-2">
              <Input
                name="username"
                value={userForm.username}
                onChange={onChangeInput}
                placeholder="아이디를 입력하세요"
              ></Input>
              <Button
                variant="outlined"
                onClick={checkUsername}
                className="h-full whitespace-nowrap border-green-900 w-32"
              >
                중복확인
              </Button>
            </div>
            {userForm.username !== "" &&
              (lengthValid === false || charValid === false) && (
                <div className="idfail-message">
                  아이디는 영문,숫자를 조합하여 4~20글자로 입력해주세요.
                </div>
              )}

            {isUsernameAvailable === true && (
              <Typography color="green" className="text-sm idsuccess-message">
                사용할 수 있는 아이디입니다.
              </Typography>
            )}
            {isUsernameAvailable === false && (
              <Typography color="red" className="text-sm idfail-message2">
                이미 사용된 아이디입니다.
              </Typography>
            )}
          </section>
          <section>
            <div className="text-md font-semibold text-gray-700 mb-2 mt-4">
              비밀번호
            </div>
            <Input
              name="password"
              type="password"
              value={userForm.password}
              onChange={onChangeInput}
              placeholder="비밀번호를 입력하세요"
            ></Input>
            {userForm.password !== "" &&
              (isPwLengthValid === false || isPwCharValid === false) && (
                <Typography color="red" className="pwfail-message">
                  비밀번호는 영문,숫자,특수기호를 조합해 8~20글자로
                  입력해주세요.
                </Typography>
              )}
          </section>
          <div className="text-md font-semibold text-gray-700 mb-2 mt-4">
            비밀번호 확인
          </div>
          <Input
            name="verifyPassword"
            type="password"
            value={userForm.verifyPassword}
            onChange={onChangeInput}
          ></Input>
          {userForm.verifyPassword !== "" && passwordMatch === false && (
            <Typography color="red" className="pwmatchfail-message">
              비밀번호와 일치하지 않습니다.
            </Typography>
          )}
          <div className="mb-5"></div>
          <Button
            className="bg-first mt-10 "
            onClick={() => nav("/signupfin", console.log(userForm))}
          >
            다음
          </Button>
        </Card>
      </div>
    </div>
  );
};

export default SignUpFirst;
