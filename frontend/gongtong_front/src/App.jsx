import AppRoutes from "./Routes";

import Header from "./components/common/Header";
import { useLocation, Navigate, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import "@fortawesome/fontawesome-free/css/all.min.css";

import { requestPermission, onForegroundMessage } from "./firebase/firebaseCloudMessaging";
import { getFcmToken } from "./firebase/firebaseCloudMessaging";

import Toast from "./components/common/Toast";

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
      <Toast />
    </>
  );
}

export default App;
