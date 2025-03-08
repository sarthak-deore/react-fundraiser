import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { register } from "../../api";
import ReCAPTCHA from "react-google-recaptcha"; // Import reCAPTCHA
import { useTranslation } from "react-i18next";

const REACT_APP_RECAPTCHA_SITE_KEY = process.env.REACT_APP_RECAPTCHA_SITE_KEY;

function SignUpForm() {
  const { t } = useTranslation(); // Translation function
  const [submit, setSubmit] = useState(false);
  const [captchaValue, setCaptchaValue] = useState(null); // State for captcha value
  const navigate = useNavigate();
  const {
    formState: { errors },
  } = useForm();

  const handleLoginRedirect = () => {
    navigate("/login"); // Redirect to the registration page
  };

  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const validator = () => {
    const { username, password } = formData;
    if (password.length < 7) {
      toast.error(t("word120"), {
        position: "bottom-right",
        autoClose: 3000,
      });
      return false;
    }
    if (username.length < 5) {
      toast.error("Username must be at least 5 characters long", {
        position: "bottom-right",
        autoClose: 3000,
      });
      return false;
    }
    if (!captchaValue) {
      toast.error("Please complete the CAPTCHA", {
        position: "bottom-right",
        autoClose: 3000,
      });
      return false;
    }
    return true;
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCaptchaChange = (value) => {
    setCaptchaValue(value); // Set captcha value when completed
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!validator()) {
      // Clear password fields if there is a validation error
      setFormData({ ...formData, username: "", password: "" });
      return;
    }
    setSubmit(true);

    try {
      await register({ ...formData, captchaToken: captchaValue }); // Include captcha token in request

      toast.success("Registered successfully!", {
        position: "bottom-right",
        autoClose: 3000,
      });
      navigate("/login"); // Redirect to login page
    } catch (error) {
      toast.error("Username already in use or registration failed!", {
        position: "bottom-right",
        autoClose: 3000,
      });
      setSubmit(false);
    }
  };

  return (
    <>
      {!submit && (
        <form onSubmit={handleFormSubmit}>
          <div className="row g-4">
            {/* Username */}
            <div className="col-lg-6">
              <label className="form-label" htmlFor="fullName">
                {t("word32")}
              </label>
              <input
                type="text"
                className={`form-control ${
                  errors.full_name ? "is-invalid" : ""
                }`}
                onChange={handleChange}
                id="fullName"
                placeholder={t("word37")}
                name="username"
                value={formData.username}
              />
            </div>

            {/* Password */}
            <div className="col-lg-6">
              <label className="form-label" htmlFor="email">
                {t("word33")}
              </label>
              <input
                onChange={handleChange}
                type="password"
                className={`form-control ${errors.email ? "is-invalid" : ""}`}
                id="email"
                placeholder={t("word38")}
                name="password"
                value={formData.password}
              />
            </div>

            {/* CAPTCHA */}
            <div className="col-12">
              <ReCAPTCHA
                sitekey={REACT_APP_RECAPTCHA_SITE_KEY} // Replace with your actual Site Key
                onChange={handleCaptchaChange}
              />
            </div>

            {/* Submit Button */}
            <div className="col-12">
              <button className="btn btn-primary" type="submit">
                {t("word42")}
              </button>
            </div>
          </div>
        </form>
      )}
      <div className="glass-bg mt-5 p-4">
        {" "}
        {/* Added glass-bg and some padding */}
        <div className="text-left">
          <p>{t("word43")}</p>
          <button className="btn btn-primary" onClick={handleLoginRedirect}>
            {t("word44")}
          </button>
        </div>
      </div>
    </>
  );
}

export default SignUpForm;
