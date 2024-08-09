const Button = ({ text, type, onClick }) => {
  const typeList = {
    "green-border-short":
      "bg-transparent hover:bg-transparent text-first font-semibold hover:text-first-600 py-2 px-4 border border-first hover:border-first-600 rounded",
    "green-short":
      "bg-first hover:bg-first-800 text-white font-bold py-2 px-4 rounded",
    "green-sqr":
      "bg-first hover:bg-first-800 text-white font-bold py-4 px-4 rounded",
    "orange-sqr":
      "bg-third hover:bg-third-800 text-white font-bold py-4 px-4 rounded",
    "gray-sqr":
      "bg-gray-400 hover:bg-gray-500 text-black font-bold py-4 px-4 rounded",
    "orange-border-sqr":
      "bg-transparent hover:bg-transparent text-third font-semibold hover:text-third-800 py-4 px-4 border border-third hover:border-third-800 rounded",
    "yellow-short":
      "bg-second-600 hover:bg-second-700 text-white font-bold py-2 px-4 rounded",
    "yellow-border-short":
      "bg-transparent hover:bg-transparent text-second-600 font-semibold hover:text-second-700 py-2 px-4 border border-second-600 hover:border-second-700 rounded",
    "green-long":
      "bg-first hover:bg-first-800 text-white font-bold py-2 px-40 rounded",
    "black-login":
      "bg-gray-900 hover:bg-gray-800 text-white font-bold py-2 px-3 rounded",
    "black-short":
      "bg-gray-900 hover:bg-gray-800 text-white font-bold py-2 px-40 rounded",
  };
  return (
    <button className={`${typeList[type]}`} onClick={onClick}>
      {text}
    </button>
  );
};

export default Button;
