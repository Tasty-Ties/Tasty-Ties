import { Bounce, ToastContainer, toast } from "react-toastify";
import "react-toastify/ReactToastify.css";

export const pushNotification = (type, message) => {
  switch (type) {
    case "message":
      toast(`💬 ${message}`);
      break;
    case "error":
      toast.error(message);
      break;
    case "success":
      toast.success(message);
      break;
    case "info":
      toast.info(message);
      break;
  }
};

export const pushApiErrorNotification = (e) => {
  let status = e.response.status;

  if (status === 401) {
    toast.error("해당 요청에 대한 권한이 없습니다.");
  } else if (status === 405) {
    toast.error("해당 요청은 잘못된 요청입니다.");
  } else if (status >= 500) {
    toast.error(
      "서버에 문제가 있어 요청을 완료하지 못했습니다. 잠시 후에 다시 시도해 주세요. 문제가 계속된다면 고객 지원팀에 문의하세요."
    );
  }
};

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
};

export default Toast;
