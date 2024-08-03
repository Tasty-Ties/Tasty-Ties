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
