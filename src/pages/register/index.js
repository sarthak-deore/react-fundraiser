import React from "react";
import { useTranslation } from "react-i18next";

// COMPONENTS

import SignUpForm from "./SignupForm";

function RegisterPage() {
  const { t } = useTranslation();
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
                      <h1 className="mb-0">{t("word41")}</h1>
                    </header>

                    <SignUpForm />
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

export default RegisterPage;
