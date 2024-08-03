import axios from "axios";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import TeachList from "./TeachList";

const TeachClass = () => {
  const [teachClassData, setTeachClassData] = useState([]);
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8080/api/v1/users/me/hosting",
          {
            headers: {
              Authorization: `Bearer ${Cookies.get("accessToken")}`,
            },
          }
        );
        setTeachClassData(response.data.data.content);
      } catch (error) {
        console.error("Failed to fetch user data:", error);
      }
    };

    fetchUserData();
  }, []);
  return (
    <>
      <div>수업할 클래스</div>
      <>
        {teachClassData &&
          teachClassData.map((data, i) => (
            <div key={i}>
              <TeachList data={data} />
            </div>
          ))}
      </>
    </>
  );
};
export default TeachClass;
