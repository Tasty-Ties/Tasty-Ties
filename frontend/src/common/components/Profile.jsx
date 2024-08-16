const Profile = ({ image, username, size, textsize }) => {
  return (
    <div className={`flex items-center ${size} ${textsize}`}>
      <img src={image} alt="유저 이미지" />
      <span className="ml-2 font-semibold">{username}</span>
    </div>
  );
};
export default Profile;
