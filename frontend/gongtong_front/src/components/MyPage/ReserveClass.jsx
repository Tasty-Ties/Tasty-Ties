import axios from "axios";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import ReserveList from "./ReserveList";

const ReserveClass = () => {
  const [attendClassData, setAttendClassData] = useState([]);
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8080/api/v1/users/me/reservations?page=0&size=4",
          {
            headers: {
              Authorization: `Bearer ${Cookies.get("accessToken")}`,
            },
          }
        );
        setAttendClassData(response.data.data.content);
      } catch (error) {
        console.error("Failed to fetch user data:", error);
      }
    };

    fetchUserData();
  }, []);

  return (
    <>
      <div>예약한 클래스</div>
      {attendClassData &&
        attendClassData.map((data, i) => (
          <div key={i}>
            <ReserveList data={data} />
          </div>
        ))}
    </>
  );
};
export default ReserveClass;
