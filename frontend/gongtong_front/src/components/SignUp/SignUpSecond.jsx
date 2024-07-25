import { useNavigate } from "react-router-dom";
import userStore from "../../store/UserStore";
import axios from "axios";

const SignUpSecond = () => {
  const nav = useNavigate();
  const userRegister = async (e) => {
    e.preventDefault();
    if (userForm.email.includes("@")) {
      userForm.emailId = userForm.email.substring(
        0,
        userForm.email.indexOf("@")
      );
      userForm.emailDomain = userForm.email.substring(
        userForm.email.indexOf("@") + 1
      );
      console.log(userForm.emailId);
      console.log(userForm.emailDomain);
    }
    try {
      const response = axios.post("http://localhost:8080/api/v1/users", {
        username: userForm.username,
        password: userForm.password,
        nickname: userForm.nickname,
        countryCode: userForm.countryCode,
        languageCode: userForm.languageCode,
        emailId: userForm.emailId,
        emailDomain: userForm.emailDomain,
        birth: userForm.birth,
      });
      console.log(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const { userForm, setForm, resetForm } = userStore((state) => ({
    userForm: state.userForm,
    setForm: state.setForm,
    // resetForm: state.resetForm,
  }));

  const onChangeInput = (e) => {
    let name = e.target.name;
    let value = e.target.value;

    setForm(name, value);
  };

  return (
    <>
      <div>닉네임</div>
      <input
        name="nickname"
        value={userForm.nickname}
        onChange={onChangeInput}
      ></input>
      <div>국적</div>
      <input
        name="countryCode"
        value={userForm.countryCode}
        onChange={onChangeInput}
      ></input>
      <div>모국어</div>
      <input
        name="languageCode"
        value={userForm.languageCode}
        onChange={onChangeInput}
      ></input>
      <div>생년월일</div>
      <input
        name="birth"
        value={userForm.birth}
        onChange={onChangeInput}
      ></input>
      <button onClick={userRegister}>Register</button>
    </>
  );
};

export default SignUpSecond;
