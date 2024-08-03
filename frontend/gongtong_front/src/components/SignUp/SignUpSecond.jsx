import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import userStore from "../../store/UserStore";
import axios from "../../service/Axios";

const SignUpSecond = () => {
  const nav = useNavigate();

  const userRegister = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("/users", {
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
      nav("/SignUpComplete");
    } catch (error) {
      console.log(error);
    }
  };

  const { userForm, setForm } = userStore();
  const [isNicknameAvailable, setIsNicknameAvailable] = useState("");

  const onChangeInput = (e) => {
    let name = e.target.name;
    let value = e.target.value;

    setForm(name, value);
  };

  const checkNickname = async () => {
    try {
      const response = await axios.get(
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
        setForm("nickname", "");
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
        const response = await axios.get("/countries");
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
        const response = await axios.get(`/languages`);
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

  return (
    <>
      <section>
        <div>닉네임</div>
        <input
          name="nickname"
          value={userForm.nickname}
          onChange={onChangeInput}
        ></input>
        {isNicknameAvailable === true && (
          <div className="success-message">사용할 수 있는 닉네임입니다.</div>
        )}
        {isNicknameAvailable === false && (
          <div className="nickname-fail-message">이미 사용된 닉네임입니다.</div>
        )}
        <button onClick={checkNickname}>중복체크</button>
      </section>

      <div>국적</div>
      <select
        name="countryCode"
        value={userForm.countryCode}
        onChange={onChangeInput}
      >
        <option value="">국적을 선택하세요</option>
        {countries.map((country) => (
          <option key={country.countryCode} value={country.countryCode}>
            {country.koreanName}
          </option>
        ))}
      </select>

      <div>모국어</div>
      <select
        name="languageCode"
        value={userForm.languageCode}
        onChange={onChangeInput}
      >
        <option value="">모국어를 선택하세요</option>
        {languages.map((language) => (
          <option key={language.languageCode} value={language.languageCode}>
            {language.koreanName}
          </option>
        ))}
      </select>

      <div>생년월일</div>
      <input
        name="birth"
        type="date"
        value={userForm.birth}
        onChange={onChangeInput}
      ></input>
      <button onClick={userRegister}>Register</button>
    </>
  );
};

export default SignUpSecond;
