import React, { useContext } from "react";
import { Link } from "react-router-dom";

// CONTEXT
import { AuthContext } from "../../context/authContext";

function HeroBanner() {
  const { isAuthenticated } = useContext(AuthContext);

  return (
    <>
      <section className="hero-banner">
        <div className="hero-banner-bg"></div>
        <div className="container z-index-20 hero-banner-container">
          <div className="row align-items-center">
            <div className="col-lg-6">
              <p className="h5 text-primary">Ultimate Crowdfunding platform</p>
              <h1 className="text-xxl mb-3">
                The world trusted crowdfunding app
              </h1>
              <p className="text-muted mb-3">
                Send money internationally, check exchange rates, and use free
                currency tools.
              </p>
              <ul className="list-inline">
                <li className="list-inline-item me-3">
                  <Link
                    to={isAuthenticated ? "/create-campaign" : "/signup"}
                    className="btn btn-primary"
                  >
                    Start a Fundraiser
                  </Link>
                </li>
                <li className="list-inline-item">
                  <Link className="btn btn-link text-white" to="/about-us">
                    About Us
                  </Link>
                </li>
              </ul>
            </div>

            <div className="col-lg-5 ms-auto text-center">
              <div className="oval-holder d-inline-block">
                <img src="/about-1-1.jpg" alt="" className="oval img-fluid" />
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default HeroBanner;
