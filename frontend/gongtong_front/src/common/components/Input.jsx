const Input = ({ text, type, onClick }) => {
  const classNameList = {};
  const className = classNameList[type] || "";
  return <input type="text" />;
};
export default Input;
