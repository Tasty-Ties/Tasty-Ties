import { useEffect, useRef, useState } from "react";
import Button from "../../common/components/Button";
import axios from "axios";
import ChatMessage from "./ChatMessage";

// import "./../../styles/LiveClass/LiveClass.css";

const CHAT_SERVER_URL = import.meta.env.VITE_CHAT_SERVER_URL;

const ChatLog = ({
  chatRoomId,
  chatRoomTitle,
  stompClient,
  userId,
  nickname,
  userLang,
}) => {
  const [userNickname, setUserNickname] = useState("");
  const [originalMessage, setOriginalMessage] = useState("");

  const chatInputRef = useRef();
  const topScrollRef = useRef();
  const scrollBoxRef = useRef();
  const [messageLog, setMessageLog] = useState([]);
  const [previousLog, setPreviousLog] = useState([]);

  useEffect(() => {
    getChatLog();
    subscribeChatRoom();
    setMessageLog([]);

    return () => {
      stompClient.current.unsubscribe();
      setMessageLog([]);
      setPreviousLog([]);
      console.log(`${chatRoomTitle} 채팅방 구독이 취소되었습니다.`);
    };
  }, [chatRoomId]);

  //   useEffect(() => {
  //     if (messageLog.length === 0) {
  //       endScrollRef.current.scrollIntoView();
  //       // console.log("스크롤 이벤트 호출됨");
  //     }
  //   }, [messageLog]);

  const subscribeChatRoom = async () => {
    await stompClient.current.subscribe(
      `/sub/chat/rooms/${chatRoomId}`,
      async (message) => {
        receivedMessage(JSON.parse(message.body));
      }
    );
    console.log(`${chatRoomTitle} 채팅방 구독이 활성화되었습니다.`);
  };

  const getChatLog = async () => {
    try {
      const response = await axios.get(CHAT_SERVER_URL + `/chats`, {
        params: {
          chatRoomId: chatRoomId,
          pgNo: 0,
        },
      });
      setPreviousLog((prev) => [...prev, ...response.data.data.chatMessages]);
    } catch (error) {
      console.error;
      return;
    }
  };

  const receivedMessage = (chatMessage) => {
    setUserNickname(chatMessage.userNickname);
    setOriginalMessage(chatMessage.messages);
  };

  const sendMessage = (e) => {
    e.preventDefault();

    const messageObject = {
      userId: parseInt(userId),
      message: chatInputRef.current.value,
    };

    console.log(JSON.stringify(messageObject));

    stompClient.current.publish({
      destination: `/pub/chat/text/rooms/${chatRoomId}`,
      body: JSON.stringify(messageObject),
    });

    chatInputRef.current.value = "";
  };

  useEffect(() => {
    if (originalMessage[userLang] !== undefined) {
      setMessageLog((prev) => [
        ...prev,
        {
          userNickname: userNickname,
          translation: originalMessage[userLang],
        },
      ]);
    }
    console.log("새롭게 저장된 메시지 목록", messageLog);
  }, [originalMessage]);

  return (
    <div className="flex flex-col h-full">
      <div className="flex justify-center place-items-center text-lg min-h-12">
        <p className="">{chatRoomTitle}</p>
      </div>
      <div
        className="flex-auto overflow-auto flex-shrink-0 h-96"
        id="scroll"
        ref={scrollBoxRef}
      >
        <div id="topPoint" ref={topScrollRef} className="h-5"></div>
        <div className=" flex flex-col-reverse">
          {previousLog &&
            previousLog.map((previous, i) => (
              <div key={i}>
                {
                  <ChatMessage
                    type={
                      previous.type === "USER"
                        ? previous.userId === userId
                          ? "ME"
                          : previous.userType
                        : "SYSTEM"
                    }
                    imgSrc="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRF1IwK6-SxM83UpFVY6WtUZxXx-phss_gAUfdKbkTfau6VWVkt"
                    nickname={previous.userNickname}
                    message={
                      previous.messages?.[userLang]
                        ? previous.messages[userLang]
                        : previous.messages["English"]
                    }
                    chatTime={previous.createdTime}
                  />
                }
              </div>
            ))}
        </div>
        {messageLog &&
          messageLog.map((message, i) => (
            <div key={i}>
              {
                <ChatMessage
                  type={"ME"}
                  imgSrc="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRF1IwK6-SxM83UpFVY6WtUZxXx-phss_gAUfdKbkTfau6VWVkt"
                  nickname={message.userNickname}
                  message={message.translation}
                  chatTime={new Date()}
                />
              }
            </div>
          ))}
        {<div id="endPoint"></div>}
      </div>
      <div className="w-full flex flex-row space-x-2 py-5 items-end justify-center">
        <input
          type="text"
          autoComplete="given-name"
          className="block rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 w-5/6"
          ref={chatInputRef}
        />
        <Button
          type="yellow-short"
          text={
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="size-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5"
              />
            </svg>
          }
          onClick={sendMessage}
        />
      </div>
    </div>
  );
};

export default ChatLog;
