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

  return (
    <ListItem className="focus:bg-white">
      <div className="flex flex-col text-black w-full">
        <div className="flex flex-row w-full items-center justify-between">
          <Typography variant="h6">{notification.title}</Typography>
          <input
            type="checkbox"
            className="h-3 w-3 rounded-full bg-third border border-third transition-all hover:scale-105 appearance-none checked:bg-white checked:border-gray-900/20"
            defaultChecked={check}
            onClick={handleCeckNotifiaction}
          />
        </div>
        <Typography variant="small" className="mt-1">
          {notification.body}
        </Typography>
        <div className="flex justify-end mt-3">
          <Typography className="text-xs text-gray-500">{notification.createTime}</Typography>
        </div>
      </div>
    </ListItem>
  );
};

export default NotificationListItem;
