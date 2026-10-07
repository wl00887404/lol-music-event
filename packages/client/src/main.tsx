import "./index.css";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/sonner";

import Home from "./pages/Home";
import Me from "./pages/Me";
import Doc from "./pages/Doc";

import Header from "./components/Header";
import Footer from "./components/Footer";
import ScrollToTop from "./components/ScrollToTop";
import Dialogs from "./components/dialogs";
import HonorRoll from "./pages/HonorRoll";
import { TooltipProvider } from "./components/ui/tooltip";
import Guidelines from "./pages/Guidelines";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: Infinity,
    },
  },
});

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <TooltipProvider>
      <BrowserRouter>
        <Toaster />
        <QueryClientProvider client={queryClient}>
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
        </QueryClientProvider>
      </BrowserRouter>
    </TooltipProvider>
  </StrictMode>,
);
