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
import { getNotifications, deleteNotifications } from "../../service/NotificationAPI";
import { pushApiErrorNotification } from "../common/Toast";

const NotificationButton = () => {
  const [notifications, setNotifications] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const pgNo = useRef(0);

  const [isAllDeleteButtonVisible, setIsAllDeleteButtonVisible] = useState(false);

  useEffect(() => {
    setIsAllDeleteButtonVisible(notifications.length > 0);
  }, [notifications]);

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
      pushApiErrorNotification(e);
    }
  };

  const triggers = {
    onClick: () => {
      if (notifications.length === 0) {
        fetchNotifications();
      } else {
        clearAllNotifications();
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

  const handleDeleteAllNotifications = async () => {
    try {
      const ids = notifications.map((notification) => notification.id);
      console.log(ids);

      const response = await deleteNotifications(ids);

      if (response.status === 200) {
        clearAllNotifications();
      }
    } catch (e) {
      pushApiErrorNotification(e);
    }
  };

  const clearAllNotifications = () => {
    setNotifications([]);
    pgNo.current = 0;
    setHasMore(true);
  };

  return (
    <Popover placement="bottom-end">
      <PopoverHandler {...triggers}>
        <IconButton variant="text" color="amber" className="rounded-full mr-2">
          <i className="fa fa-bell text-lg" />
        </IconButton>
      </PopoverHandler>
      <PopoverContent className="w-[30%] max-h-[80%] overflow-auto scrollbar-hidden mt-3">
        <div className="flex flex-row items-center justify-between mt-4 mb-3">
          <Typography variant="h5" className="text-black ml-2">
            알림
          </Typography>
          {isAllDeleteButtonVisible && (
            <Button
              variant="text"
              size="sm"
              color="red"
              className="p-1.5"
              onClick={handleDeleteAllNotifications}
            >
              전체 삭제
            </Button>
          )}
        </div>
        <Typography className="text-sm text-black ml-2 mb-4">
          전체 알림({notifications.length})개
        </Typography>
        <List>
          {notifications.length === 0 ? (
            <Typography className="flex justify-center text-gray-600">알림없음</Typography>
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
