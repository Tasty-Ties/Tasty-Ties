import axios from "axios";
import React, { useEffect } from "react";
import { Link, Outlet, useNavigate, useParams } from "react-router-dom";
import useClassRegistStore from "./../store/ClassRegistStore";
import ClassEnrollUsers from "../components/ClassDetail/ClassEnrollUsers";
import {
  setClassReservation,
  setDeleteClass,
  setDeleteClassReservation,
} from "../service/ClassRegistAPI";

import "@styles/ClassDetail/ClassDetail.css";
import ClassImageCarousel from "../components/ClassDetail/ClassImageCarousel";

const FRONT_SERVER_URL = import.meta.env.VITE_FRONT_SERVER;

const ClassDetail = () => {
  const { id } = useParams();

  const { classDetail, fetchClassDetail } = useClassRegistStore((state) => ({
    classDetail: state.classDetail,
    fetchClassDetail: state.fetchClassDetail,
  }));
  console.log(classDetail);

  useEffect(() => {
    fetchClassDetail(id);
  }, [id]);

  const handleClassReservation = async (e) => {
    try {
      await setClassReservation(id);
      alert("등록 완료!");
      fetchClassDetail(id);
    } catch (error) {
      console.error("클래스 예약 실패:", error);
    }
  };

  const cancelClassReservation = async (e) => {
    try {
      await setDeleteClassReservation(id);
      alert("취소 완료!");
      fetchClassDetail(id);
    } catch (error) {
      console.error("클래스 예약 취소 실패:", error);
    }
  };

  const deleteClass = async (e) => {
    try {
      let isTrue = confirm("정말 삭제하시겠습니까?");
      if (isTrue) {
        await setDeleteClass(id);
        alert("삭제 완료!");
        window.location.replace("/class");
      }
    } catch (error) {
      console.error("클래스 삭제 실패", error);
    }
  };

  return (
    <div className="detail-container">
      <ClassImageCarousel classDetail={classDetail} />
      <div className="class-info-box">
        <div className="title">{classDetail.title}</div>
        <div className="nickname-box">
          <span>{classDetail.dishName}</span>
          <img
            src={`${FRONT_SERVER_URL}/images/classImages/Korea.png`}
            alt="국가 이미지"
          />
        </div>
        <div className="sub-box">
          <div className="class-detail-rating-box">
            <div className="rating">
              <div className="detail-rating-status">
                {[5, 4, 3, 2, 1].map((rating) => (
                  <React.Fragment key={`rating-${rating}`}>
                    <input
                      type="radio"
                      className="detail-rating"
                      id={`rate-${rating}`}
                      checked={rating <= classDetail.level}
                    />
                    <label htmlFor={`rate-${rating}`}>⭐</label>
                  </React.Fragment>
                ))}
              </div>
            </div>
          </div>
          <div className="btn-box">
            {!classDetail.userEnrolled && !classDetail.host && (
              <button onClick={handleClassReservation}>
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 14 12"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M5.25 8.75H0.75V7.25H5.25V2.75H6.75V7.25H11.25V8.75H6.75V13.25H5.25V8.75Z"
                    fill="white"
                  />
                </svg>
                <span>예약하기</span>
              </button>
            )}
            {classDetail.userEnrolled && !classDetail.host && (
              <button onClick={cancelClassReservation}>
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 14 12"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M5.25 8.75H0.75V7.25H5.25V2.75H6.75V7.25H11.25V8.75H6.75V13.25H5.25V8.75Z"
                    fill="white"
                  />
                </svg>
                <span>예약 취소</span>
              </button>
            )}
            {classDetail.host && (
              <button onClick={deleteClass}>
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 14 12"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M5.25 8.75H0.75V7.25H5.25V2.75H6.75V7.25H11.25V8.75H6.75V13.25H5.25V8.75Z"
                    fill="white"
                  />
                </svg>
                <span>강의 삭제하기</span>
              </button>
            )}
          </div>
          <div className="people-box">
            <ClassEnrollUsers classDetail={classDetail} />
          </div>
        </div>
      </div>
      <div className="user-info-box">
        <div className="user-box">
          <img
            src={`${FRONT_SERVER_URL}/images/classImages/user-img.png`}
            alt="유저 이미지"
          />
          <span>{classDetail.hostName}</span>
        </div>
        <div>
          <div className="icon-box">
            <svg
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M13.3 14.7L14.7 13.3L11 9.6V5H9V10.4L13.3 14.7ZM10 20C8.61667 20 7.31667 19.7375 6.1 19.2125C4.88333 18.6875 3.825 17.975 2.925 17.075C2.025 16.175 1.3125 15.1167 0.7875 13.9C0.2625 12.6833 0 11.3833 0 10C0 8.61667 0.2625 7.31667 0.7875 6.1C1.3125 4.88333 2.025 3.825 2.925 2.925C3.825 2.025 4.88333 1.3125 6.1 0.7875C7.31667 0.2625 8.61667 0 10 0C11.3833 0 12.6833 0.2625 13.9 0.7875C15.1167 1.3125 16.175 2.025 17.075 2.925C17.975 3.825 18.6875 4.88333 19.2125 6.1C19.7375 7.31667 20 8.61667 20 10C20 11.3833 19.7375 12.6833 19.2125 13.9C18.6875 15.1167 17.975 16.175 17.075 17.075C16.175 17.975 15.1167 18.6875 13.9 19.2125C12.6833 19.7375 11.3833 20 10 20ZM10 18C12.2167 18 14.1042 17.2208 15.6625 15.6625C17.2208 14.1042 18 12.2167 18 10C18 7.78333 17.2208 5.89583 15.6625 4.3375C14.1042 2.77917 12.2167 2 10 2C7.78333 2 5.89583 2.77917 4.3375 4.3375C2.77917 5.89583 2 7.78333 2 10C2 12.2167 2.77917 14.1042 4.3375 15.6625C5.89583 17.2208 7.78333 18 10 18Z"
                fill="black"
              />
            </svg>
            <span>실시간 클래스 시간 : </span>
            <span>
              {classDetail.cookingClassStartTime &&
                classDetail.cookingClassEndTime &&
                `${classDetail.cookingClassStartTime.substring(0, 10)} 
                  ${classDetail.cookingClassStartTime.substring(11, 16)} ~ 
                  ${classDetail.cookingClassEndTime.substring(11, 16)}`}
            </span>
          </div>
          <div className="icon-box">
            <svg
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M10 20C8.63333 20 7.34167 19.7375 6.125 19.2125C4.90833 18.6875 3.84583 17.9708 2.9375 17.0625C2.02917 16.1542 1.3125 15.0917 0.7875 13.875C0.2625 12.6583 0 11.3667 0 10C0 8.61667 0.2625 7.32083 0.7875 6.1125C1.3125 4.90417 2.02917 3.84583 2.9375 2.9375C3.84583 2.02917 4.90833 1.3125 6.125 0.7875C7.34167 0.2625 8.63333 0 10 0C11.3833 0 12.6792 0.2625 13.8875 0.7875C15.0958 1.3125 16.1542 2.02917 17.0625 2.9375C17.9708 3.84583 18.6875 4.90417 19.2125 6.1125C19.7375 7.32083 20 8.61667 20 10C20 11.3667 19.7375 12.6583 19.2125 13.875C18.6875 15.0917 17.9708 16.1542 17.0625 17.0625C16.1542 17.9708 15.0958 18.6875 13.8875 19.2125C12.6792 19.7375 11.3833 20 10 20ZM10 17.95C10.4333 17.35 10.8083 16.725 11.125 16.075C11.4417 15.425 11.7 14.7333 11.9 14H8.1C8.3 14.7333 8.55833 15.425 8.875 16.075C9.19167 16.725 9.56667 17.35 10 17.95ZM7.4 17.55C7.1 17 6.8375 16.4292 6.6125 15.8375C6.3875 15.2458 6.2 14.6333 6.05 14H3.1C3.58333 14.8333 4.1875 15.5583 4.9125 16.175C5.6375 16.7917 6.46667 17.25 7.4 17.55ZM12.6 17.55C13.5333 17.25 14.3625 16.7917 15.0875 16.175C15.8125 15.5583 16.4167 14.8333 16.9 14H13.95C13.8 14.6333 13.6125 15.2458 13.3875 15.8375C13.1625 16.4292 12.9 17 12.6 17.55ZM2.25 12H5.65C5.6 11.6667 5.5625 11.3375 5.5375 11.0125C5.5125 10.6875 5.5 10.35 5.5 10C5.5 9.65 5.5125 9.3125 5.5375 8.9875C5.5625 8.6625 5.6 8.33333 5.65 8H2.25C2.16667 8.33333 2.10417 8.6625 2.0625 8.9875C2.02083 9.3125 2 9.65 2 10C2 10.35 2.02083 10.6875 2.0625 11.0125C2.10417 11.3375 2.16667 11.6667 2.25 12ZM7.65 12H12.35C12.4 11.6667 12.4375 11.3375 12.4625 11.0125C12.4875 10.6875 12.5 10.35 12.5 10C12.5 9.65 12.4875 9.3125 12.4625 8.9875C12.4375 8.6625 12.4 8.33333 12.35 8H7.65C7.6 8.33333 7.5625 8.6625 7.5375 8.9875C7.5125 9.3125 7.5 9.65 7.5 10C7.5 10.35 7.5125 10.6875 7.5375 11.0125C7.5625 11.3375 7.6 11.6667 7.65 12ZM14.35 12H17.75C17.8333 11.6667 17.8958 11.3375 17.9375 11.0125C17.9792 10.6875 18 10.35 18 10C18 9.65 17.9792 9.3125 17.9375 8.9875C17.8958 8.6625 17.8333 8.33333 17.75 8H14.35C14.4 8.33333 14.4375 8.6625 14.4625 8.9875C14.4875 9.3125 14.5 9.65 14.5 10C14.5 10.35 14.4875 10.6875 14.4625 11.0125C14.4375 11.3375 14.4 11.6667 14.35 12ZM13.95 6H16.9C16.4167 5.16667 15.8125 4.44167 15.0875 3.825C14.3625 3.20833 13.5333 2.75 12.6 2.45C12.9 3 13.1625 3.57083 13.3875 4.1625C13.6125 4.75417 13.8 5.36667 13.95 6ZM8.1 6H11.9C11.7 5.26667 11.4417 4.575 11.125 3.925C10.8083 3.275 10.4333 2.65 10 2.05C9.56667 2.65 9.19167 3.275 8.875 3.925C8.55833 4.575 8.3 5.26667 8.1 6ZM3.1 6H6.05C6.2 5.36667 6.3875 4.75417 6.6125 4.1625C6.8375 3.57083 7.1 3 7.4 2.45C6.46667 2.75 5.6375 3.20833 4.9125 3.825C4.1875 4.44167 3.58333 5.16667 3.1 6Z"
                fill="#1D1B20"
              />
            </svg>

            <span>언어 : </span>
            <span>{classDetail.languageName}</span>
          </div>
          <div className="icon-box">
            <svg
              width="20"
              height="16"
              viewBox="0 0 20 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M2 16C1.45 16 0.975 15.8083 0.575 15.425C0.191667 15.025 0 14.55 0 14V2C0 1.45 0.191667 0.983334 0.575 0.599999C0.975 0.2 1.45 0 2 0H14C14.55 0 15.0167 0.2 15.4 0.599999C15.8 0.983334 16 1.45 16 2V6.5L20 2.5V13.5L16 9.5V14C16 14.55 15.8 15.025 15.4 15.425C15.0167 15.8083 14.55 16 14 16H2ZM2 14H14V2H2V14ZM2 14V2V14Z"
                fill="black"
              />
            </svg>

            <div>
              <span>다시보기 기간 : </span>
              <span>
                {classDetail.replayEndTime &&
                  `${classDetail.replayEndTime.substring(
                    0,
                    10
                  )} ${classDetail.replayEndTime.substring(11, 16)}`}
              </span>
            </div>
          </div>
        </div>
        <div className="caution-box">
          {classDetail.cookingClassTags &&
            classDetail.cookingClassTags.map((tag, index) => (
              <span key={index}>{tag}</span>
            ))}
        </div>
      </div>
      <hr />
      <div className="class-info-menu">
        <Link to="">클래스 소개</Link>
        <Link to="ingredient">식재료</Link>
        <Link to="cookingTools">조리 도구</Link>
        <Link to="recipes">레시피</Link>
        <Link to="reviews">수강평</Link>
      </div>
      <Outlet
        context={{
          description: classDetail.description,
          ingredients: classDetail.ingredients,
          cookingTools: classDetail.cookingTools,
          recipes: classDetail.recipe,
        }}
      />
    </div>
  );
};

export default ClassDetail;
