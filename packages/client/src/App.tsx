import { Routes, Route, useLocation } from "react-router";

import Home from "./pages/Home";
import Me from "./pages/Me";
import Doc from "./pages/Doc";

import Header from "./components/Header";
import Footer from "./components/Footer";
import ScrollToTop from "./components/ScrollToTop";
import Dialogs from "./components/dialogs";
import HonorRoll from "./pages/HonorRoll";
import Guidelines from "./pages/Guidelines";
import useTeam from "./hooks/useTeam";

function App() {
  const location = useLocation();
  const team = useTeam();

  const getBackgroundImage = () => {
    if (location.pathname === "/me" && team) {
      return `url('/backgrounds/${team}.jpg')`;
    }

    return "url('/backgrounds/bg.jpg')";
  };

  return (
    <div
      className="bg-top bg-repeat-y bg-[length:100%]"
      style={{ backgroundImage: getBackgroundImage() }}
    >
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/me" element={<Me />} />
        <Route path="/honor-roll" element={<HonorRoll />} />
        <Route path="/guidelines" element={<Guidelines />} />
        <Route
          path="/personal-data-protection"
          element={<Doc url="/docs/personal-data-protection.html" />}
        />
        <Route
          path="/privacy-policy"
          element={<Doc url="/docs/privacy-policy.html" />}
        />
        <Route
          path="/terms-of-service"
          element={<Doc url="/docs/terms-of-service.html" />}
        />
      </Routes>
      <Footer />
      <Dialogs />
      <ScrollToTop />
    </div>
  );
}

export default App;
