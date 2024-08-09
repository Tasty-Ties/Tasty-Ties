import { useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Button from "../../common/components/Button";
import IdImage from "./EditInfo/IdImage";
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

  const handleFileChange = async (file) => {
    const formData = new FormData();
    formData.append("profileImage", file);

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
      <h1>내 정보 수정</h1>
      <br />
      <IdImage setFiles={handleFileChange} />

      <section>
        닉네임:
        <input
          type="text"
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
        />
      </section>
      <br />
      <section>
        비밀번호:
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </section>
      <br />
      <section>
        비밀번호 확인:
        <input
          type="password"
          value={verifyPassword}
          onChange={(e) => setVerifyPassword(e.target.value)}
        />
      </section>
      <br />
      <section>
        이메일:
        <input type="email" value={email} onChange={handleEmailChange} />
      </section>
      <br />
      <section>
        자기소개:
        <input
          type="textarea"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </section>
      <br />
      <section>
        인스타: https://www.instagram.com/
        <input
          type="text"
          value={instaHandle}
          onChange={(e) => setInstaHandle(e.target.value)}
        />
      </section>
      <br />
      <section>
        유튜브: https://www.youtube.com/@
        <input
          type="text"
          value={youtubeHandle}
          onChange={(e) => setYoutubeHandle(e.target.value)}
        />
      </section>
      <br />
      <Button text="저장하기" type="green-sqr" onClick={handleSave} />
      <Button text="취소" type="gray-sqr" onClick={() => nav("/mypage")} />
    </div>
  );
};

export default EditInfo;
