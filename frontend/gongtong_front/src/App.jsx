import AppRoutes from "./Routes";

import Header from "./components/Header";
import { useLocation, Navigate, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

import {
  requestPermission,
  onForegroundMessage,
} from "./firebase/firebaseCloudMessaging";
import { getFcmToken } from "./firebase/firebaseCloudMessaging";

// FCM permission & token
if (Notification.permission !== "granted") {
  requestPermission();
} else {
  // Save FCM token
  getFcmToken();
  onForegroundMessage();
}

function App() {
  const location = useLocation();
  const [isHeaderVisible, setIsHeaderVisible] = useState(true);
  const nav = useNavigate();

  useEffect(() => {
    if (location.pathname === "/liveclass") {
      setIsHeaderVisible(false);
    } else {
      setIsHeaderVisible(true);
    }
  }, [location.pathname]);

  return (
    <>
      {isHeaderVisible && <Header />}
      <AppRoutes />
    </>
  );
}

export default App;
