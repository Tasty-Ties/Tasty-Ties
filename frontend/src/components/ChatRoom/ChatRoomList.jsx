const ChatRoomList = ({ chatRoom, userLang }) => {
  return (
    <div className="min-w-0 flex-auto">
      <div className="flex flex-row justify-between mr-3">
        <p className="text-sm truncate font-semibold leading-6 text-gray-900">
          {chatRoom.title}
        </p>
      </div>
      <div className="flex flex-row justify-between">
        <p className="mt-1 truncate text-xs leading-5 text-gray-500">
          {chatRoom.message ? chatRoom.message.messages?.[userLang] : ""}
        </p>
        <p className="text-xs self-end mb-2">
          {chatRoom.message
            ? new Date().getDate() <
                new Date(chatRoom.message.createdTime)
                  .getDate()
                  .toString()
                  .padStart(2, "0") &&
              new Date().getMonth() <=
                new Date(chatRoom.message.createdTime)
                  .getMonth()
                  .toString()
                  .padStart(2, "0")
              ? (
                  new Date(chatRoom.message.createdTime).getMonth() + 1
                ).toString.padStart(2, "0") +
                " : " +
                new Date(chatRoom.message.createdTime)
                  .getDate()
                  .toString()
                  .padStart(2, "0")
              : new Date(chatRoom.message.createdTime)
                  .getHours()
                  .toString()
                  .padStart(2, "0") +
                " : " +
                new Date(chatRoom.message.createdTime)
                  .getMinutes()
                  .toString()
                  .padStart(2, "0")
            : ""}
        </p>
      </div>
    </div>
  );
};

export default ChatRoomList;
