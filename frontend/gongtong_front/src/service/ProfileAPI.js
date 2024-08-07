import api from "./Api";

export const getOtherInfo = async (username) => {
  try {
    const response = await api.get(`/users/profile/${username}`);
    return response.data.data;
  } catch (error) {
    console.log(error);
  }
};

// export const getTeachedClass = async (username) => {
//   try {
//     const response = await api.get(`/users/profile/${username}/hosting`);
//     console.log(response);
//     return response.data;
//   } catch (error) {
//     console.log(error);
//   }
// };

// export const getTeachedClass = async (username) => {
//   try {
//     const response = await api.get(`/users/profile/${username}/hosting`);
//     console.log(response);
//   } catch (error) {
//     console.log(error);
//   }
// };
