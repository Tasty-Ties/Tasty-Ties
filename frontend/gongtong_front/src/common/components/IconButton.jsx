const IconButton = ({ text, type, onClick }) => {
  const typeList = {
    "mypage-border": "",
    "class-color": "",
    "class-border": "",
  };
  const className = typeList[type] || "";
  return (
    <button className={`${className}`} onClick={onClick}>
      <svg></svg>
      {text}
    </button>
  );
};
export default IconButton;
