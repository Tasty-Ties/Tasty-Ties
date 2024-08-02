import axios from "./Axios";

export const getMyInfo = async () => {
  try {
    const response = await axios.get("/users/me");
  } catch (error) {
    console.log(error);
  }
};
