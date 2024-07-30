const Button = ({ text, type, onClick }) => {
  const typeList = {
    "mypage-border": "",
    "mypage-green": "",
    "mypage-sqr-green": "",
    "mypage-sqr-orange": "",
    "myPage-sqr-grey": "",
    "myPage-sqr-border": "",
    "modal-yellow": "",
    "modal-border": "",
    "login-green": "",
    "login-black": "",
    "Complete-green": "",
    "class-yellow": "",
  };
  const className = typeList[type] || "";
  return (
    <button className={`${className}`} onClick={onClick}>
      {text}
    </button>
  );
};

export default Button;
