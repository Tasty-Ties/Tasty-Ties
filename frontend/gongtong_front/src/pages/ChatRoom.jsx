import { Client } from "@stomp/stompjs";
import Cookies from "js-cookie";
import { useEffect, useRef, useState } from "react";
import ChatLog from "../components/ChatRoom/ChatLog";
import ChatRoomList from "../components/ChatRoom/ChatRoomList";
import useMyPageStore from "../store/MyPageStore";
import { chatApi } from "./../service/Api";
import profileimage from "./../assets/MyPage/기본프로필사진.jpg";

const MAIN_SERVER_URL = import.meta.env.VITE_MAIN_SERVER;
const CHAT_SERVER = import.meta.env.VITE_CHAT_SERVER;
const CHAT_SERVER_URL = import.meta.env.VITE_CHAT_SERVER_URL;

const ChatRoom = () => {
  const stompClient = useRef(null);
  const [chatRoomList, setChatRoomList] = useState([]);
  const [chatRoomId, setChatRoomId] = useState();
  const [chatRoomTitle, setChatRoomTitle] = useState();
  const [isEmpty, setIsEmpty] = useState(false);

  const userInfo = useMyPageStore((state) => state.informations);
  const fetchInformation = useMyPageStore((state) => state.fetchInformations);

  const [messageTime, setMessageTime] = useState();
  const chatRoomRef = useRef();

  const defaultImage = profileimage;

  useEffect(() => {
    fetchInformation();

    stompClient.current = new Client({
      brokerURL: CHAT_SERVER,

      debug: (str) => {
        console.log(str);
      },

      onWebSocketError: (error) => {
        console.error("Error with websocket", error);
      },
      onStompError: (frame) => {
        console.error("Broker reported error: " + frame.headers["message"]);
        console.error("Additional details: " + frame.body);
      },

      connectHeaders: {
        Authorization: `Bearer ${Cookies.get("accessToken")}`,
      },
    });

    stompClient.current.activate();
    console.log("stompClient가 활성화됨");

    return () => {
      chatRoomList.length = 0;
      stompClient.current.deactivate();
      console.log("stompClient가 비활성화됨");
    };
  }, []);

  useEffect(() => {
    getRoomList();
  }, [userInfo]);

  const getRoomList = async () => {
    if (userInfo && userInfo.length === 0) {
      return;
    }
    try {
      const response = await chatApi.get(`/chats/rooms`);
      console.log("유저의 채팅방 목록입니다.", response);
      setChatRoomList(response.data.data.chatRooms);
    } catch (error) {
      if (error.response.status === 404) {
        setIsEmpty(true);
      }
      console.error(error);
      return;
    }
  };

  return (
    <div className="flex flex-row flex-auto mx-3 pb-5 pt-2">
      <div className="w-1/3">
        <div className="divide-y divide-gray-100 overflow-auto">
          {isEmpty
            ? "아무런 채팅방에도 참여하고 있지 않습니다."
            : chatRoomList &&
              chatRoomList.map((chatRoom, i) => (
                <button
                  key={i}
                  className={`flex justify-between gap-x-6 py-5 hover:bg-yellow-100 w-full`}
                  ref={chatRoomRef}
                  onClick={() => {
                    setChatRoomId(chatRoom.id);
                    setChatRoomTitle(chatRoom.title);
                  }}
                >
                  <div className="flex min-w-0 gap-x-4 w-full px-3">
                    <img
                      alt=""
                      src={chatRoom.imageUrl ? chatRoom.imageUrl : defaultImage}
                      className="h-12 w-12 flex-none rounded-full bg-gray-50"
                    />
                    <ChatRoomList
                      chatRoom={chatRoom}
                      userLang={userInfo.language.englishName}
                    />
                  </div>
                  <div className="hidden shrink-0 sm:flex sm:flex-col sm:items-end">
                    <p className="text-sm leading-6 text-gray-900">
                      {chatRoom.message ? messageTime : ""}
                    </p>
                  </div>
                </button>
              ))}
        </div>
      </div>
      <div className="w-2/3 h-full bg-yellow-100">
        {chatRoomId && userInfo && (
          <ChatLog
            userProfile={userInfo.profileImageUrl}
            chatRoomId={chatRoomId}
            chatRoomTitle={chatRoomTitle}
            stompClient={stompClient}
            username={userInfo.username}
            nickname={userInfo.nickname}
            userLang={userInfo.language.englishName}
          />
        )}
      </div>
    </div>
  );
};

export default ChatRoom;
