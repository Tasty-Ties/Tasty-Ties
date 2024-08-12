import {
  Button,
  IconButton,
  List,
  Popover,
  PopoverContent,
  PopoverHandler,
  Typography,
} from "@material-tailwind/react";
import React, { useEffect, useRef, useState } from "react";

import NotificationListItem from "./item/NotificationListItem";
import { getNotifications } from "../../service/NotificationAPI";

const NotificationButton = () => {
  const [notifications, setNotifications] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const pgNo = useRef(0);

  const observeRef = useRef(null);

  const fetchNotifications = async () => {
    try {
      const response = await getNotifications(pgNo.current);
      const newNotifications = response.data.data.notifications;

      setNotifications((prevNotifications) => [...prevNotifications, ...newNotifications]);

      if (newNotifications.length < 20) {
        setHasMore(false);
      } else {
        pgNo.current += 1;
      }
    } catch (e) {
      console.log(e);
    }
  };

  const triggers = {
    onClick: () => {
      if (notifications.length === 0) {
        fetchNotifications();
      }
    },
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore) {
          fetchNotifications();
        }
      },
      {
        root: null,
        rootMargin: "0px",
        threshold: 0.1,
      }
    );

    if (observeRef.current) {
      observer.observe(observeRef.current);
    }

    return () => {
      if (observeRef.current) {
        observer.unobserve(observeRef.current);
      }
    };
  }, [observeRef.current, hasMore]);

  return (
    <Popover placement="bottom-end">
      <PopoverHandler {...triggers}>
        <IconButton variant="text" color="amber" className="rounded-full mr-2">
          <i className="fa fa-bell text-lg" />
        </IconButton>
      </PopoverHandler>
      <PopoverContent className="w-[30%] max-h-[80%] overflow-auto scrollbar-hidden">
        <div className="flex flex-row items-center justify-between mt-4 mb-4">
          <Typography variant="h5" className="text-black ml-2">
            알림
          </Typography>
          <Button variant="text" size="sm" color="red" className="p-1.5">
            전체 삭제
          </Button>
        </div>
        <List>
          {notifications.length === 0 ? (
            <div>알림없음</div>
          ) : (
            notifications.map((notification) => (
              <NotificationListItem notification={notification} key={notification.id} />
            ))
          )}
        </List>
        {hasMore && <div ref={observeRef} className="h-2" />}
      </PopoverContent>
    </Popover>
  );
};

export default NotificationButton;
