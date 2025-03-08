import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "aos/dist/aos.css";
import * as bootstrap from "bootstrap";

// Import i18n instance before other components
import "./i18n";

// PAGES
import Layout from "./pages/Layout";
import RegisterPage from "./pages/register";
import LoginPage from "./pages/login";
import ProfilePage from "./pages/profile";
import CreateCampaignPage from "./pages/campaign-create";
import CampaingSinglePage from "./pages/campaign-single";
import CampaignsPage from "./pages/campaigns";
import AboutUsPage from "./pages/about";
import CommunityChat from "./components/general/CommunityChat";
import AdminPanel from "./pages/admin";
import FAQsPage from "./pages/faqs";
import AuthProvider from "./context/authContext";
import UserProfile from "./pages/user";
import HomePage from "./pages/home";

// HOOKS
import useUser from "./hooks/useUser";

window.bootstrap = bootstrap;

function App() {
  const { isRegistered } = useUser();

  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route exact path="/" element={<CampaignsPage />} />
            {!isRegistered && (
              <Route path="/signup" element={<RegisterPage />} />
            )}
            <Route path="/campaigns/:id" element={<CampaingSinglePage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/create-campaign" element={<CreateCampaignPage />} />
            <Route path="/user/:username" element={<UserProfile />} />
            <Route path="/campaigns" element={<CampaignsPage />} />

            <Route path="/about-us" element={<AboutUsPage />} />

            <Route path="/faqs" element={<FAQsPage />} />
            <Route path="/make-money" element={<HomePage />} />

            <Route path="/admin" element={<AdminPanel />} />
            <Route path="/community-chat" element={<CommunityChat />} />

            {/* 404 */}
            <Route path="/*" element={<CampaignsPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
