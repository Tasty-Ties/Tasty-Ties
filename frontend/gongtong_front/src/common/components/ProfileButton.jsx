import { useNavigate } from "react-router-dom";

const ProfileButton = ({ username, type, page }) => {
  const nav = useNavigate();
  const typeList = {
    round: "h-12 w-12 flex-none rounded-full bg-gray-50",
    square: "h-12 w-12 flex-none rounded-lg bg-gray-50",
  };
  const pageList = {
    mypage: "mypage",
    otherpage: "otherpage",
  };

  return (
    <div>
      <img
        alt="프로필사진"
        src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRF1IwK6-SxM83UpFVY6WtUZxXx-phss_gAUfdKbkTfau6VWVkt"
        className={`${typeList[type]}`}
        onClick={() => nav(`/${pageList[page]}/${username}`)}
      />
    </div>
  );
};
export default ProfileButton;
