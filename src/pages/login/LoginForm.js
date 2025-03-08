import React, { useState, useContext, useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { login, getProfile } from "../../api";
import { AuthContext } from "../../context/authContext";
import ReCAPTCHA from "react-google-recaptcha";
import { useTranslation } from "react-i18next";

function LoginForm() {
  const { t } = useTranslation();
  const [submit, setSubmit] = useState(false);
  const [captchaValue, setCaptchaValue] = useState(null);
  const [otpCaptchaValue, setOtpCaptchaValue] = useState(null); // New state for OTP reCAPTCHA
  const navigate = useNavigate();
  const { login: authenticate } = useContext(AuthContext);

  // Add new state for 2FA
  const [showTwoFactor, setShowTwoFactor] = useState(false);
  const [twoFactorCode, setTwoFactorCode] = useState("");
  const [tempCredentials, setTempCredentials] = useState(null);

  const {
    formState: { errors },
  } = useForm();

  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const handleSignUpRedirect = () => {
    navigate("/signup");
  };

  useEffect(() => {
    const checkLoggedIn = async () => {
      try {
        const response = await getProfile();
        if (response.data) {
          navigate("/profile");
          window.location.reload();
        }
      } catch (error) {
        console.error("Error checking logged in status:", error);
      }
    };

    checkLoggedIn();
  }, [navigate]);

  const validator = () => {
    if (showTwoFactor) {
      if (!twoFactorCode || twoFactorCode.length < 6) {
        toast.error("Please enter a valid authentication code", {
          position: "bottom-right",
          autoClose: 3000,
        });
        return false;
      }
      if (!otpCaptchaValue) {
        // Validate the OTP reCAPTCHA token
        toast.error("Please complete the OTP CAPTCHA", {
          position: "bottom-right",
          autoClose: 3000,
        });
        return false;
      }
      return true;
    }

    // Regular validation for initial login
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
    setCaptchaValue(value);
  };

  const handleOtpCaptchaChange = (value) => {
    setOtpCaptchaValue(value);
  };

  const handleTwoFactorChange = (e) => {
    setTwoFactorCode(e.target.value);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!validator()) {
      if (!showTwoFactor) {
        setFormData({ ...formData, password: "" });
      }
      return;
    }
    setSubmit(true);

    try {
      const loginData = showTwoFactor
        ? { ...tempCredentials, twoFactorCode, captchaToken: otpCaptchaValue } // Send OTP reCAPTCHA token
        : { ...formData, captchaToken: captchaValue };

      const response = await login(loginData);

      // Check if 2FA is required
      if (response.data.requiresTwoFactor) {
        setShowTwoFactor(true);
        setTempCredentials(loginData);
        setSubmit(false);
        return;
      }

      // Successful login
      authenticate(response.data.token);
      toast.success(t("word55"), {
        position: "bottom-right",
        autoClose: 3000,
      });
      navigate("/profile");
    } catch (error) {
      const errorMessage = showTwoFactor
        ? "Invalid authentication code"
        : "Incorrect username or password";

      toast.error(errorMessage, {
        position: "bottom-right",
        autoClose: 3000,
      });
      setSubmit(false);
      if (showTwoFactor) {
        setTwoFactorCode("");
      }
      if (showTwoFactor) setOtpCaptchaValue(null); // Reset OTP reCAPTCHA on error
    }
  };

  return (
    <>
      {!submit && (
        <form onSubmit={handleFormSubmit}>
          <div className="row g-4 mb-5">
            {!showTwoFactor ? (
              // Regular login form
              <>
                <div className="col-lg-6">
                  <label className="form-label" htmlFor="username">
                    {t("word32")}
                  </label>
                  <input
                    type="text"
                    className={`form-control ${
                      errors.username ? "is-invalid" : ""
                    }`}
                    onChange={handleChange}
                    id="username"
                    placeholder={t("word37")}
                    name="username"
                    value={formData.username}
                  />
                </div>

                <div className="col-lg-6">
                  <label className="form-label" htmlFor="password">
                    {t("word33")}
                  </label>
                  <input
                    onChange={handleChange}
                    type="password"
                    className={`form-control ${
                      errors.password ? "is-invalid" : ""
                    }`}
                    id="password"
                    placeholder={t("word38")}
                    name="password"
                    value={formData.password}
                  />
                </div>

                <div className="col-12">
                  <ReCAPTCHA
                    sitekey={process.env.REACT_APP_RECAPTCHA_SITE_KEY}
                    onChange={handleCaptchaChange}
                  />
                </div>
              </>
            ) : (
              // 2FA input form
              <>
                <div className="col-12">
                  <label className="form-label" htmlFor="twoFactorCode">
                    Authentication Code
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="twoFactorCode"
                    placeholder="Enter 6-digit code"
                    value={twoFactorCode}
                    onChange={handleTwoFactorChange}
                    maxLength="6"
                    autoFocus
                  />
                  <small className="text-muted">
                    Please enter the code from your authenticator app
                  </small>
                </div>
                <div className="col-12 mt-3">
                  <ReCAPTCHA
                    sitekey={process.env.REACT_APP_RECAPTCHA_SITE_KEY}
                    onChange={handleOtpCaptchaChange} // OTP-specific CAPTCHA handler
                  />
                </div>
              </>
            )}

            <div className="col-12">
              <button className="btn btn-primary" type="submit">
                {showTwoFactor ? "Verify Code" : t("word34")}
              </button>
            </div>
          </div>
        </form>
      )}

      {!showTwoFactor && (
        <div className="glass-bg mt-5 p-4">
          <div className="text-left">
            <p>{t("word39")}</p>
            <button className="btn btn-primary" onClick={handleSignUpRedirect}>
              {t("word36")}
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export default LoginForm;
