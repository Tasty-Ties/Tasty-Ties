const CHAT_SERVER_URL = import.meta.env.VITE_CHAT_SERVER;

const roomId = "66a9c5dd498fe728acb763f8";
const userId = 1;
const userLang = "Japanese";
import { Client } from "@stomp/stompjs";
import { useEffect, useRef, useState } from "react";

const ChatComponent = () => {
  const stompClient = useRef(null);
  const [messageLog, setMessageLog] = useState([]);
  const [message, setMessage] = useState("");
  const [userNickname, setUserNickname] = useState("");
  const [translatedMessages, setTranslatedMessages] = useState("");

  useEffect(() => {
    stompClient.current = new Client({
      brokerURL: CHAT_SERVER_URL,

      debug: (str) => {
        console.log(str);
      },
      onConnect: async (frame) => {
        console.log("Connected: " + frame);

        await stompClient.current.subscribe(
          `/sub/chat/rooms/${roomId}`,
          async (message) => {
            console.log(JSON.parse(message.body));
            showGreeting(JSON.parse(message.body));
          }
        );
      },
      onWebSocketError: (error) => {
        console.error("Error with websocket", error);
      },
      onStompError: (frame) => {
        console.error("Broker reported error: " + frame.headers["message"]);
        console.error("Additional details: " + frame.body);
      },
    });

    connect();

    return () => disconnect();
  }, []);

  const connect = () => {
    if (roomId) {
      stompClient.current.activate();
    } else {
      alert("Please enter a room ID.");
    }
  };

  const disconnect = () => {
    stompClient.current.deactivate();
    console.log("Disconnected");
  };

  const sendMessage = (e) => {
    e.preventDefault();

    const chatMessage = {
      userId: parseInt(userId),
      message: message,
    };

    console.log(JSON.stringify(chatMessage));

    stompClient.current.publish({
      destination: `/pub/chat/text/rooms/${roomId}`,
      body: JSON.stringify(chatMessage),
    });

    setMessage("");
  };

  const showGreeting = (chatMessage) => {
    setUserNickname(chatMessage.userNickname);
    setTranslatedMessages(chatMessage.messages);
  };

  useEffect(() => {
    if (translatedMessages[userLang] !== undefined) {
      setMessageLog((prev) => [
        ...prev,
        {
          userNickname: userNickname,
          translation: translatedMessages[userLang],
        },
      ]);
    }
    console.log(messageLog);
  }, [userNickname, translatedMessages]);

  const messageHandler = (e) => {
    setMessage(e.target.value);
  };

  return (
    <div className="w-1/3 self-stretch mx-3 my-3 border-solid border-2">
      <h1>채팅</h1>
      <div>
        {messageLog.map((message, i) => (
          <div key={i}>
            {message.userNickname}: {message.translation}
          </div>
        ))}
      </div>

      <input value={message} onChange={messageHandler}></input>
      <button onClick={sendMessage}>전송</button>
    </div>
  );
};

export default ChatComponent;
