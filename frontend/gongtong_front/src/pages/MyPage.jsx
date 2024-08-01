import React, { useEffect, useState } from "react";
import axios from "axios";

const MyPage = () => {
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get("/users/me");
        console.log(response);
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

export default MyPage;
