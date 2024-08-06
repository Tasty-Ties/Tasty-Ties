import AppRoutes from "./Routes";

import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import Header from "./components/Header";
import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { listItemSecondaryActionClasses } from "@mui/material";

import {requestPermission, onForegroundMessage} from "./firebase/firebaseCloudMessaging";

// FCM permission & token
if (Notification.permission !== 'granted') {
  requestPermission();
} else {
  onForegroundMessage();
}

function App() {
  const location = useLocation();
  const [isHeaderVisible, setIsHeaderVisible] = useState(true);

  useEffect(() => {
    if (location.pathname === "/liveclass") {
      setIsHeaderVisible(false);
    } else {
      setIsHeaderVisible(true);
    }
  }, [location.pathname]);
  return (
    <>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        {isHeaderVisible && <Header />}
        <AppRoutes />
      </LocalizationProvider>
    </>
  );
}

export default App;
