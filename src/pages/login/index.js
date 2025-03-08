import React from "react";
import { useTranslation } from "react-i18next"; // Import useTranslation

// COMPONENTS

import LoginForm from "./LoginForm";

function LoginPage() {
  const { t } = useTranslation(); // Initialize the hook
  return (
    <>
      <section className="hero-banner-bg" style={{ paddingTop: "8rem" }}>
        <section className="pb-5 page-first-section">
          <div className="container pb-5">
            <div className="row">
              <div className="col-lg-7 mx-auto">
                <div className="card p-md-4">
                  <div className="card-body">
                    <header className="text-center mb-5">
                      <h1 className="mb-0">{t("word40")}</h1>
                    </header>

                    <LoginForm />
                    {/* Sign Up Section */}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </section>
    </>
  );
}

export default LoginPage;
