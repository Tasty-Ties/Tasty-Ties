import {
  Button,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
} from "@material-tailwind/react";

import useVideoStore from "../../store/useVideoStore";
import { useEffect, useState } from "react";
import api from "./../../service/Api";
import useMyPageStore from "../../store/MyPageStore";
import { useNavigate } from "react-router-dom";
import Complete from "../../common/pages/Complete";

const ExitLiveClass = ({
  exitOpen,
  isExitOpen,
  isHost,
  isForcedExit,
  userId,
  classId,
}) => {
  const liveClassImage = useVideoStore((state) => state.liveClassImage);
  const navigate = useNavigate();
  const setEmptyLiveClassImage = useVideoStore(
    (state) => state.setEmptyLiveClassImage
  );

  const [isImageExist, setIsImageExist] = useState(false);

  const userInfo = useMyPageStore((state) => state.informations);
  const classData = useVideoStore((state) => state.classData);

  useEffect(() => {
    for (const image of liveClassImage) {
      if (image) {
        setIsImageExist(true);
        break;
      }
    }
  }, [liveClassImage]);

  const handleExit = async () => {
    if (!isImageExist && isHost) {
      alert("기념사진을 찍어주세요!");
      return;
    } else if (isImageExist) {
      // 앨범 사진 저장
      const formData = new FormData();
      for (let i = 0; i < liveClassImage.length; i++) {
        const image = liveClassImage[i];
        if (image) {
          const response = await fetch(image);
          const blob = await response.blob();
          //-------------------------------------------------
          const file = new File([blob], `image_${i}.jpg`, {
            type: "image/jpeg",
          });
          //-------------------------------------------------
          formData.append("images", file);
        }
      }
      const albumDto = JSON.stringify({
        folderName: classData.title,
        cookingClassUuid: classData.uuid,
        countryCode: classData.countryCode,
      });
      try {
        formData.append(
          "folderRegisterDto",
          new Blob([albumDto], {
            type: "application/json",
          })
        );
        // for (let pair of formData.entries()) {
        //   console.log(pair[0] + ":", pair[1]);
        // }
        const response = await api.post("/albums/register-folder", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
      } catch (error) {
        console.error(error);
      } finally {
        setEmptyLiveClassImage();
      }
    }

    // 세션키 삭제
    if (isHost) {
      try {
        const exitResponse = await api.delete(
          `/classes/live/sessions/${classId}`
        );
        console.log(exitResponse);
      } catch (error) {
        console.error();
      }
    }

    // 마일리지 추가
    try {
      const response = await api.post("/ranking/add", {
        activityPointRequestDto: {
          userId: userInfo.userId,
          score: isHost ? 50 : 5,
          description: isHost ? `클래스 진행` : "클래스 참여",
        },
        host: isHost,
      });
      console.log(response);
    } catch (error) {
      console.error(error);
    }

    // 이동
    if (isHost) {
      navigate("/classcomplete", {
        replace: true,
      });
    } else {
      navigate("/reviewWrite", {
        replace: true,
      });
    }
  };

  return (
    <>
      <Dialog open={isExitOpen} handler={exitOpen}>
        <DialogHeader>클래스 퇴장</DialogHeader>
        <DialogBody>
          {isHost ? (
            <>
              <div>정말 클래스를 나가시겠습니까?</div>
              <div>
                퇴장 시 수업이 종료되고 아래 사진이 요리 앨범에 저장됩니다.
              </div>
            </>
          ) : isForcedExit ? (
            <>
              <div>호스트가 클래스를 종료했습니다.</div>
              {isImageExist ? (
                <div>아래 사진이 요리 앨범에 저장됩니다.</div>
              ) : null}
            </>
          ) : (
            <>
              <div>지금 나가시면 재입장이 불가합니다.</div>
              {isImageExist ? (
                <div>퇴장 시 아래 사진이 요리 앨범에 저장됩니다.</div>
              ) : null}
            </>
          )}
          <div className="mt-2 grid grid-cols-4 grid-rows-1 gap-2">
            {liveClassImage.map((image, i) =>
              image ? <img src={image} key={i} /> : null
            )}
          </div>
        </DialogBody>
        <DialogFooter>
          {!isForcedExit && (
            <Button variant="text" onClick={exitOpen} className="mr-1">
              <span>돌아가기</span>
            </Button>
          )}
          <Button variant="gradient" color="green" onClick={handleExit}>
            <span>나가기</span>
          </Button>
        </DialogFooter>
      </Dialog>
    </>
  );
};

export default ExitLiveClass;
