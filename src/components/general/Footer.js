import React, { useEffect, useState } from "react";
import { FaTelegram } from "react-icons/fa";

import { useLocation } from "react-router-dom";

const Footer = () => {
  const [isVisible, setIsVisible] = useState(false);
  const location = useLocation();

  const handleScroll = () => {
    const scrollHeight = Math.max(
      document.documentElement.scrollHeight,
      document.body.scrollHeight
    );

    const scrollPosition = window.innerHeight + window.pageYOffset;
    const isAtBottom = scrollHeight - scrollPosition < 50;

    setIsVisible(isAtBottom);
  };

  useEffect(() => {
    const handleRouteChange = () => {
      window.scrollTo(0, 0);
    };

    window.addEventListener("scroll", handleScroll);
    handleRouteChange(); // Call on mount

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [location]);

  return (
    <footer
      style={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        opacity: isVisible ? 1 : 0,
        visibility: isVisible ? "visible" : "hidden",
        pointerEvents: isVisible ? "auto" : "none",
        background: "transparent",
        display: "flex", // Use flexbox
        justifyContent: "center", // Center horizontally
        alignItems: "center", // Center vertically
      }}
    >
      <div
        className="container py-3 d-flex justify-content-center align-items-center"
        style={{ backgroundColor: "rgba(15,19,26,255)" }}
      >
        <a
          href="https://t.me/+fqlOGt0VzrthNmI0"
          target="_blank"
          rel="noopener noreferrer"
          className="d-flex align-items-center text-decoration-none text-muted"
        >
          <FaTelegram size={30} className="me-2" />
          Telegram
        </a>
      </div>
    </footer>
  );
};

export default Footer;
