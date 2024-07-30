import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainPage from "./pages/MainPage";
import SignUp from "./pages/SignUp";
import SignUpSecond from "./components/SignUp/SignUpSecond";
import SignUpComplete from "./components/SignUp/SignUpComplete";
import ClassWaiting from "./pages/ClassWaiting";
import LiveClass from "./pages/LiveClass";

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/signupfin" element={<SignUpSecond />} />
        <Route path="/signupcomplete" element={<SignUpComplete />} />
        <Route path="/classwaiting" element={<ClassWaiting />} />
        <Route path="/liveclass" element={<LiveClass />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;
