import { getMessaging, getToken, onMessage } from "firebase/messaging";
import { app as firebaseApp } from "./firebase";
import { pushNotification } from "../components/common/Toast";

const messaging = getMessaging(firebaseApp);

// Request notification permission & FCM token
export function requestPermission() {
  Notification.requestPermission().then((permission) => {
    if (permission === "granted") {
      getToken(messaging, {
        vapidKey: import.meta.env.VITE_FIREBASE_VAPID_KEY,
      }).then((currentToken) => {
        if (currentToken) {
          document.cookie = `fcmToken=${currentToken}; path=/; SameSite=Lax`;
        }
      });
    }
  });
}

//FCM foreground
export function onForegroundMessage() {
  onMessage(messaging, (payload) => {
    pushNotification("message", payload.notification.body);
  });
}

// Get FCM token
export function getFcmToken() {
  getToken(getMessaging(firebaseApp), {
    vapidKey: import.meta.env.VITE_FIREBASE_VAPID_KEY,
  }).then((currentToken) => {
    if (currentToken) {
      document.cookie = `fcmToken=${currentToken}; path=/; SameSite=Lax`;

      return currentToken;
    }
  });
}
