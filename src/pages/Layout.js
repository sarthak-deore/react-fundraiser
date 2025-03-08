import React from "react";
import { Outlet } from "react-router-dom";
import { ToastContainer, Flip } from "react-toastify";

import { useTranslation } from "react-i18next";

// 3RD-PARTY STYLES
import "react-toastify/dist/ReactToastify.css";
import "react-h5-audio-player/lib/styles.css";
import "react-tippy/dist/tippy.css";
import "react-range-slider-input/dist/style.css";

// COMPONENTS
import Header from "../components/general/Header";
import Footer from "../components/general/Footer";
import ScrollToTop from "../components/general/ScrollToTop";

const LanguageSwitcher = () => {
  const { i18n } = useTranslation();

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
    window.location.reload();
  };

  return (
    <section
      className="container"
      style={{ marginTop: "6rem", marginBottom: "5rem" }}
    >
      <div className="dropdown" style={{ zIndex: 1000 }}>
        <button
          className="btn btn-primary btn-sm dropdown-toggle"
          type="button"
          id="languageDropdown"
          data-bs-toggle="dropdown"
          aria-expanded="false"
        >
          {i18n.language === "de" ? "Deutsch" : "English"}
        </button>
        <ul className="dropdown-menu" aria-labelledby="languageDropdown">
          <li>
            <button
              className={`dropdown-item ${
                i18n.language === "en" ? "active" : ""
              }`}
              onClick={() => changeLanguage("en")}
            >
              English
            </button>
          </li>
          <li>
            <button
              className={`dropdown-item ${
                i18n.language === "de" ? "active" : ""
              }`}
              onClick={() => changeLanguage("de")}
            >
              Deutsch
            </button>
          </li>
        </ul>
      </div>
    </section>
  );
};

function Layout() {
  return (
    <>
      <Header />
      <LanguageSwitcher />
      <ScrollToTop />
      <Outlet />
      <Footer />

      <ToastContainer
        position="top-center"
        autoClose={1500}
        transition={Flip}
      />
    </>
  );
}

export default Layout;
