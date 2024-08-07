import api from "./Api";

export const getOtherInfo = async (username) => {
  try {
    const response = await api.get(`/users/profile/${username}`);
    return response.data.data;
  } catch (error) {
    console.log(error);
  }
};
