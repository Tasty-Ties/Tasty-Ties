import defaultImage from "./../../assets/MyPage/기본프로필사진.jpg";
import { Avatar } from "@material-tailwind/react";

const ProfileButton = ({ image, type, size, onClick }) => {
  // const typeList = {
  //   round: "rounded-full bg-gray-50",
  //   square: "rounded-lg bg-gray-50", //모서리가 둥근 사각형
  // };

  return (
    // <div>
    //   <img
    //     alt="프로필사진"
    //     src={image === null ? defaultImage : image}
    //     className={`m-1 ${typeList[type]} ${size} cursor-pointer`}
    //     onClick={onClick}
    //   />
    // </div>
    <div>
      <Avatar
        src={image === null ? defaultImage : image}
        alt="프로필사진"
        variant={type}
        size={size}
        onClick={onClick}
        className="m-1 cursor-pointer"
      />
    </div>
  );
};
export default ProfileButton;
