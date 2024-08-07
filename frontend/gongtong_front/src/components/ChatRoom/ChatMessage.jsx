import { useEffect, useState } from "react";

const ChatMessage = ({ type, imgSrc, nickname, message, chatTime }) => {
  // const left

  const [messageDirection, setMessageDirection] = useState();
  const [nicknamePlace, setNicknamePlace] = useState();
  const [messageBox, setMessageBox] = useState();

  useEffect(() => {
    typeInput(type);
  }, []);

  const typeInput = (type) => {
    switch (type) {
      case "ME":
        setMessageDirection("flex flex-row-reverse px-4 py-2");
        setNicknamePlace("mx-2 max-w-xl flex flex-col place-items-end");
        setMessageBox(
          "bg-yellow-300 rounded-l-2xl rounded-br-2xl border-solid border-2"
        );
        break;
      case "HOST":
        setMessageDirection("flex flex-row px-4 py-2");
        setNicknamePlace("mx-2 max-w-xl flex flex-col");
        setMessageBox(
          "bg-white rounded-r-2xl rounded-bl-2xl border-solid border-yellow-400 border-4"
        );
        break;
      default:
        setMessageDirection("flex flex-row px-4 py-2");
        setNicknamePlace("mx-2 max-w-xl flex flex-col");
        setMessageBox(
          "bg-white rounded-r-2xl rounded-bl-2xl border-solid border-2"
        );
        break;
    }
  };

  return (
    <>
      <div className={messageDirection}>
        <img alt="" src={imgSrc} className="h-12 w-12 flex-none rounded-full" />
        <div className={nicknamePlace}>
          <div className="px-1">
            {/* {nickname} */}
            {type === "SYSTEM"
              ? "SYSTEM"
              : type === "HOST"
              ? `${nickname} (HOST)`
              : nickname}
          </div>
          <div className={messageBox}>
            <p className="p-3 break-words">{message}</p>
          </div>
        </div>
        <div className="self-end my-2 tex t-xs">
          {chatTime
            ? new Date().getDate() > new Date(chatTime).getDate() &&
              new Date().getMonth() >= new Date(chatTime).getMonth()
              ? new Date(chatTime).getMonth() +
                1 +
                "월 " +
                new Date(chatTime).getDate() +
                "일"
              : new Date(chatTime).getHours().toString().padStart(2, "0") +
                " : " +
                new Date(chatTime).getMinutes().toString().padStart(2, "0")
            : ""}
        </div>
      </div>
    </>
  );
};

export default ChatMessage;
