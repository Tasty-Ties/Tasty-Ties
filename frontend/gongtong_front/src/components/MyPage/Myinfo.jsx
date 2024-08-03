const MyInfo = ({ informations }) => {
  if (!informations) {
    return <div>정보가 없습니다.</div>;
  }

  return (
    <div>
      <h1>내 정보</h1>
      <p>닉네임: {informations.nickname}</p>
      <p>국적: {informations.country?.koreanName || "국적 정보 없음"}</p>
      <p>모국어: {informations.language?.koreanName || "국적 정보 없음"}</p>
      <p>마일리지: {informations.activityPoint}</p>
      <p>이메일: {informations.email}</p>
      <p>생년월일: {informations.birth}</p>
      <p>수집한 국기: {informations.colletedFlags}</p>
      <p>SNS 연동 현황: {informations.youtubeHandle}</p>
      <p>SNS 연동 현황: {informations.instagramHandle}</p>
    </div>
  );
};

export default MyInfo;
