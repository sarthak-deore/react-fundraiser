import React from "react";
import { useTranslation } from "react-i18next";

// COMPOENENTS

function FAQsPage() {
  const { t } = useTranslation();
  const FAQS = t("faqs", { returnObjects: true });
  return (
    <>
      <section className="hero-banner-bg">
        <section className="py-5">
          <div
            className="container col-10 col-md-12 mb-5"
            style={{ paddingTop: "8rem" }}
          >
            <div style={{ paddingBottom: "2rem" }}>
              <h1 className="text-center mb-5">{t("word30")}</h1>
            </div>
            <div className="row">
              <div className="col-lg-7 mx-auto">
                <div className="accordion accordio-minimal" id="faqs">
                  {FAQS.map((item, index) => {
                    return (
                      <div className="accordion-item" key={index}>
                        <h2 className="accordion-header" id={`heading${index}`}>
                          <button
                            className="accordion-button"
                            type="button"
                            data-bs-toggle="collapse"
                            data-bs-target={`#collapse${index}`}
                            aria-expanded={index === 0 ? "true" : "false"}
                            aria-controls={`collapse${index}`}
                          >
                            {item.question}
                          </button>
                        </h2>
                        <div
                          id={`collapse${index}`}
                          className={`accordion-collapse collapse ${
                            index === 0 ? "show" : ""
                          }`}
                          aria-labelledby={`heading${index}`}
                          data-bs-parent="#faqs"
                        >
                          <div className="accordion-body">{item.answer}</div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </section>
      </section>
    </>
  );
}

export default FAQsPage;
