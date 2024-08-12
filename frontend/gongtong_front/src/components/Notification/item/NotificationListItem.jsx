import { ListItem, Typography } from "@material-tailwind/react";
import React from "react";

const NotificationListItem = () => {
  return (
    <ListItem className="focus:bg-white">
      <div className="flex flex-col text-black w-full">
        <div className="flex flex-row w-full items-center justify-between">
          <Typography variant="h6">제목</Typography>
          <input
            type="checkbox"
            className="h-3 w-3 rounded-full bg-third border border-third transition-all hover:scale-105 appearance-none checked:bg-white checked:border-gray-900/20"
          />
        </div>
        <Typography variant="small">알림 본문</Typography>
        <div className="flex justify-end mt-1">
          <Typography className="text-xs text-gray-500">2024.08.12</Typography>
        </div>
      </div>
    </ListItem>
  );
};

export default NotificationListItem;
