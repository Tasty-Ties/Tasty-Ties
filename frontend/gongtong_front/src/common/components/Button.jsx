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
      "bg-first hover:bg-first-800 text-white font-bold py-2 px-28 rounded",
    "green-semi-long":
      "bg-first hover:bg-first-800 text-white font-bold py-2 px-20 rounded",
    "green-border-semi-long":
      "bg-transparent hover:bg-transparent text-first font-semibold hover:text-first-600 py-2 px-20 border border-first hover:border-first-600 rounded",
    "black-login":
      "bg-gray-900 hover:bg-gray-800 text-white font-bold py-2 px-3 rounded",
    "black-short":
      "bg-gray-900 hover:bg-gray-800 text-white font-bold py-2 px-40 rounded",
    "edit-complete":
      "bg-first hover:bg-first-800 text-white text-sm py-2 px-4 rounded",
    "edit-cancle":
      "bg-transparent hover:bg-transparent text-first-800 text-sm hover:text-first-500 py-2 px-4 border border-first hover:border-first-500 rounded",
    "delete-id":
      "hover:bg-white text-gray-400 text-base font py-2 px-2 rounded",
    "replay-button":
      "bg-transparent text-third font-semibold text-sm border border-third rounded px-2 w-12 h-12",
    "expired-button":
      "bg-gray-400 text-black font-semibold text-sm rounded w-12 h-12",
    "enter-button": "bg-third text-white font-bold text-base rounded w-16 h-16",
    "time-button":
      "bg-gray-400 text-black font-semibold text-base rounded w-16 h-16",
    "view-more":
      "bg-transparent text-first text-sm font-semibold py-1 px-4 border border-first rounded-3xl",
    "month-group":
      "bg-transparent text-gray-500 text-sm font-semibold py-1 px-4 border border-gray-500 rounded-3xl",
  };
  return (
    <button className={`${typeList[type]}`} onClick={onClick}>
      {text}
    </button>
  );
};

export default Button;
