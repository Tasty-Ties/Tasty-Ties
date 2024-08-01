import MainPage from "./pages/MainPage";
import SignUp from "./pages/SignUp";
import SignUpSecond from "./components/SignUp/SignUpSecond";
import SignUpComplete from "./components/SignUp/SignUpComplete";
import Login from "./pages/Login";
import Mypage from "./pages/MyPage";
import ClassList from "@pages/ClassList";
import ClassDetail from "@pages/ClassDetail";
import ClassIntroduction from "@components/ClassDetail/ClassIntroduction";
import ClassIngredient from "@components/ClassDetail/ClassIngredient";
import ClassKitchenTools from "@components/ClassDetail/ClassKitchenTools";
import ClassReviews from "@components/ClassDetail/ClassReviews";
import ClassRegist from "./pages/ClassRegist";
import ClassWaiting from "./pages/ClassWaiting";
import LiveClass from "./pages/LiveClass";
import { Route, Routes } from "react-router-dom";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<MainPage />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/signupfin" element={<SignUpSecond />} />
      <Route path="/signupcomplete" element={<SignUpComplete />} />
      <Route path="/login" element={<Login />} />
      <Route path="/mypage" element={<Mypage />} />
      <Route path="/class" element={<ClassList />}>
        <Route path=":id" element={<ClassDetail />}>
          <Route path="" element={<ClassIntroduction />} />
          <Route path="ingredient" element={<ClassIngredient />} />
          <Route path="kitchentools" element={<ClassKitchenTools />} />
          <Route path="reviews" element={<ClassReviews />} />
        </Route>
      </Route>
      <Route path="/classregist" element={<ClassRegist />} />
      <Route path="/classwaiting" element={<ClassWaiting />} />
      <Route path="/liveclass" element={<LiveClass />} />
      {/* <Route path="/" element={< />} /> */}
    </Routes>
  );
};

export default AppRoutes;
