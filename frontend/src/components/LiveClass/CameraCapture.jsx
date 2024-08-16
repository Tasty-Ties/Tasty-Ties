import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
} from "@headlessui/react";
import useVideoStore from "../../store/useVideoStore";
import { useRef } from "react";
import IconButton from "../../common/components/IconButton";
import StreamComponent from "./StreamComponent";

const CameraCapture = ({ isCaptureOpen, captureOpen, localUser }) => {
  const liveClassImage = useVideoStore((state) => state.liveClassImage);
  const setLiveClassImage = useVideoStore((state) => state.setLiveClassImage);
  const setRemoveLiveClassImage = useVideoStore(
    (state) => state.setRemoveLiveClassImage
  );
  const setEmptyLiveClassImage = useVideoStore(
    (state) => state.setEmptyLiveClassImage
  );

  const canvasRef = useRef(null);

  // dataURL을 Blob으로 변환하는 함수
  const dataURLToBlob = (dataURL) => {
    const binaryString = window.atob(dataURL.split(",")[1]);
    const arrayBuffer = new ArrayBuffer(binaryString.length);
    const uint8Array = new Uint8Array(arrayBuffer);

    for (let i = 0; i < binaryString.length; i++) {
      uint8Array[i] = binaryString.charCodeAt(i);
    }

    return new Blob([uint8Array], { type: "image/jpeg" });
  };

  const takePhoto = (e) => {
    if (
      isCaptureOpen &&
      document.getElementById(
        "video-" + localUser.getStreamManager().stream.streamId
      )
    ) {
      const canvas = canvasRef.current;
      const video = document.getElementById(
        "video-" + localUser.getStreamManager().stream.streamId
      );
      const context = canvas.getContext("2d");

      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      context.scale(-1, 1);
      context.drawImage(video, -canvas.width, 0, canvas.width, canvas.height);

      const dataUrl = canvas.toDataURL("image/jpeg");
      const blob = dataURLToBlob(dataUrl);
      const objectURL = URL.createObjectURL(blob);

      setLiveClassImage(e.target.value, objectURL);

      // const link = document.createElement("a");
      // link.href = dataUrl;
      // link.download = "screenshot.jpg";
      // link.click();
    }
  };

  const xIcon = (index) => {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="white"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        className="size-6 rotate-45 absolute -right-2 -top-2 z-50"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
          onClick={() => setRemoveLiveClassImage(index)}
        />
      </svg>
    );
  };

  return (
    <Dialog
      open={isCaptureOpen}
      onClose={captureOpen}
      className="relative z-50"
    >
      <DialogBackdrop
        transition
        className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in"
      />

      <div className="fixed inset-0 z-50 w-4/6 overflow-y-auto place-self-center">
        <div className="flex min-h-full items-center justify-center p-4 text-center sm:items-center sm:p-0">
          <DialogPanel
            transition
            className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all data-[closed]:translate-y-4 data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in sm:my-8 sm:w-full sm:max-w-lg data-[closed]:sm:translate-y-0 data-[closed]:sm:scale-95"
          >
            <div className=" absolute right-2 top-2" onClick={captureOpen}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="size-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18 18 6M6 6l12 12"
                />
              </svg>
            </div>
            <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
              <div className="sm:flex sm:items-start">
                <div className="mt-3 text-left sm:ml-4 sm:mt-0 sm:text-left">
                  <DialogTitle
                    as="h3"
                    className="text-base font-semibold leading-6 text-gray-900"
                  >
                    현재 사진이 마음에 드신다면, 버튼을 클릭하여 저장해보세요!
                    <br />
                    사진은 자유롭게 변경이 가능하며, 최대 4장의 사진까지 저장
                    가능합니다.
                  </DialogTitle>

                  <div className="mt-2 grid grid-cols-4 grid-rows-2 gap-2">
                    {liveClassImage[0] ? (
                      <div className="relative">
                        <img src={liveClassImage[0]} />
                        {xIcon(0)}
                      </div>
                    ) : (
                      <IconButton
                        type="screen-capture"
                        icon="screen-capture"
                        onClick={takePhoto}
                        value="0"
                      />
                    )}
                    {liveClassImage[1] ? (
                      <div className="relative">
                        <img src={liveClassImage[1]} />
                        {xIcon(1)}
                      </div>
                    ) : (
                      <IconButton
                        type="screen-capture"
                        icon="screen-capture"
                        onClick={takePhoto}
                        value="1"
                      />
                    )}
                    <div className="col-start-3 col-span-2 row-start-1 row-span-2">
                      <StreamComponent user={localUser} />
                    </div>
                    {liveClassImage[2] ? (
                      <div className="relative">
                        <img src={liveClassImage[2]} />
                        {xIcon(2)}
                      </div>
                    ) : (
                      <IconButton
                        type="screen-capture"
                        icon="screen-capture"
                        onClick={takePhoto}
                        value="2"
                      />
                    )}
                    {liveClassImage[3] ? (
                      <div className="relative">
                        <img src={liveClassImage[3]} />
                        {xIcon(3)}
                      </div>
                    ) : (
                      <IconButton
                        type="screen-capture"
                        icon="screen-capture"
                        onClick={takePhoto}
                        value="3"
                      />
                    )}
                  </div>
                </div>
              </div>
            </div>
            {/* <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6 flex justify-end">
          <IconButton
            text="다시 촬영하기"
            icon="take-photo"
            type="green-border-short"
          />
          <IconButton
            text="임시저장"
            icon="take-photo"
            type="green-border-short"
          />
          <IconButton
            text="저장하기"
            icon="download-photo"
            type="green-border-short"
          />
        </div> */}
          </DialogPanel>
        </div>
      </div>
      <canvas ref={canvasRef} style={{ display: "none" }}></canvas>
    </Dialog>
  );
};

export default CameraCapture;
