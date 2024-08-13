import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useUserStore from "../../store/UserStore";
import api from "../../service/Api";

import {
  Card,
  Input,
  Checkbox,
  Button,
  Typography,
  MenuItem,
  Select,
  Option,
} from "@material-tailwind/react";

const SignUpSecond = () => {
  const nav = useNavigate();

  const userRegister = async (e) => {
    e.preventDefault();
    console.log("회원정보", userForm);
    try {
      const response = await api.post("/users", {
        username: userForm.username,
        password: userForm.password,
        nickname: userForm.nickname,
        countryCode: userForm.countryCode,
        languageCode: userForm.languageCode,
        emailId: userForm.emailId,
        emailDomain: userForm.emailDomain,
        birth: userForm.birth,
      });
      console.log(response);
      try {
        const nextResponse = await api.post("/ranking/addByUsername", {
          username: userForm.username,
          score: "100.0",
          description: "회원가입 감사 마일리지",
        });
        console.log(nextResponse);
      } catch (error) {
        console.log("마일리지더하기실패", error);
      }
      nav("/SignUpComplete");
    } catch (error) {
      console.log(error);
    }
  };

  const { userForm, setForm, resetForm } = useUserStore();

  useEffect(() => {
    console.log("첫번째 넘어오는 정보", userForm);
    return () => {
      resetForm(["nickname", "countryCode", "languageCode", "birth"]);
    };
  }, [resetForm]);

  const [isNicknameAvailable, setIsNicknameAvailable] = useState("");

  const onChangeInput = (e) => {
    console.log("test:", e);
    let name = e.target.name;
    let value = e.target.value;

    if (name === "nickname") {
      setIsNicknameAvailable("");
    }

    if (name === "countryCode" || name === "languageCode") {
      setForm(name, e);
    } else {
      setForm(name, value);
    }
    console.log(userForm);
  };

  const checkNickname = async () => {
    try {
      const response = await api.get(
        `/users/check-nickname?nickname=${userForm.nickname}`
      );
      console.log(response);
      if (response.data.stateCode === 200) {
        setIsNicknameAvailable(true);
      } else {
        setIsNicknameAvailable(false);
      }
    } catch (error) {
      if (error.response && error.response.status === 409) {
        setIsNicknameAvailable(false);
        setForm("nickname");
      } else {
        console.log(error);
      }
    }
  };

  const [countries, setCountries] = useState([]);
  const [languages, setLanguages] = useState([]);

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const response = await api.get("/countries");
        console.log(response.data.data);
        const sortedCountries = response.data.data.countries.sort((a, b) => {
          return a.koreanName.localeCompare(b.koreanName, "KR", {
            sensitivity: "base",
          });
        });
        setCountries(sortedCountries);
      } catch (error) {
        console.log("국가 목록을 불러오는 중 에러 발생:", error);
      }
    };

    const fetchLanguages = async () => {
      try {
        const response = await api.get(`/languages`);
        console.log(response.data.data);
        const sortedLanguages = response.data.data.languages.sort((a, b) => {
          return a.koreanName.localeCompare(b.koreanName, "kr", {
            sensitivity: "base",
          });
        });
        setLanguages(sortedLanguages);
      } catch (error) {
        console.log("언어 목록을 불러오는 중 에러 발생:", error);
      }
    };

    fetchCountries();
    fetchLanguages();
  }, []);

  const [value, setValue] = useState("react");

  useEffect(() => {
    console.log(userForm);
  }, [userForm]);

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
          {" "}
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
              닉네임
            </div>
            <div className="flex items-center gap-2">
              <Input
                name="nickname"
                value={userForm.nickname}
                onChange={onChangeInput}
              ></Input>
              <Button
                variant="outlined"
                onClick={checkNickname}
                className="h-full whitespace-nowrap w-32 border-green-900"
              >
                중복체크
              </Button>
            </div>
            {isNicknameAvailable === true && (
              <Typography color="green" className="text-sm success-message">
                사용할 수 있는 닉네임입니다.
              </Typography>
            )}
            {isNicknameAvailable === false && (
              <Typography color="red" className="text-sm nickname-fail-message">
                이미 사용된 닉네임입니다.
              </Typography>
            )}
          </section>
          <div className="text-md font-semibold text-gray-700 mb-2 mt-4">
            국적
          </div>
          <Select
            name="countryCode"
            value=""
            label="국적을 선택하세요"
            className="relative"
            onChange={(val) => {
              setForm("countryCode", val);
            }}
          >
            {countries.map((country) => (
              <Option key={country.countryCode} value={country.countryCode}>
                {country.koreanName}
              </Option>
            ))}
          </Select>
          <div className="text-md font-semibold text-gray-700 mb-2 mt-4">
            모국어
          </div>
          <Select
            name="languageCode"
            value=""
            label="모국어를 선택하세요"
            onChange={(val) => {
              setForm("languageCode", val);
            }}
          >
            {languages.map((language) => (
              <Option key={language.languageCode} value={language.languageCode}>
                {language.koreanName}
              </Option>
            ))}
          </Select>
          <div className="text-md font-semibold text-gray-700 mb-2 mt-4">
            생년월일
          </div>
          <Input
            name="birth"
            type="date"
            value={userForm.birth}
            onChange={onChangeInput}
          ></Input>
          <Button className="bg-first mt-5" onClick={() => nav("/signup")}>
            이전
          </Button>
          <Button className="bg-second mt-5" onClick={userRegister}>
            회원가입
          </Button>
        </Card>
      </div>
    </div>
  );
};

export default SignUpSecond;
