import { Bounce, ToastContainer, toast } from "react-toastify";
import "react-toastify/ReactToastify.css";

export const pushNotification = (type, message) => {
    switch (type) {
        case 'message':
            toast(`💬 ${message}`);
            break;
    }
}

export const Toast = () => {
    return (
        <ToastContainer
        position="bottom-right"
        autoClose={5000}
        hideProgressBar
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        transition={Bounce}
        stacked
      />
    );
}

export default Toast;