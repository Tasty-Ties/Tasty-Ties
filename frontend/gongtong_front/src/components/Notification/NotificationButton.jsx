import React from "react";
import {
  Popover,
  PopoverHandler,
  IconButton,
  PopoverContent,
  Typography,
} from "@material-tailwind/react";
import NotificationListItem from "./item/NotificationListItem";

const NotificationButton = () => {
  return (
    <Popover placement="bottom-end">
      <PopoverHandler>
        <IconButton variant="text" color="amber" className="rounded-full mr-2">
          <i className="fa fa-bell text-lg" />
        </IconButton>
      </PopoverHandler>
      <PopoverContent className="w-80 max-h-[80%] overflow-auto scrollbar-hidden">
        <Typography variant="h5" className="text-black mt-4 mb-4">
          알림
        </Typography>
        <NotificationListItem />
        <NotificationListItem />
        <NotificationListItem />
        <NotificationListItem />
      </PopoverContent>
    </Popover>
  );
};

export default NotificationButton;
