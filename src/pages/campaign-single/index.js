import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom"; // Import useNavigate

import {
  getCampaign,
  getProfile,
  contribute,
  receivedRatings,
} from "../../api";
import { toast } from "react-toastify";
import NotFound from "../../components/NotFound";
import { AuthContext } from "../../context/authContext";
import Chat from "../../components/Chat"; // Import the Chat component
import { useTranslation } from "react-i18next";

const API_URL = process.env.REACT_APP_BACKEND_URL;
const imgAPI = `${API_URL}/api/image`;

function CampaignSinglePage() {
  const { t } = useTranslation(); // Initialize the useTranslation hook
  const { id } = useParams();
  const navigate = useNavigate(); // Initialize the navigate hook
  const { isAuthenticated } = useContext(AuthContext);
  const [campaign, setCampaign] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [contributed, setContributed] = useState(false);
  const [user, setUser] = useState(null);
  const [isContributing, setIsContributing] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [trustScore, setTrustScore] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const campaignResponse = await getCampaign(id);
        setCampaign(campaignResponse.data);

        // Fetch trust score for the campaign creator
        const score = await receivedRatings(
          campaignResponse.data.creator.username
        );

        if (score.data.number === 0) {
          setTrustScore(t("word51"));
        } else {
          setTrustScore(score.data.score);
        }

        if (isAuthenticated) {
          const profileResponse = await getProfile();
          setUser(profileResponse.data);

          const hasContributed = campaignResponse.data.participants.some(
            (participant) =>
              participant.username === profileResponse.data.username
          );
          setContributed(hasContributed);
        }
      } catch (err) {
        setError("Failed to load campaign details or user profile");
        toast.error("Failed to load campaign details or user profile");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, isAuthenticated, t]);

  const handleContribute = async () => {
    if (!isAuthenticated) {
      toast.error(t("word54"));
      return;
    }

    // Check if the user's status is active
    if (user && user.status !== "active") {
      toast.error("Please complete pending actions in your profile first.");
      return;
    }

    setShowConfirm(true);
  };

  const handleConfirmContribution = async () => {
    if (!isAuthenticated) {
      toast.error("Please log in to contribute.");
      return;
    }

    // Method to get the balance multiplier based on campaign profit

    const totalAmount =
      campaign.contributionPerParticipant * 1.1 + campaign.profitFee;

    if (user.balance < totalAmount) {
      toast.error("You don't have sufficient balance to contribute.");
      setShowConfirm(false);
      return;
    }

    try {
      setIsContributing(true);
      await contribute(id);
      toast.success("Successfully contributed to the campaign!");
      setContributed(true);
      setShowConfirm(false);
      const updatedCampaign = await getCampaign(id);
      setCampaign(updatedCampaign.data);

      // wait 2 seconds and reload
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    } catch (err) {
      console.error(err);
      toast.error("Failed to contribute to the campaign.");
    } finally {
      setIsContributing(false);
    }
  };

  const handleCancelConfirmation = () => {
    setShowConfirm(false);
  };

  const handleUserClick = () => {
    navigate(`/user/${creator.username}`); // Redirect to /user/username
  };

  if (loading) return <p>Loading...</p>;
  if (error || !campaign) return <NotFound />;

  const {
    title,
    creator,
    description,
    image,
    goalAmount,
    currentStatus,
    tags,
    totalFundsRaised,
    remainingSlots,
    contributionPerParticipant,
    profit,
    profitFee,
    createdAt,
  } = campaign;

  const totalContribution = (
    contributionPerParticipant * 1.1 +
    profitFee
  ).toFixed(2);

  const createdAtDate = new Date(createdAt);

  // Add 90 days in milliseconds
  const expiryDate = new Date(
    createdAtDate.getTime() + 90 * 24 * 60 * 60 * 1000
  );

  // Format the dates manually
  const formatDate = (date) => {
    const day = date.getDate();
    const month = date.toLocaleString("default", { month: "short" });
    const year = date.getFullYear();
    return `${day} ${month} ${year}`;
  };

  return (
    <>
      <section className="hero-banner-bg">
        <div className="container" style={{ paddingTop: "8rem" }}>
          <div className="row">
            <div className="col-lg-6">
              {/* Chat component placed here */}
              <Chat
                owner={creator.username}
                contributed={contributed}
                campaignId={id}
                user={user}
                isAuthenticated={isAuthenticated}
              />
            </div>
            <div className="col-lg-6">
              <div className="campaign-details">
                <div>
                  <p>
                    <span className="badge bg-primary fw-normal lead mt-4">
                      {tags}
                    </span>{" "}
                  </p>
                  <h1
                    className="text-xl mb-3"
                    style={{
                      wordWrap: "break-word",
                      overflowWrap: "break-word",
                      whiteSpace: "normal",
                    }}
                  >
                    {title}
                  </h1>
                  <p className="h6 mb-3">
                    {t("word49")}:{" "}
                    <span className="text-primary">
                      {goalAmount.toFixed(2)}
                    </span>{" "}
                    <span className="text-xs">USD</span>
                  </p>

                  {creator && (
                    <div className="glass-bg p-3 mb-3 d-inline-block">
                      <p className="text-xs">{t("word50")}</p>
                      <div
                        className="d-flex align-items-center"
                        onClick={handleUserClick} // Handle click event
                        style={{ cursor: "pointer" }} // Make it look clickable
                      >
                        {/* Image Avatar */}
                        <div
                          className="flex-shrink-0 bg-cover bg-center"
                          style={{ height: "2.3rem", marginTop: "0.1rem" }}
                        >
                          <img
                            src="/Profile_avatar_placeholder.png"
                            alt="Creator Avatar"
                            style={{
                              height: "100%", // Match the combined height
                              width: "auto", // Maintain aspect ratio
                              objectFit: "cover",
                              borderRadius: "0.5rem",
                            }}
                          />
                        </div>
                        <div className="ms-3">
                          <h6
                            className="mb-0"
                            style={{
                              fontSize: "0.9rem",
                            }}
                          >
                            {creator.username}
                          </h6>
                          {trustScore !== null && (
                            <h6 className="mb-0" style={{ fontSize: "0.9rem" }}>
                              <span
                                className="badge"
                                style={{
                                  backgroundColor: "#28a745", // Green background color
                                  color: "#fff", // White text color
                                  fontSize: "0.75rem",
                                  fontWeight: "normal",
                                  marginTop: "0.1rem",
                                }}
                              >
                                Trust Score |{" "}
                                {typeof trustScore === "number"
                                  ? `${trustScore}%`
                                  : trustScore}
                              </span>
                            </h6>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                  <p
                    className="text-muted"
                    style={{
                      wordWrap: "break-word",
                      overflowWrap: "break-word",
                      whiteSpace: "normal",
                    }}
                  >
                    {description}
                  </p>

                  <p className="small">
                    {t("word52")}: {remainingSlots}
                  </p>

                  <p className="small">
                    {t("word53")}: {formatDate(expiryDate)}
                  </p>

                  <p className="small">
                    Status:{" "}
                    <span
                      className={`badge ${
                        currentStatus === "active"
                          ? "bg-primary text-reset"
                          : "bg-secondary text-reset"
                      }`}
                    >
                      {currentStatus.charAt(0).toUpperCase() +
                        currentStatus.slice(1)}
                    </span>
                  </p>

                  <div className="goal mt-2 mb-2">
                    <div className="d-flex align-items-center justify-content-between text-sm">
                      <span className="text-muted">
                        {t("word48")}: {totalFundsRaised.toFixed(2)} USD
                      </span>
                      <br />
                      <span className="text-muted">
                        {((totalFundsRaised / goalAmount) * 100).toFixed(2)}%
                      </span>
                    </div>

                    <div className="progress my-2" style={{ height: "4px" }}>
                      <div
                        className="progress-bar"
                        role="progressbar"
                        style={{
                          width: `${(totalFundsRaised / goalAmount) * 100}%`,
                        }}
                        aria-valuenow={(totalFundsRaised / goalAmount) * 100}
                        aria-valuemin="0"
                        aria-valuemax="100"
                      ></div>
                    </div>

                    <p className="h6 mb-3 mt-2">
                      {t("word47")}
                      <span className="text-primary">
                        {" "}
                        {contributionPerParticipant.toFixed(2)}
                      </span>{" "}
                      <span className="text-sm">USD</span>{" "}
                    </p>
                  </div>

                  <div className="contribute-section mt-4">
                    {currentStatus === "completed" ? (
                      <button
                        className="btn w-100"
                        style={{
                          color: "#dcdcdc",
                          backgroundColor: "rgba(100, 100, 100, 0.1)",
                        }}
                        disabled
                      >
                        Closed
                      </button>
                    ) : currentStatus === "failed" ? (
                      <button
                        className="btn w-100"
                        style={{
                          color: "#dcdcdc",
                          backgroundColor: "rgba(100, 100, 100, 0.1)",
                        }}
                        disabled
                      >
                        Campaign Failed
                      </button>
                    ) : contributed ? (
                      <button className="btn btn-secondary w-100" disabled>
                        You've already contributed
                      </button>
                    ) : showConfirm ? (
                      <div>
                        <p>
                          {t("word114")}{totalContribution} USD?
                        </p>
                        <p className="text-muted text-sm">
                          {contributionPerParticipant.toFixed(2)} USD
                          {t("word115")}
                          <br />+{(contributionPerParticipant * 0.1).toFixed(
                            2
                          )}{" "}
                          USD {t("word116")}
                          <br />
                          {profit > 0 && (
                            <>
                              +{profitFee.toFixed(2)} USD {t("word117")}
                            </>
                          )}
                        </p>
                        <button
                          className="btn btn-opac-primary w-100"
                          onClick={handleConfirmContribution}
                          disabled={isContributing}
                        >
                          {isContributing ? "Processing..." : t("word118")}
                        </button>
                        &nbsp; &nbsp; &nbsp;
                        <button
                          className="btn btn-opac-primary w-100"
                          onClick={handleCancelConfirmation}
                        >
                          {t("word119")}
                        </button>
                      </div>
                    ) : (
                      <button
                        className="btn btn-opac-primary w-100"
                        onClick={handleContribute}
                        disabled={isContributing}
                      >
                        {isContributing ? "Processing..." : t("word45")}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <img
            style={{
              marginTop: "80px",
              width: "100%",
              height: "auto",
              borderRadius: "20px",
              marginBottom: "80px",
            }}
            src={`${imgAPI}/${image}`}
            alt="campaign"
          />
        </div>
      </section>
    </>
  );
}

export default CampaignSinglePage;
