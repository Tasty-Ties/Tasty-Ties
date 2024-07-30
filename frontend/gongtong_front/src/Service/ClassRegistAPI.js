import axios from "axios";

const REST_CLASSREGIST_API = `http://localhost:8080/api/v1`;

export const getCountries = async () => {
  try {
    const response = await axios.get(`${REST_CLASSREGIST_API}/countries`);
    return response.data.data.countries;
  } catch (error) {
    console.log("ClassRegistAPI - getCountriesError : " + error);
  }
};

export const getLanguages = async () => {
  try {
    const response = await axios.get(`${REST_CLASSREGIST_API}/languages`);
    console.log(response.data.data.languages);
    return response.data.data.languages;
  } catch (error) {
    console.log("ClassRegistAPI - getLanguagesError : " + error);
  }
};

// export const setClassRegist = async () => {
//   try {
//     axios.post(`${REST_CLASSREGIST_API}/classes`);
//   } catch (error) {}
// };
