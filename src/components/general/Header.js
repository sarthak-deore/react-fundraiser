import React, { useEffect, useContext, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { fixNavbarToTop } from "../../helpers/utils";
import { appSettings } from "../../helpers/settings";
import { AuthContext } from "../../context/authContext"; // Import the AuthContext
import { getProfile, getNotifications, markAllAsRead } from "../../api";
import { BiBell } from "react-icons/bi";
import "./navbarStyles.css";

import { useTranslation } from "react-i18next";

function Navbar() {
  const { isAuthenticated, logout } = useContext(AuthContext); // Use the context to check authentication status and logout method
  const [user, setUser] = useState(null); // Store user profile
  const navigate = useNavigate(); // Hook for navigation

  const [showDot, setShowDot] = useState(false);

  const { t } = useTranslation(); // i18n translation

  // Fetch user profile on component mount
  useEffect(() => {
    fixNavbarToTop();

    async function fetchProfile() {
      try {
        const profile = await getProfile(); // Call getProfile
        setUser(profile.data); // Set the fetched profile
      } catch (error) {
        if (error.response && error.response.status === 401) {
          logout(); // Call logout method
          navigate("/login"); // Redirect to login page after logout
        } else {
          console.error("Failed to fetch user profile:", error);
        }
      }
    }

    if (isAuthenticated) {
      fetchProfile(); // Fetch profile only if user is authenticated
    }
  }, [isAuthenticated, logout, navigate]);

  // Handle logout
  const handleLogout = () => {
    logout(); // Call logout method
    navigate("/login"); // Redirect to login page after logout
  };

  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    // Fetch notifications for the current user when the component mounts
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const response = await getNotifications();
      setNotifications(response.data);
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  };

  useEffect(() => {
    // Check if any notification has read=false
    const hasUnreadNotifications = notifications.some(
      (notification) => !notification.read
    );
    setShowDot(hasUnreadNotifications);
  }, [notifications]);

  const handleMarkAllAsRead = async () => {
    try {
      await markAllAsRead();
      fetchNotifications();
    } catch (error) {
      console.error("Error marking notifications as read:", error);
    }
  };

  const handleBalanceClick = () => {
    // Redirect to the user's profile page
    navigate("/profile");
  };

  return (
    <header className="main-header fixed-top">
      <div className="container">
        <nav className="navbar w-100 navbar-expand-lg px-0 justify-content-between rounded-0 shadow-0">
          <Link className="navbar-brand" to="/">
            <img
              src={`${appSettings?.logo}`}
              alt={`${appSettings?.brandName}`}
              width={appSettings.logoWidth}
              className="img-fluid"
            />
          </Link>

          {isAuthenticated && (
            <div
              className="d-lg-none"
              style={{ position: "relative", zIndex: 1050 }}
            >
              {/* Notifications dropdown */}
              <div className="dropdown">
                <button
                  className="btn btn-secondary "
                  type="button"
                  id="notificationDropdown"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                  style={{
                    height: "40px",
                    width: "60px",
                    marginLeft: "-25px",
                    background: "transparent",
                    border: "none",
                  }}
                  onClick={handleMarkAllAsRead}
                >
                  <BiBell size={20} /> {/* Bell icon */}
                  {showDot && (
                    <span
                      style={{
                        position: "absolute",
                        top: "8px",
                        right: "15px",
                        height: "8px",
                        width: "8px",
                        backgroundColor: "red",
                        borderRadius: "50%",
                      }}
                    ></span>
                  )}
                </button>

                <ul
                  className="dropdown-menu"
                  aria-labelledby="notificationDropdown"
                  style={{
                    background: "#1a212d",
                    maxHeight: "400px",
                    width: "300px",
                    overflowY: "auto",
                    marginTop: "10px",
                    marginLeft: "-100px",
                  }} // Scrollable styles applied here
                >
                  {notifications.length === 0 ? (
                    <li className="dropdown-item">No notifications</li>
                  ) : (
                    notifications.map((notification) => (
                      <li
                        key={notification._id}
                        className="dropdown-item"
                        style={{
                          backgroundColor: "#1a212d",
                          padding: "5px",
                          marginTop: "10px",
                          marginBottom: "10px",
                          borderRadius: "5px",
                          color: "#fff",
                        }}
                      >
                        <p
                          style={{
                            wordWrap: "break-word",
                            whiteSpace: "normal",
                          }}
                        >
                          <small>
                            <span className="text-muted">
                              (
                              {new Date(notification.time).toLocaleDateString()}
                              ) &nbsp;
                            </span>

                            {notification.message}
                          </small>
                        </p>
                      </li>
                    ))
                  )}
                </ul>
              </div>
            </div>
          )}

          {/* Display user balance if authenticated */}
          <div style={{ position: "relative", zIndex: 1050 }}>
            {isAuthenticated && user && (
              <span
                className="d-lg-none me-2 text-xs"
                onClick={handleBalanceClick}
              >
                {/* Hidden on medium (md) and larger screens */}
                {user.balance.toFixed(2)} USD
              </span>
            )}
          </div>

          <button
            className="navbar-toggler shadow-0 p-0 border-0"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarSupportedContent"
            aria-controls="navbarSupportedContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon-el">
              <span className="btn-mobile--menu-icon"></span>
            </span>
          </button>

          <div
            className="collapse navbar-collapse justify-content-lg-between"
            id="navbarSupportedContent"
          >
            <ul
              className={`navbar-nav mx-auto navbar-nav-custom navbar-nav-custom-1 ${
                !isAuthenticated ? "navbar-nav-custom-2" : ""
              }`}
            >
              <li className="nav-item">
                <NavLink
                  className={({ isActive }) =>
                    isActive ? "nav-link active" : "nav-link"
                  }
                  to="/campaigns"
                >
                  {t("word1")}
                </NavLink>
              </li>

              <li className="nav-item">
                <NavLink
                  className={({ isActive }) =>
                    isActive ? "nav-link active" : "nav-link"
                  }
                  to="/make-money"
                >
                  {t("word2")}
                </NavLink>
              </li>

              <li className="nav-item">
                <NavLink
                  className={({ isActive }) =>
                    isActive ? "nav-link active" : "nav-link"
                  }
                  to="/faqs"
                >
                  {t("word3")}
                </NavLink>
              </li>
              {/*Community Chat*/}
              <li className="nav-item">
                <NavLink
                  className={({ isActive }) =>
                    isActive ? "nav-link active" : "nav-link"
                  }
                  to="/community-chat"
                >
                  Community Chat
                </NavLink>
              </li>
              <li className="nav-item">
                {isAuthenticated ? (
                  <NavLink
                    className={({ isActive }) =>
                      isActive ? "nav-link active" : "nav-link"
                    }
                    to="/profile"
                  >
                    {t("word4")}
                  </NavLink>
                ) : (
                  <Link className="nav-link" to="/login">
                    {t("word4")}
                  </Link>
                )}
              </li>
            </ul>

            <div className="d-flex align-items-lg-center flex-column flex-lg-row">
              {/* Notifications dropdown */}

              {isAuthenticated && (
                <div className="dropdown d-none d-lg-inline">
                  <button
                    className="btn btn-secondary "
                    type="button"
                    id="notificationDropdown"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                    style={{
                      height: "40px",
                      width: "60px",
                      background: "transparent",
                      border: "none",
                    }}
                    onClick={handleMarkAllAsRead}
                  >
                    <BiBell size={20} /> {/* Bell icon */}
                    {showDot && (
                      <span
                        style={{
                          position: "absolute",
                          top: "8px",
                          right: "15px",
                          height: "8px",
                          width: "8px",
                          backgroundColor: "red",
                          borderRadius: "50%",
                        }}
                      ></span>
                    )}
                  </button>

                  <ul
                    className="dropdown-menu"
                    aria-labelledby="notificationDropdown"
                    style={{
                      background: "#1a212d",
                      maxHeight: "400px",
                      width: "300px",
                      overflowY: "auto",
                      marginTop: "10px",
                      marginLeft: "-100px",
                    }}
                  >
                    {notifications.length === 0 ? (
                      <li className="dropdown-item">No notifications</li>
                    ) : (
                      notifications.map((notification) => (
                        <li
                          key={notification._id}
                          className="dropdown-item"
                          style={{
                            backgroundColor: "#1a212d",
                            padding: "5px",
                            marginTop: "10px",
                            marginBottom: "10px",
                            borderRadius: "5px",
                            color: "#fff",
                          }}
                        >
                          <p
                            style={{
                              wordWrap: "break-word",
                              whiteSpace: "normal",
                            }}
                          >
                            <small>
                              <span className="text-muted">
                                (
                                {new Date(
                                  notification.time
                                ).toLocaleDateString()}
                                ) &nbsp;
                              </span>

                              {notification.message}
                            </small>
                          </p>
                        </li>
                      ))
                    )}
                  </ul>
                </div>
              )}

              {/* Display user balance if authenticated */}
              {isAuthenticated && user && (
                <span
                  className="d-none d-lg-inline me-2 text-sm"
                  onClick={handleBalanceClick}
                  style={{ cursor: "pointer" }}
                >
                  {t("word5")}: {user.balance.toFixed(2)} USD
                </span>
              )}

              {isAuthenticated && user ? (
                <Link
                  className="btn btn-danger py-2 mx-2"
                  onClick={handleLogout}
                  to="/login"
                >
                  <span className="text-sm">{t("logout")}</span>
                </Link>
              ) : (
                <Link to="/login" className="btn btn-primary py-2">
                  <span className="text-sm">{t("word44")}</span>
                </Link>
              )}
            </div>
          </div>
        </nav>
      </div>
    </header>
  );
}

export default Navbar;
