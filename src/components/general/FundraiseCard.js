import React, { useMemo } from "react";
import { RiTimerFlashLine } from "react-icons/ri";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

const API_URL = process.env.REACT_APP_BACKEND_URL;
const imgAPI = `${API_URL}/api/image`;

// COMPONENTS
function FundraiseCard({
  id, // Add id prop for the campaign ID
  title,
  image,
  description,
  goalAmount,
  remainingSlots,
  creator,
  totalFundsRaised,
  endAt,
  category,
  contributionPerSlot,
  currentStatus,
}) {
  const navigate = useNavigate(); // Initialize navigate function

  const { t } = useTranslation(); // Initialize t function

  const raisePercentage = useMemo(() => {
    if (!goalAmount || goalAmount === 0) return 0; // Handle division by zero
    return (totalFundsRaised / goalAmount) * 100;
  }, [goalAmount, totalFundsRaised]);

  // Determine the button label based on the currentStatus
  const getButtonLabel = () => {
    switch (currentStatus) {
      case "active":
        return t("word45");
      case "completed":
        return t("word46");
      case "failed":
        return t("word46");
      case "claimed":
        return t("word46");
      default:
        return t("word45");
    }
  };

  // Handle redirection
  const handleRedirection = () => {
    navigate(`/campaigns/${id}`);
  };

  return (
    <>
      <div
        className="card fund-card overflow-hidden mb-4 mt-2"
        style={{
          minHeight: "508px",
          maxHeight: "508px",
        }}
      >
        <Link to={`/campaigns/${id}`}>
          <div className="card-body p-0">
            {/* IMAGE */}
            <div className="fund-card-img">
              <img
                src={`${imgAPI}/${image}`}
                alt={title}
                style={{
                  width: "100%", // Full width of the parent element
                  height: "100%", // Full height of the parent element
                  objectFit: "cover", // Ensures the image covers the container without distortion
                  borderTopLeftRadius: "10px", // Apply border radius only to the top-left corner
                  borderTopRightRadius: "10px",
                  paddingBottom: "20px",
                }} // Replace with your desired dimensions
                className="mb-3"
              />
            </div>

            <div className="px-4 pt-1">
              {/* CATEGORY & TIMER */}
              <ul className="list-inline text-sm text-muted">
                <li className="list-inline-item">
                  <div>
                    <span className="badge bg-primary">{category}</span>
                  </div>
                </li>
                <li className="list-inline-item">
                  <RiTimerFlashLine className="text-primary" />{" "}
                  <span>
                    {t("word49")}:&nbsp;
                    <span className="text-primary">
                      {goalAmount.toFixed(2)}{" "}
                    </span>
                    USD
                  </span>
                </li>
              </ul>

              {/* TITLE */}
              <div style={{ minHeight: "50px" }}>
                <h2 className="h5 mb-0">
                  <Link to={`/campaigns/${id}`} className="text-reset">
                    {title}
                  </Link>
                </h2>
              </div>

              {/* PROGRESS */}
              <div className="goal my-4">
                <div className="d-flex align-items-center justify-content-between text-sm">
                  <span className="text-muted">
                    {t("word48")}: {totalFundsRaised.toFixed(2)} USD
                  </span>
                  <span className="text-muted">
                    {raisePercentage.toFixed(2)}%
                  </span>
                </div>

                <div className="progress my-2" style={{ height: "4px" }}>
                  <div
                    className="progress-bar"
                    role="progressbar"
                    style={{ width: `${raisePercentage}%` }}
                    aria-valuenow={raisePercentage}
                    aria-valuemin="0"
                    aria-valuemax="100"
                  ></div>
                </div>
                <p className="h6 mb-3">
                  {t("word47")}
                  <span className="text-primary">
                    {" "}
                    {contributionPerSlot.toFixed(2)}
                  </span>{" "}
                  <span className="text-sm">USD</span>{" "}
                </p>
                {/* DYNAMIC BUTTON */}
                <button
                  type="button"
                  style={{
                    color: currentStatus !== "active" ? "#dcdcdc" : undefined,
                    backgroundColor:
                      currentStatus !== "active"
                        ? "rgba(100, 100, 100, 0.1)"
                        : undefined,
                    borderColor:
                      currentStatus !== "active" ? "transparent" : undefined,
                    cursor:
                      currentStatus !== "active" ? "not-allowed" : undefined,
                  }}
                  className={`btn ${
                    currentStatus === "active"
                      ? "btn btn-opac-primary"
                      : "btn-custom" // Additional styles if needed
                  } w-100 ${
                    currentStatus === "active"
                      ? currentStatus === "claimed"
                        ? "btn-success"
                        : currentStatus === "failed"
                        ? "btn-danger"
                        : ""
                      : ""
                  }`}
                  onClick={
                    currentStatus === "active" ? handleRedirection : undefined
                  } // Add onClick handler only if active
                  disabled={currentStatus !== "active"} // Disable the button if not active
                >
                  {currentStatus !== "active" ? t("word46") : getButtonLabel()}
                </button>
              </div>
            </div>
          </div>
        </Link>
      </div>
    </>
  );
}

export default FundraiseCard;
