import { create } from "zustand";

const useUserStore = create((set) => ({
  userForm: {
    username: "", // 아이디
    password: "", // 비밀번호
    verifyPassword: "", // 비밀번호 확인
    nickname: "", // 닉네임
    countryCode: "", // 국가 코드
    email: "", // 이메일
    emailId: "", // 모국어 코드
    emailDomain: "", // 이메일 아이디
    languageCode: "", // 이메일 도메인
    birth: "", // 생년월일
  },
  setForm: (key, value) =>
    set((state) => ({
      userForm: {
        ...state.userForm,
        [key]: value,
      },
    })),
  resetForm: (fields = []) =>
    set((state) => {
      const resetFields = fields.reduce((acc, field) => {
        acc[field] = "";
        return acc;
      }, {});
      return {
        userForm: {
          ...state.userForm,
          ...resetFields,
        },
      };
    }),
}));

export default useUserStore;
