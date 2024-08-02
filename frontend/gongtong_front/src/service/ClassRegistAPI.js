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
    return response.data.data.languages;
  } catch (error) {
    console.log("ClassRegistAPI - getLanguagesError : " + error);
  }
};

export const getClassLists = async (page) => {
  try {
    const response = await axios.get(`${REST_CLASSREGIST_API}/classes`, {
      params: {
        page: page,
        size: 12,
      },
    });
    return response.data.data.content;
  } catch (error) {
    console.log("ClassListsAPI - getClassListsError : " + error);
  }
};

export const getClassDetail = async (classId) => {
  try {
    const response = await axios.get(
      `${REST_CLASSREGIST_API}/classes/${classId}`
    );
    return response.data.data;
  } catch (error) {
    console.log("ClassDetailAPI - getClassDetailError : " + error);
  }
};
