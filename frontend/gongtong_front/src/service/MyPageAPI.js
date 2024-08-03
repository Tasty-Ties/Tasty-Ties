import axios from "./Axios";

export const getMyInfo = async () => {
  try {
    const response = await axios.get("/users/me");
    // console.log(response);
    return response.data.data;
  } catch (error) {
    console.log(error);
  }
};

export const deleteId = async () => {
  try {
    const response = await axios.delete("/users/me");
    console.log(response);
    console.log("회원탈퇴성공");
  } catch (error) {
    console.log(error);
  }
};
