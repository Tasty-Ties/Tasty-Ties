import AppRoutes from "./Routes";

// import { LocalizationProvider } from "@mui/x-date-pickers";
// import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import Header from "./components/Header";
import { useLocation, Navigate, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
// import { listItemSecondaryActionClasses } from "@mui/material";

import {
  requestPermission,
  onForegroundMessage,
} from "./firebase/firebaseCloudMessaging";
<<<<<<< HEAD
import { getMessaging, getToken } from "firebase/messaging";
import { app as firebaseApp } from "./firebase/firebase";
=======
import { getFcmToken } from "./firebase/firebaseCloudMessaging";
>>>>>>> 4834be9a03a1397c2442434cb3f750b667577897

// FCM permission & token
if (Notification.permission !== "granted") {
  requestPermission();
} else {
  // Save FCM token
<<<<<<< HEAD
  getToken(getMessaging(firebaseApp), {
    vapidKey: import.meta.env.VITE_FIREBASE_VAPID_KEY,
  }).then((currentToken) => {
    if (currentToken) {
      document.cookie = `fcmToken=${currentToken}; path=/; SameSite=Lax`;
    }
  });
=======
  getFcmToken();
>>>>>>> 4834be9a03a1397c2442434cb3f750b667577897
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
      {/* <LocalizationProvider dateAdapter={AdapterDayjs}> */}
      {isHeaderVisible && <Header />}
      <AppRoutes />
      {/* </LocalizationProvider> */}
    </>
  );
}

export default App;
