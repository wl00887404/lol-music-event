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
import SnsPosterTest from "./pages/SnsPosterTest";
import { cn } from "./libs/utils";
import { useViewport } from "./components/viewportStore";
import LuckyDraw from "./pages/LuckyDraw";
import { imgUri } from "./libs/uris";
import MoreRewardsPopup from "./components/dialogs/MoreRewardsPopup";

function App() {
  const location = useLocation();
  const team = useTeam();
  const viewport = useViewport();
  const prefix = viewport === "mobile" ? "m-" : "";

  const getBackgroundImage = () => {
    if (location.pathname === "/me" && team) {
      const uri = imgUri(`/backgrounds/${prefix}${team}.jpg`);
      return `url('${uri}')`;
    }

    const uri = imgUri(`/backgrounds/${prefix}main.jpg`);
    return `url('${uri}')`;
  };

  return (
    <div
      className={cn("bg-top bg-repeat-y bg-[length:100%]", "md:text-[12px]")}
      style={{ backgroundImage: getBackgroundImage() }}
    >
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/me" element={<Me />} />
        <Route path="/honor-roll" element={<HonorRoll />} />
        <Route path="/guidelines" element={<Guidelines />} />
        <Route path="/lucky-draw" element={<LuckyDraw />} />
        <Route
          path="/personal-data-protection"
          element={<Doc url="/docs/personal-data-protection.html" />}
        />
        <Route path="/sns-poster-test" element={<SnsPosterTest />} />
      </Routes>
      <Footer />
      <Dialogs />
      <ScrollToTop />
      <MoreRewardsPopup />
    </div>
  );
}

export default App;
