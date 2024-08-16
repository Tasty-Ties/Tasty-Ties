import { useEffect, useState } from "react";
import profileimage from "./../../assets/MyPage/기본프로필사진.jpg";

const ChatMessage = ({ type, imgSrc, nickname, message, chatTime, isNew }) => {
  const defaultImage = profileimage;

  const [messageDirection, setMessageDirection] = useState();
  const [nicknamePlace, setNicknamePlace] = useState();
  const [messageBox, setMessageBox] = useState();
  const [textBox, setTextBox] = useState();
  const [timeMessageBox, setTimeMessageBox] = useState();

  useEffect(() => {
    typeInput(type);
  }, []);

  const typeInput = (type) => {
    setTextBox("p-2 break-words");
    setTimeMessageBox("flex flex-row");
    switch (type) {
      case "ME":
        setMessageDirection("flex flex-row-reverse px-4 py-2");
        setNicknamePlace("mx-2 max-w-xl flex flex-col place-items-end");
        setMessageBox(
          "bg-yellow-300 rounded-l-2xl rounded-br-2xl border-solid border-2"
        );
        setTimeMessageBox("flex flex-row-reverse");
        break;
      case "HOST":
        setMessageDirection("flex flex-row px-4 py-2");
        setNicknamePlace("mx-2 max-w-xl flex flex-col");
        setMessageBox(
          "bg-white rounded-r-2xl rounded-bl-2xl border-solid border-yellow-400 border-4"
        );
        break;
      case "SYSTEM":
        setNicknamePlace("flex justify-center py-1 ");
        setMessageBox("px-1");
        setTextBox("px-3 break-words");
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
        {type === "SYSTEM" ? (
          <></>
        ) : (
          <img
            alt=""
            src={imgSrc ? imgSrc : defaultImage}
            className="h-12 w-12 flex-none rounded-full object-cover"
          />
        )}
        <div className={nicknamePlace}>
          <div className="px-1">
            {type === "SYSTEM"
              ? ""
              : type === "HOST"
              ? `${nickname} (HOST)`
              : nickname}
          </div>
          <div className={timeMessageBox}>
            <div className={messageBox}>
              <p className={textBox}>{message}</p>
            </div>
            {type === "SYSTEM" ? (
              <></>
            ) : (
              <div className="self-end my-2 text-xs px-2">
                {chatTime
                  ? isNew
                    ? chatTime
                    : new Date().getDate() > new Date(chatTime).getDate() &&
                      new Date().getMonth() >= new Date(chatTime).getMonth()
                    ? new Date(chatTime).getMonth() +
                      1 +
                      "월 " +
                      new Date(chatTime).getDate() +
                      "일"
                    : new Date(chatTime)
                        .getHours()
                        .toString()
                        .padStart(2, "0") +
                      " : " +
                      new Date(chatTime)
                        .getMinutes()
                        .toString()
                        .padStart(2, "0")
                  : ""}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default ChatMessage;
