import React, { useContext } from "react";
import { Link } from "react-router-dom";

// CONTEXT
import { AuthContext } from "../../context/authContext";

function IntroBanner() {
  const { isAuthenticated } = useContext(AuthContext);

  return (
    <>
      <div className="intro-banner bg-dark py-5">
        <div className="container py-5">
          <div className="row g-4 align-items-center">
            <div className="col-lg-7">
              <p className="lead mb-0">Your story starts from here</p>
              <h2 className="h1 text-white mb-0">
                Ready to raise funds for idea?
              </h2>
            </div>
            <div className="col-lg-5 text-lg-end">
              <Link
                className="btn btn-light bg-white text-dark"
                to={isAuthenticated ? "/create-campaign" : "/signup"}
              >
                Make it happen
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default IntroBanner;
