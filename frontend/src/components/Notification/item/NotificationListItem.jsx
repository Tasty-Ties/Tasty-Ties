import { ListItem, Typography } from "@material-tailwind/react";
import React, { useState } from "react";

import { changeIsReadNotification } from "../../../service/NotificationAPI";
import { pushApiErrorNotification } from "../../common/Toast";

const NotificationListItem = ({ notification }) => {
  const [check, setCheck] = useState(notification.read);

  const handleCeckNotifiaction = async () => {
    try {
      const response = await changeIsReadNotification(notification.id);

      if (response.status === 200) {
        setCheck(!check);
      }
    } catch (e) {
      pushApiErrorNotification(e);
    }
  };

  const formatDate = (date) => {
    const now = new Date();
    const pastDate = new Date(date);
    const diffMs = now - pastDate;

    // 시간 차이를 밀리초 단위로 계산
    const diffMinutes = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMinutes / 60);

    // 결과 문자열을 저장할 변수
    let result;

    if (diffMinutes === 0) {
      result = "방금 전";
    } else if (diffMinutes < 60) {
      // 1시간 미만
      result = `${diffMinutes}분 전`;
    } else if (diffHours < 24) {
      // 24시간 미만
      const minutes = diffMinutes % 60;
      result = `${diffHours}시간 ${minutes}분 전`;
    } else {
      // 24시간 이상
      const year = pastDate.getFullYear();
      const month = String(pastDate.getMonth() + 1).padStart(2, "0"); // 월은 0부터 시작하므로 +1
      const day = String(pastDate.getDate()).padStart(2, "0");
      result = `${year}.${month}.${day}`;
    }

    return result;
  };

  return (
    <ListItem className="focus:bg-white">
      <div className="flex flex-col text-black w-full">
        <div className="flex flex-row w-full items-center justify-between">
          <Typography variant="h6" className="font-nanum">
            {notification.title}
          </Typography>
          <input
            type="checkbox"
            className="h-3 w-3 rounded-full bg-third border border-third transition-all hover:scale-105 appearance-none checked:bg-white checked:border-gray-900/20"
            defaultChecked={check}
            onClick={handleCeckNotifiaction}
          />
        </div>
        <Typography variant="small" className="mt-1 font-nanum">
          {notification.body}
        </Typography>
        <div className="flex justify-end mt-3">
          <Typography className="text-xs text-gray-500 font-nanum">
            {formatDate(notification.createTime)}
          </Typography>
        </div>
      </div>
    </ListItem>
  );
};

export default NotificationListItem;
