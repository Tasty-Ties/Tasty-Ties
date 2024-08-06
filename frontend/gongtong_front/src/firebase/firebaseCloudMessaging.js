import { getMessaging, getToken, onMessage } from "firebase/messaging";
import { app as firebaseApp } from "./firebase";

const messaging = getMessaging(firebaseApp);

// Request notification permission & FCM token
export function requestPermission() {
    Notification.requestPermission().then((permission) => {
        if (permission === 'granted') {
            getToken(messaging, {
                vapidKey: import.meta.env.VITE_FIREBASE_VAPID_KEY
            }).then((currentToken) => {
                if (currentToken) {
                    console.log(currentToken);
                    // Save FCM token 
                }
            })
        }
    });
}

//FCM foreground
export function onForegroundMessage() {
    onMessage(messaging, (payload) => {
        console.log("Received forground message: ", payload);
    });
}