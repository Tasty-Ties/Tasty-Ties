import React, { useEffect, useState } from "react";
import axios from "../../service/Axios";
// import useApiStore from "../../store/ApiStore";
import Cookies from "js-cookie";

const MyInfo = () => {
  // const { baseURL } = useApiStore();
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    console.log(Cookies.get("accessToken"));
    const fetchUserData = async () => {
      try {
        const response = await axios.get("/users/me", {
          // headers: {
          //   Authorization: `Bearer ${Cookies.get("accessToken")}`,
          // },
        });
        console.log(response);
        console.log(Cookies.get("accessToken"));
        setUserData(response.data);
      } catch (error) {
        console.error("Failed to fetch user data:", error);
      }
    };

    fetchUserData();
  }, []);

  if (!userData) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>My Page</h1>
      <p>Username: {userData.username}</p>
      <p>Email: {userData.email}</p>
    </div>
  );
};

export default MyInfo;
