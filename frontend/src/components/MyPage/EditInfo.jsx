import { useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Button from "../../common/components/Button";
import api from "../../service/Api";
import { pushNotification, pushApiErrorNotification } from "../common/Toast";

const EditInfo = () => {
  const location = useLocation();
  const { informations } = location.state;
  const [nickname, setNickname] = useState(informations.nickname);
  const [password, setPassword] = useState("");
  const [verifyPassword, setVerifyPassword] = useState("");
  const [email, setEmail] = useState(informations.email || "");
  const [description, setDescription] = useState(
    informations.description || ""
  );
  const [instaHandle, setInstaHandle] = useState(
    informations.instagramHandle || ""
  );
  const [youtubeHandle, setYoutubeHandle] = useState(
    informations.youtubeHandle || ""
  );
  const [emailId, setEmailId] = useState("");
  const [emailDomain, setEmailDomain] = useState("");
  const [profileImage, setProfileImage] = useState(null); // 파일을 저장할 state 추가
  const [profileImagePreview, setProfileImagePreview] = useState(null); // 미리보기용 state 추가
  const nav = useNavigate();

  useEffect(() => {
    if (email) {
      const [id, domain] = email.split("@");
      setEmailId(id || "");
      setEmailDomain(domain || "");
    }
  }, [email]);

  const handleFileChange = (file) => {
    const imageUrl = URL.createObjectURL(file);
    setProfileImagePreview(imageUrl);
    setProfileImage(file); // 파일을 state에 저장
  };

  const IdImage = ({ setFiles }) => {
    const handleImageChange = (e) => {
      const file = e.target.files[0];
      if (file) {
        setFiles(file);
      }
    };

    return (
      <div>
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="file-input file-input-primary-800 w-full max-w-xs"
        />

        {profileImagePreview && (
          <img
            src={profileImagePreview}
            alt="미리보기 이미지"
            style={{ width: "150px", height: "150px", objectFit: "cover" }}
          />
        )}
      </div>
    );
  };

  const handleEmailChange = (e) => {
    const fullEmail = e.target.value;
    setEmail(fullEmail);

    const [id, domain] = fullEmail.split("@");
    setEmailId(id || "");
    setEmailDomain(domain || "");
  };

  const handleSave = async () => {
    if (password !== verifyPassword) {
      pushNotification(
        "error",
        "비밀번호와 비밀번호 확인이 일치하지 않습니다."
      );
      return;
    }

    const updatedInfo = {
      nickname,
      password: password || undefined,
      emailId,
      emailDomain,
      description,
      instagramUrl: "https://www.instagram.com/" + instaHandle,
      youtubeUrl: "https://www.youtube.com/@" + youtubeHandle,
    };

    try {
      // 프로필 사진이 선택된 경우, 사진을 먼저 업로드
      if (profileImage) {
        const formData = new FormData();
        formData.append("profileImage", profileImage);

        const response = await api.patch("/users/me/profile-image", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        if (response.status !== 200) {
          pushNotification("error", "프로필 이미지 업데이트에 실패했습니다.");
          return;
        }
      }

      const response = await api.patch("/users/me", updatedInfo);

      if (response.status === 200) {
        nav("/mypage");
      } else {
        alert("정보 업데이트에 실패했습니다.");
      }
    } catch (e) {
      const status = e.response.status;

      if (status === 500) {
        pushNotification("error", "수정할 정보를 모두 입력해주세요.");
      } else {
        pushApiErrorNotification(e);
      }
    }
  };

  return (
    <div>
      <p className="font-bold text-2xl">내 정보 수정</p>
      <hr className="mt-2 mb-4" />
      <p className="font-bold mb-0.5 text-lg">프로필사진</p>
      <div className="mb-4">
        <IdImage setFiles={handleFileChange} />
      </div>
      <p className="font-bold mb-0.5 text-lg">닉네임</p>
      <input
        type="text"
        value={nickname}
        onChange={(e) => setNickname(e.target.value)}
        className="border border-first-800 w-full rounded-md mb-3 py-1 pl-3"
      />
      <p className="font-bold mb-0.5 text-lg">비밀번호</p>
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="border border-first-800 w-full rounded-md mb-3 py-1 pl-3"
      />
      <p className="font-bold mb-0.5 text-lg">비밀번호 확인</p>
      <input
        type="password"
        value={verifyPassword}
        onChange={(e) => setVerifyPassword(e.target.value)}
        className="border border-first-800 w-full rounded-md mb-3 py-1 pl-3"
      />
      <p className="font-bold mb-0.5 text-lg">이메일</p>
      <input
        type="email"
        value={email}
        onChange={handleEmailChange}
        className="border border-first-800 w-full rounded-md mb-3 py-1 pl-3"
      />
      <p className="font-bold mb-0.5 text-lg">자기소개</p>
      <input
        type="textarea"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="border border-first-800 w-full rounded-md mb-3 py-1 pl-3"
      />
      <div className="flex my-3">
        <p className="font-bold mb-0.5 text-lg w-28 flex items-center">
          인스타
        </p>
        &nbsp;
        <p className="flex items-center">https://www.instagram.com/</p>
        <input
          type="text"
          value={instaHandle}
          onChange={(e) => setInstaHandle(e.target.value)}
          className="border border-first-800 rounded-md ml-1 py-1 pl-3 flex w-full items-center"
        />
      </div>
      <div className="flex mt-3 items-center">
        <p className="font-bold mb-0.5 text-lg w-28 flex items-center">
          유튜브
        </p>
        &nbsp;
        <p className="flex items-center">https://www.youtube.com/@</p>
        <input
          type="text"
          value={youtubeHandle}
          onChange={(e) => setYoutubeHandle(e.target.value)}
          className="border border-first-800 rounded-md ml-1 py-1 pl-3 flex w-full items-center"
        />
      </div>
      <br />

      <div className="flex space-x-1 justify-end">
        <Button text="수정완료" type="edit-complete" onClick={handleSave} />
        <Button
          text="수정취소"
          type="edit-cancle"
          onClick={() => nav("/mypage")}
        />
      </div>
    </div>
  );
};

export default EditInfo;
