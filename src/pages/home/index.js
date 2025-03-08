import React, { useContext } from "react";
import { AuthContext } from "../../context/authContext";
import { HiOutlinePresentationChartBar } from "react-icons/hi";
import { RiMoneyDollarCircleLine } from "react-icons/ri";
import "./home.css";
import { useTranslation } from "react-i18next";

// COMPONENTS

function HomePage() {
  const { isAuthenticated } = useContext(AuthContext);
  const { t } = useTranslation();

  return (
    <section className="hero-banner-bg">
      <div
        className="container custom-contain"
        style={{
          paddingTop: "8rem",
          paddingBottom: "5rem",
        }}
      >
        {/* First Row: Make Money as a Creator */}
        <div className="row align-items-center mt-5 mb-5">
          <div className="col-lg-5">
            <p className="h5 text-primary">{t("word16")}</p>
            <h1 className="text-white d-sm-none text-xxl">{t("word17")}</h1>
            <h1 className="text-white d-none d-sm-block text-xxl">
              {t("word17")}
            </h1>
            <p className="text-white text-muted" style={{ fontSize: "16px" }}>
              {t("word18")}
            </p>
            <a href="/campaigns" className="btn btn-primary">
              {t("word19")}
            </a>
            <a href="/faqs" className="btn btn-transparent">
              {t("word3")}
            </a>
          </div>
          <div
            className="col-lg-6 text-center mt-5 text-lg-end custom-element"
            style={{
              marginBottom: "20px",
            }}
          >
            <div className="d-inline-block">
              <div className="oval-holder">
                <img
                  src="make_money.png"
                  alt="Make Money"
                  className="img-fluid oval"
                  style={{ maxWidth: "100%" }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Visible only on medium screens and larger (desktop) */}
        <div
          className="d-none d-md-block"
          style={{ paddingTop: "40px", paddingBottom: "40px" }}
        ></div>

        {/* Visible only on small screens and smaller (mobile) */}
        <div
          className="d-md-none"
          style={{ paddingTop: "0px", paddingBottom: "0px" }}
        ></div>

        {/* Second Row: Ready to start earning */}
        <div
          className="container mt-5 mb-5 px-4 py-4"
          style={{
            backgroundColor: "#171f29",
            borderRadius: "10px",
          }}
        >
          <div className="row text-center">
            <div className="d-flex flex-column flex-md-row align-items-center justify-content-center">
              <div className="text-center text-md-start mb-0 mb-md-0">
                <h5
                  className="text-muted"
                  style={{ fontSize: "18px", marginTop: "10px" }}
                >
                  {t("word20")}
                </h5>
                <h2 className="text-white">{t("word21")}</h2>
              </div>
              <a
                href={isAuthenticated ? "/create-campaign" : "/login"}
                className="btn btn-light text-dark ms-md-auto mt-3 mt-md-0"
                style={{
                  marginTop: "10px",
                }}
              >
                {t("word22")}
              </a>
            </div>
          </div>
        </div>

        {/* Visible only on medium screens and larger (desktop) */}
        <div
          className="d-none d-md-block"
          style={{ paddingTop: "40px", paddingBottom: "40px" }}
        ></div>

        {/* Visible only on small screens and smaller (mobile) */}
        <div
          className="d-md-none"
          style={{ paddingTop: "0px", paddingBottom: "0px" }}
        ></div>

        {/* Third Row: Set Your Goal and Earn More */}
        <div className="row align-items-center mt-5 mb-5">
          <div
            className="col-lg-5 text-start custom-element-2"
            style={{
              marginRight: "20px",
            }}
          >
            <div className="d-inline-block">
              <div className="oval-holder">
                <img
                  src="profit_fee.png"
                  alt="Profit Fee"
                  className="img-fluid oval"
                  style={{ maxWidth: "100%" }}
                />
              </div>
            </div>
          </div>
          <div className="col-lg-6 mt-5 ms-lg-5">
            <h2 className="text-success" style={{ fontSize: "18px" }}>
              {t("word23")}
            </h2>
            <h3 className="text-white text-lg">{t("word24")}</h3>
            <p className="text-white text-muted">{t("word25")}</p>
            <div className="mt-4">
              {/* Reach Your Goal, and Earn Extra */}
              <div className="mt-4 d-flex align-items-start">
                <div className="icon icon-lg">
                  <HiOutlinePresentationChartBar size={30} />
                </div>
                <div className="ms-3 ms-md-3">
                  <h4 className="text-light" style={{ fontSize: "18px" }}>
                    {t("word26")}
                  </h4>
                  <p className="text-muted">{t("word27")}</p>
                </div>
              </div>

              {/* Earn While Making a Difference */}
              <div className="mt-4 d-flex align-items-start">
                <div className="icon icon-lg">
                  <RiMoneyDollarCircleLine size={30} />
                </div>
                <div className="ms-3 ms-md-3">
                  <h4 className="text-light" style={{ fontSize: "18px" }}>
                    {t("word28")}
                  </h4>
                  <p className="text-muted">{t("word29")}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default HomePage;
