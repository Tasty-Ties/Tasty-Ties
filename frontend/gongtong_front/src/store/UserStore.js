import { create } from "zustand";

const userStore = create((set) => ({
  userForm: {
    email: "",
    userId: "",
    password: "",
    verifyPassword: "",
    nickname: "",
    nationality: "",
    language: "",
    birthDate: "",
  },
  setForm: (key, value) =>
    set((state) => ({
      userForm: {
        ...state.userForm,
        [key]: value,
      },
    })),
  resetForm: () =>
    set({
      userForm: {
        email: "",
        userId: "",
        password: "",
        verifyPassword: "",
        nickname: "",
        nationality: "",
        language: "",
        birthDate: "",
      },
    }),

  // 회원가입 요청
  // 이메일 중복 조회
  // 닉네임 중복 조회
  // 마일리지 100p 제공
}));

export default userStore;
