import React from "react";
import { useTranslation } from "react-i18next";

// COMPONENTS

import CampaignForm from "./CampaignForm";

function CreateCampaignPage() {
  const { t } = useTranslation();
  return (
    <>
      <section className="hero-banner-bg" style={{ paddingTop: "8rem" }}>
        <section className="pb-5 page-first-section">
          <div className="container pb-5">
            <div className="row">
              <div className="col-lg-8 mx-auto">
                <div className="card p-md-4">
                  <div className="card-body">
                    <header className="text-center mb-5">
                      <h4 className="mb-0">{t("word87")}</h4>
                      <p className="text-muted">{t("word88")}</p>
                    </header>

                    <CampaignForm />
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

export default CreateCampaignPage;
