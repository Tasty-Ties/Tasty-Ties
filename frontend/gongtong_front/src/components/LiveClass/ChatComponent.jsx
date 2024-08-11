const CHAT_SERVER_URL = import.meta.env.VITE_CHAT_SERVER;

const roomId = "66a9c5dd498fe728acb763f8";
const userId = 1;
const userLang = "Japanese";
import { Client } from "@stomp/stompjs";
import { useEffect, useRef, useState } from "react";
import ChatLog from "../ChatRoom/ChatLog";

const ChatComponent = () => {
  return (
    <div className="w-1/3 self-stretch mx-3 my-3 border-solid border-2">
      <ChatLog />
    </div>
  );
};

export default ChatComponent;
