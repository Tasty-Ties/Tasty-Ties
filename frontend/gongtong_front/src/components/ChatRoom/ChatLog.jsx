import { useEffect, useRef, useState } from "react";
import Button from "../../common/components/Button";
import axios from "axios";
import ChatMessage from "./ChatMessage";
import Cookies from "js-cookie";
import AttendeeList from "./AttendeeList";

// import "./../../styles/LiveClass/LiveClass.css";

const CHAT_SERVER_URL = import.meta.env.VITE_CHAT_SERVER_URL;

const ChatLog = ({
  userProfile,
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
  const endScrollRef = useRef();
  const chatLogIndexRef = useRef(0);
  //   const [chatLogIndex, setChatLogIndex] = useState(0);
  const [messageLog, setMessageLog] = useState([]);
  const [previousLog, setPreviousLog] = useState([]);
  const [receivedType, setReceivedType] = useState([]);
  const [open, setOpen] = useState(false);
  const [isTranslatorOn, setIsTranslatorOn] = useState(true);
  const [usersList, setUsersList] = useState();
  const [userProfileList, setUserProfileList] = useState({});

  useEffect(() => {
    getChatLog();
    subscribeChatRoom();
    setMessageLog([]);

    return () => {
      chatLogIndexRef.current = 0;
      stompClient.current.unsubscribe();
      setMessageLog([]);
      setPreviousLog([]);
      setUserProfileList({});
      console.log(`${chatRoomTitle} 채팅방 구독이 취소되었습니다.`);
    };
  }, [chatRoomId]);

  useEffect(() => {
    console.log("스크롤을 맨 마지막으로 이동합니다.");
    endScrollRef.current.scrollIntoView();
  }, [chatRoomId, previousLog, messageLog]);

  useEffect(() => {
    userProfileSetting();
  }, [previousLog]);

  console.log("유저의 프로필을 정리했습니다. : ", userProfileList);
  const subscribeChatRoom = async () => {
    await stompClient.current.subscribe(
      `/sub/chat/rooms/${chatRoomId}`,
      async (message) => {
        receivedMessage(JSON.parse(message.body));
        console.log(JSON.parse(message.body));
      }
    );
    console.log(`${chatRoomTitle} 채팅방 구독이 활성화되었습니다.`);
  };

  const getChatLog = async () => {
    try {
      const response = await axios.get(CHAT_SERVER_URL + `/chats`, {
        headers: {
          Authorization: `Bearer ${Cookies.get("accessToken")}`,
        },
        params: {
          chatRoomId: chatRoomId,
          pgNo: chatLogIndexRef.current,
        },
      });
      console.log(
        ">>>>>>> 기존 채팅 목록을 불러옵니다. 채팅 페이지는 : ",
        chatLogIndexRef.current
      );
      console.log("기존 채팅 목록", response.data.data);
      setPreviousLog((prev) => [...prev, ...response.data.data.chatMessages]);
      setUsersList(response.data.data.users);
    } catch (error) {
      console.error;
      return;
    }
  };

  const receivedMessage = (chatMessage) => {
    if (chatMessage.type === "USER") {
      if (chatMessage.userId === userId) {
        setReceivedType("ME");
      } else {
        setReceivedType("USER");
      }
    } else {
      setReceivedType("HOST");
    }
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

  const userProfileSetting = () => {
    if (!usersList) return;
    usersList.forEach((user) => {
      setUserProfileList((prev) => ({
        ...prev,
        [user.username]: user.profileImageUrl,
      }));
    });
  };

  return (
    <div className="relative flex flex-col h-full">
      {open ? (
        <AttendeeList setOpen={setOpen} nickname={nickname} users={usersList} />
      ) : (
        <></>
      )}
      <div className="flex flex-row justify-between place-items-center text-lg min-h-12">
        <button className="justify-self-end px-3 invisible">
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
              d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z"
            />
          </svg>
        </button>
        <div className="flex flex-row">
          <button
            className="bg-white text-xs px-3 invisible"
            onClick={() => setIsTranslatorOn(!isTranslatorOn)}
          >
            <p> {isTranslatorOn ? "번역 끄기" : "번역 켜기"}</p>
          </button>
          <p className="px-2">{chatRoomTitle}</p>
          <button
            className="bg-white text-xs px-3"
            onClick={() => setIsTranslatorOn(!isTranslatorOn)}
          >
            <p> {isTranslatorOn ? "번역 끄기" : "번역 켜기"}</p>
          </button>
        </div>
        <button
          className="justify-self-end px-3"
          onClick={() => setOpen(!open)}
        >
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
              d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z"
            />
          </svg>
        </button>
      </div>
      <div
        className="flex-auto overflow-auto flex-shrink-0 h-96"
        id="scroll"
        ref={scrollBoxRef}
      >
        {/* <div id="topPoint" ref={topScrollRef} className="h-5"></div> */}
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
                        : previous.type
                    }
                    imgSrc="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRF1IwK6-SxM83UpFVY6WtUZxXx-phss_gAUfdKbkTfau6VWVkt"
                    nickname={previous.userNickname}
                    message={
                      isTranslatorOn && previous.type !== "SYSTEM"
                        ? previous.messages?.[userLang]
                          ? previous.messages[userLang]
                          : previous.messages[previous.originLanguage]
                        : previous.messages[previous.originLanguage]
                    }
                    chatTime={previous.createdTime}
                  />
                }
              </div>
            ))}
        </div>
        <div className="pt-0">
          {messageLog &&
            messageLog.map((message, i) => (
              <div key={i}>
                {
                  <ChatMessage
                    type={receivedType}
                    imgSrc={userProfile}
                    nickname={message.userNickname}
                    message={message.translation}
                    chatTime={new Date()}
                    usersList={usersList}
                  />
                }
              </div>
            ))}
        </div>
        {<div id="endPoint" ref={endScrollRef}></div>}
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
