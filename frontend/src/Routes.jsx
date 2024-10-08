import MainCarouselPage from "./pages/MainCarouselPage";
import MainPage from "./pages/MainPage";
import SignUp from "./pages/SignUp";
import SignUpSecond from "./components/SignUp/SignUpSecond";
import SignUpComplete from "./components/SignUp/SignUpComplete";
import Login from "./pages/Login";
import MyPage from "./pages/MyPage";
import ReserveClass from "./components/MyPage/ReserveClass";
import TeachClass from "./components/MyPage/TeachClass";
import AttendClass from "./components/MyPage/AttendClass";
import MyInfo from "./components/MyPage/Myinfo";
import DeleteId from "./components/MyPage/MyInfo/DeleteId";
import MyPoint from "./components/MyPage/MyPoint";
import EditInfo from "./components/MyPage/EditInfo";
import Profile from "./pages/Profile";
import OtherInfo from "./components/Profile/OtherInfo";
import TeachedClass from "./components/Profile/TeachedClass";
import AttendedClass from "./components/Profile/AttendedClass";
import Review from "./components/Profile/Review";
import ClassList from "./pages/ClassList";
import ClassDetail from "./pages/ClassDetail";
import ClassIngredient from "./components/ClassDetail/ClassIngredient";
import ClassReviews from "./components/ClassDetail/ClassReviews";
import ClassDescription from "./components/ClassDetail/ClassDescription";
import ClassCookingTools from "./components/ClassDetail/ClassCookingTools";
import ClassRecipes from "./components/ClassDetail/ClassRecipes";
import ClassRegist from "./pages/ClassRegist";
import ClassWaiting from "./pages/ClassWaiting";
import LiveClass from "./pages/LiveClass";
import AlbumPage from "./pages/AlbumPage";
import { Navigate, Route, Routes } from "react-router-dom";
import ChatRoom from "./pages/ChatRoom";
import Ranking from "./../src/pages/Ranking";
import RegistClassComplete from "./components/ClassRegist/RegistClassComplete";
import ReviewWrite from "./components/LiveClass/ReviewWrite";
import ClassComplete from "./components/LiveClass/ClassComplete";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<MainPage />} />
      <Route path="/intro" element={<MainCarouselPage />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/signupfin" element={<SignUpSecond />} />
      <Route path="/signupcomplete" element={<SignUpComplete />} />
      <Route path="/login" element={<Login />} />
      <Route path="/mypage" element={<MyPage />}>
        <Route path="reserve" element={<ReserveClass />} />
        <Route path="teach" element={<TeachClass />} />
        <Route path="attend" element={<AttendClass />} />
        <Route path="" element={<MyInfo />} />
        <Route path="point" element={<MyPoint />} />
        <Route path="editinfo" element={<EditInfo />} />
      </Route>
      <Route path="/delete" element={<DeleteId />} />
      <Route path="/otherpage/:username" element={<Profile />}>
        <Route path="" element={<OtherInfo />} />
        <Route path="teach" element={<TeachedClass />} />
        <Route path="attend" element={<AttendedClass />} />
        <Route path="review" element={<Review />} />
      </Route>
      <Route path="/class" element={<ClassList />} />
      <Route path="/class/:id" element={<ClassDetail />}>
        <Route index element={<ClassDescription />} />
        <Route path="description" element={<ClassDescription />} />
        <Route path="ingredient" element={<ClassIngredient />} />
        <Route path="cookingTools" element={<ClassCookingTools />} />
        <Route path="recipes" element={<ClassRecipes />} />
        <Route path="reviews" element={<ClassReviews />} />
      </Route>
      <Route path="/classregist" element={<ClassRegist />} />
      <Route path="/registcomplete" element={<RegistClassComplete />} />
      <Route path="/classwaiting/:id" element={<ClassWaiting />} />
      <Route path="/liveclass" element={<LiveClass />} />
      <Route path="/album" element={<AlbumPage />} />
      <Route path="/chatting" element={<ChatRoom />} />
      <Route path="/ranking" element={<Ranking />} />
      <Route path="/reviewWrite" element={<ReviewWrite />} />
      <Route path="/classComplete" element={<ClassComplete />} />
      {/* <Route path="/" element={< />} /> */}
    </Routes>
  );
};

export default AppRoutes;
