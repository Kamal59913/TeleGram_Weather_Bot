import { BrowserRouter, Route, Routes } from "react-router-dom";
import SubscriberInfo from "../../Pages/SubscriberInfo";
import AdminLogin from "../../Pages/AdminLogin";
import WeatherPage from "../../Pages/WeatherPage";

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<WeatherPage />}></Route>
      <Route path="/adminlogin" element={<AdminLogin />}></Route>
      <Route path="/subscribe" element={<SubscriberInfo />}></Route>
    </Routes>
  );
}
export default AppRoutes;
