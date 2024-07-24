import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import userStore from "../../store/UserStore";
const SignUpFirst = () => {
  const nav = useNavigate();

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

  // useEffect(() => {
  //   return () => {
  //     resetForm();
  //     console.log(userForm);
  //   };
  // }, []);

  return (
    <>
      <div>이메일</div>
      <input
        name="email"
        value={userForm.email}
        onChange={onChangeInput}
      ></input>
      <div>아이디</div>
      <input
        name="userId"
        value={userForm.userId}
        onChange={onChangeInput}
      ></input>
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
