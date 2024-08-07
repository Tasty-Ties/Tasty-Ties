import api from "./Api";

export const getMyInfo = async () => {
  try {
    const response = await api.get("/users/me");
    console.log(response);
    return response.data.data;
  } catch (error) {
    console.log(error);
  }
};

export const deleteId = async () => {
  try {
    const response = await api.delete("/users/me");
    console.log(response);
  } catch (error) {
    console.log(error);
  }
};

export const getTeachClass = async () => {
  try {
    const response = await api.get("/users/me/hosting");
    console.log(response);
    return response.data.data.content;
  } catch (error) {
    console.log(error);
  }
};

export const getReserveClass = async () => {
  try {
    const response = await api.get("/users/me/reservations");
    console.log(response);
    return response.data.data.content;
  } catch (error) {
    console.log(error);
  }
};
