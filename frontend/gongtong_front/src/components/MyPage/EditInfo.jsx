import { useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Button from "../../common/components/Button";
import api from "../../service/Api";

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
  const nav = useNavigate();

  useEffect(() => {
    if (email) {
      const [id, domain] = email.split("@");
      setEmailId(id || "");
      setEmailDomain(domain || "");
    }
  }, [email]);

  const [profileImagePreview, setProfileImagePreview] = useState(null);

  // handleFileChange 함수 수정됨
  const handleFileChange = async (file) => {
    const formData = new FormData();
    formData.append("profileImage", file);

    const imageUrl = URL.createObjectURL(file);
    setProfileImagePreview(imageUrl);

    try {
      const response = await api.patch("/users/me/profile-image", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.status === 200) {
        alert("프로필 이미지가 성공적으로 업데이트되었습니다.");
      } else {
        alert("프로필 이미지 업데이트에 실패했습니다.");
      }
    } catch (error) {
      console.error("업로드 중 오류 발생:", error);
      alert("업로드 중 오류가 발생했습니다.");
    }
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
      alert("비밀번호와 비밀번호 확인이 일치하지 않습니다.");
      return;
    }

    const updatedInfo = {
      nickname,
      password: password || undefined, // 비밀번호가 비어있으면 보내지 않음
      emailId,
      emailDomain,
      description,
      instagramUrl: "https://www.instagram.com/" + instaHandle,
      youtubeUrl: "https://www.youtube.com/@" + youtubeHandle,
    };

    try {
      const response = await api.patch("/users/me", updatedInfo);

      if (response.status === 200) {
        alert("정보가 성공적으로 업데이트되었습니다.");
        nav("/mypage");
      } else {
        alert("정보 업데이트에 실패했습니다.");
      }
    } catch (error) {
      console.error("업데이트 중 오류 발생:", error);
      alert("업데이트 중 오류가 발생했습니다.");
    }
  };

  return (
    <div>
      <p className="text-xl mb-4">내 정보 수정</p>
      <p className="mb-1 text-sm">프로필사진</p>
      <p className="mb-2">
        <IdImage setFiles={handleFileChange} />
      </p>
      <p className="mb-1 text-sm">닉네임</p>
      <input
        type="text"
        value={nickname}
        onChange={(e) => setNickname(e.target.value)}
        className="border border-first-800 w-full rounded-md mb-2"
      />
      <p className="mb-1 text-sm">비밀번호</p>
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="border border-first-800 w-full rounded-md mb-2"
      />
      <p className="mb-1 text-sm">비밀번호 확인</p>
      <input
        type="password"
        value={verifyPassword}
        onChange={(e) => setVerifyPassword(e.target.value)}
        className="border border-first-800 w-full rounded-md mb-2"
      />
      <p className="mb-1 text-sm">이메일</p>
      <input
        type="email"
        value={email}
        onChange={handleEmailChange}
        className="border border-first-800 w-full rounded-md mb-2"
      />
      <p className="mb-1 text-sm">자기소개</p>

      <input
        type="textarea"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="border border-first-800 w-full rounded-md mb-2"
      />
      <div className="flex">
        <p className="mb-1 text-sm">인스타 https://www.instagram.com/</p>
        <input
          type="text"
          value={instaHandle}
          onChange={(e) => setInstaHandle(e.target.value)}
          className="border border-first-800 rounded-md w-24 mb-2 ml-1"
        />
      </div>
      <div className="flex">
        <p className="mb-1 text-sm">유튜브 https://www.youtube.com/@</p>
        <input
          type="text"
          value={youtubeHandle}
          onChange={(e) => setYoutubeHandle(e.target.value)}
          className="border border-first-800 rounded-md w-24 mb-2 ml-1"
        />
      </div>
      <br />

      <div className="space-x-40">
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
