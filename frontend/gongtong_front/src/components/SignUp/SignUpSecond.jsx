import { useNavigate } from "react-router-dom";
import userStore from "../../store/UserStore";

const SignUpSecond = () => {
  const nav = useNavigate();
  const userRegister = () => {
    console.log(userForm);
  };

  const { userForm, setForm, resetForm } = userStore((state) => ({
    userForm: state.userForm,
    setForm: state.setForm,
    resetForm: state.resetForm,
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
        name="nationality"
        value={userForm.nationality}
        onChange={onChangeInput}
      ></input>
      <div>모국어</div>
      <input
        name="language"
        value={userForm.language}
        onChange={onChangeInput}
      ></input>
      <div>생년월일</div>
      <input
        name="birthDate"
        value={userForm.birthDate}
        onChange={onChangeInput}
      ></input>
      <button onClick={userRegister}>Register</button>
    </>
  );
};

export default SignUpSecond;
