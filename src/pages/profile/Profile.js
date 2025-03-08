import React, { useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom";
import DataTable from "react-data-table-component";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import {
  getProfile,
  getCampaigns,
  updatePassword,
  getRatings,
  rateUser,
  addTransaction,
  createPayout,
  getTransactions, // Import getTransactions function
  createRawTransaction,
} from "../../api";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/authContext";

function Profile() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { logout, userId } = useContext(AuthContext);

  const [user, setUser] = useState(null);
  const [contributionsWithCampaigns, setContributionsWithCampaigns] = useState(
    []
  );
  const [myCampaigns, setMyCampaigns] = useState([]);
  const [ratings, setRatings] = useState([]);
  const [submittingRating, setSubmittingRating] = useState(null);
  const [transactions, setTransactions] = useState([]); // State to hold transactions
  const [loadingTransactions, setLoadingTransactions] = useState(true); // Loading state for transactions

  const [cryptoName, setCryptoName] = useState("");
  const [address, setAddress] = useState("");
  const [amount, setAmount] = useState("");
  const [payoutError, setPayoutError] = useState(null);
  const [showPayoutForm, setShowPayoutForm] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await getProfile();
        const userData = response.data;

        const campaignResponse = await getCampaigns();
        const campaigns = campaignResponse.data;

        const updatedContributions = userData.contributions
          .map((contribution) => {
            const campaign = campaigns.find(
              (campaign) => campaign._id === contribution.campaign
            );
            if (campaign) {
              const formattedTime = new Date(contribution.time).toLocaleString(
                "en-US",
                {
                  year: "numeric",
                  month: "2-digit",
                  day: "2-digit",
                  hour: "2-digit",
                  minute: "2-digit",
                  second: "2-digit",
                  hour12: true,
                }
              );

              return {
                ...campaign, // Spread the campaign details
                contributionTime: formattedTime, // Add the formatted time
                contributionAmount: contribution.amount, // Optionally, add the amount too
              };
            }
            return null;
          })
          .filter((campaign) => campaign !== null);

        const userCreatedCampaigns = campaigns.filter(
          (campaign) => campaign.creator._id === userData._id
        );

        const ratingsResponse = await getRatings(userId);
        const userRatings = ratingsResponse.data;

        setUser(userData);
        setContributionsWithCampaigns(updatedContributions);
        setMyCampaigns(userCreatedCampaigns);
        setRatings(userRatings);
      } catch (error) {
        console.error("Error fetching profile:", error);
        toast.error("Failed to fetch profile data. Please try again.", {
          position: "bottom-right",
          autoClose: 3000,
        });
      }
    };

    const fetchTransactions = async () => {
      try {
        setLoadingTransactions(true); // Start loading
        const transactionResponse = await getTransactions(); // Fetch transactions
        setTransactions(transactionResponse.data); // Set transactions to state
      } catch (error) {
        console.error("Error fetching transactions:", error);
        toast.error("Failed to fetch transactions. Please try again.");
      } finally {
        setLoadingTransactions(false); // Stop loading
      }
    };

    fetchProfile();
    fetchTransactions(); // Fetch transactions when component mounts
  }, [userId]);

  const handleLogout = () => {
    logout();
    toast.success("Logged out successfully!", {
      position: "bottom-right",
      autoClose: 3000,
    });
    navigate("/login");
  };

  const handlePayout = async () => {
    if (!cryptoName || !address || !amount) {
      setPayoutError("All fields are required.");
      return;
    }

    try {
      setPayoutError(null);

      await createPayout({ cryptoName, address, amount });
      toast.success(
        "Payout Created Succeffully. It will processed within the next 24-48 hours manually",
        {
          position: "bottom-right",
          autoClose: 5000,
        }
      );
      setShowPayoutForm(false); // Optionally close the form after success
      setTimeout(() => {
        window.location.reload();
      }, 5000);
    } catch (error) {
      setPayoutError("Insufficient balance available");
    }
  };

  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const [showAddBalanceFormDetails, setShowAddBalanceFormDetails] =
    useState(false);
  const [showCardPaymentForm, setShowCardPaymentForm] = useState(false);

  const handlePasswordUpdate = async () => {
    if (newPassword.length < 7) {
      setPasswordError("Password must be at least 7 characters long.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError("Passwords do not match.");
      return;
    }

    try {
      await updatePassword({ password: newPassword });

      toast.success("Password updated successfully!");
      setNewPassword("");
      setConfirmPassword("");
      setShowPasswordForm(false);

      setTimeout(() => {
        handleLogout();
      }, 3000);
    } catch (error) {
      console.error("Error updating password:", error);
      toast.error("Failed to update password. Please try again.");
    }
  };

  const handleRatingSubmit = async (ratingId, answer) => {
    try {
      setSubmittingRating(ratingId);
      await rateUser({ campaignId: ratingId, answer });

      toast.success("Rating submitted successfully!");
      setTimeout(() => {
        window.location.reload();
      }, 2000);

      setRatings((prevRatings) =>
        prevRatings.filter((rating) => rating._id !== ratingId)
      );
      setSubmittingRating(null);
    } catch (error) {
      console.error("Error submitting rating:", error);
      toast.error("Failed to submit rating. Please try again.");
      setSubmittingRating(null);
    }
  };

  const [showAddBalanceForm, setShowAddBalanceForm] = useState(false);
  const [balanceAmount, setBalanceAmount] = useState("");
  const [balanceError, setBalanceError] = useState("");

  const handleAddBalance = async () => {
    if (!balanceAmount || isNaN(balanceAmount) || Number(balanceAmount) <= 0) {
      setBalanceError(t("word86"));
      return;
    }

    const amount = parseFloat(balanceAmount).toFixed(2);
    if (!amount || isNaN(amount) || Number(amount) <= 0) {
      toast.error("Invalid amount. Please enter a valid number.");
      return;
    }

    try {
      const response = await addTransaction({ oldAmount: Number(amount) });

      const { amount: transactionAmount, address } = response.data;

      const paymentUrl = `https://trocador.app/en/anonpay?ticker_to=xmr&network_to=Mainnet&address=${address}&amount=${transactionAmount}`;
      window.open(paymentUrl, "_blank");
    } catch (error) {
      console.error("Error adding balance:", error);
      toast.error("Failed to add balance. Please try again.");
      setBalanceError("An error occurred while adding balance.");
    }
  };

  const submitCardPayment = async () => {
    if (!balanceAmount || isNaN(balanceAmount) || Number(balanceAmount) <= 0) {
      setBalanceError(t("word86"));
      return;
    }
    try {
      // Assuming createRawTransaction is an API call or async function
      const rawTransaction = await createRawTransaction({
        amount: Number(balanceAmount),
      });

      if (rawTransaction.data.address) {
        // Redirect to the new page with the address field
        window.open(rawTransaction.data.address, "_blank");
      } else {
        // Handle error if address is not present
        setBalanceError("Unable to proceed with the transaction.");
      }
    } catch (error) {
      setBalanceError("An error occurred during the transaction.");
    }
  };

  // Contribution pagination
  const contributionsPerPage = 10;
  const reversedContributions = [...contributionsWithCampaigns].reverse();
  const columns = [
    {
      name: t("word62"),
      selector: (row) => <Link to={`/campaigns/${row._id}`}>{row._id}</Link>,
    },
    {
      name: t("word63"),
      selector: (row) => <Link to={`/campaigns/${row._id}`}>{row.title}</Link>,
    },
    {
      name: t("word64"),
      selector: (row) => (row.contributionTime ? row.contributionTime : "N/A"),
      sortable: true,
    },
    {
      name: t("word65"),
      selector: (row) => row.contributionPerParticipant.toFixed(2) + " USD",
      sortable: true,
    },
    {
      name: "Status",
      selector: (row) => row.currentStatus,
      sortable: true,
    },
    {
      name: t("word66"),
      selector: (row) => {
        // If user is the campaign creator, show N/A
        if (row.creator._id === user._id) {
          return "N/A";
        }

        // Check if the campaign is completed
        if (row.currentStatus === "completed") {
          const hasRating = ratings.some(
            (rating) => String(rating.campaign) === String(row._id)
          );

          return hasRating ? "No" : "Yes";
        }

        // For other cases, return N/A
        return "N/A";
      },
      sortable: true,
    },
  ];

  // My Campaigns pagination
  const reversedCampaigns = [...myCampaigns].reverse();
  const columns1 = [
    {
      name: t("word62"),
      selector: (row) => <Link to={`/campaigns/${row._id}`}>{row._id}</Link>,
    },
    {
      name: t("word63"),
      selector: (row) => <Link to={`/campaigns/${row._id}`}>{row.title}</Link>,
    },
    {
      name: t("word64"),
      selector: (row) => new Date(row.createdAt).toLocaleString(), // Format as needed
      sortable: true,
    },
    {
      name: t("word49"),
      selector: (row) => row.goalAmount.toFixed(2) + " USD", // Format as currency
      sortable: true,
    },
    {
      name: "Status",
      selector: (row) => row.currentStatus,
      sortable: true,
    },
  ];

  // Alternative values for CC fiat
  const alternativeValues = [
    { original: 25, formatted: 24.2 },
    { original: 50, formatted: 48.5 },
    { original: 75, formatted: 72.8 },
    { original: 100, formatted: 97.1 },
    { original: 200, formatted: 194.2 },
    { original: 500, formatted: 485.6 },
  ];

  // Transactions pagination
  const columns2 = [
    {
      name: "External Invoice ID",
      selector: (row) => row.externalId,
      width: "400px",
    },
    {
      name: "Type", // New column for Type
      selector: (row) => (row.fiat === "PAYOUT" ? "Payout" : "Add-Balance"), // Logic for determining IN/OUT
      sortable: true, // Optional, make the column sortable if necessary
    },
    {
      name: "Date",
      selector: (row) => new Date(row.createdAt).toLocaleString(),
      sortable: true,
    },
    {
      name: "Amount",
      selector: (row) => {
        const amount = parseFloat(row.amount); // Convert string to float
        if (!isNaN(amount)) {
          // If fiat is "PAYOUT", show in USD, otherwise show in XMR
          if (row.fiat === "PAYOUT") {
            return `${amount} USD`;
          } else if (row.fiat === "CC") {
            // Find the alternative formatted value for CC
            const alternative = alternativeValues.find(
              (val) => val.original === amount
            );
            return alternative ? `${alternative.formatted} USD` : "N/A"; // Use alternative formatted value
          } else {
            return `${amount} XMR`;
          }
        }
        return "N/A"; // Return "N/A" if the amount is invalid
      },
      sortable: true,
    },
    {
      name: "Status",
      selector: (row) => row.status,
      sortable: true,
    },
  ];

  return (
    <>
      {user && (
        <section className="hero-banner-bg">
          <section className="pb-5">
            <div className="container" style={{ paddingTop: "8rem" }}>
              <div className="row justify-content-center gy-4">
                <div className="col-12 text-center mb-4">
                  {user && user.status === "inactive" ? (
                    <div
                      className="alert alert-warning"
                      style={{ backgroundColor: "#333333", color: "#ffffff" }}
                    >
                      <h1>Your account is currently inactive.</h1>
                      <p>
                        Please complete pending actions to reactivate your
                        account.
                      </p>
                    </div>
                  ) : (
                    <div className="profile-info">
                      <h1>
                        {t("word56")}, {user.username}
                      </h1>
                    </div>
                  )}
                </div>

                <div className="container">
                  <div className="row justify-content-center mb-5">
                    {user?.admin && (
                      <div className="col-12 col-md-3 text-center mb-3">
                        <button
                          className="btn btn-primary w-100"
                          onClick={() => navigate("/admin")}
                          style={{ maxWidth: "80%" }}
                        >
                          Admin Panel
                        </button>
                      </div>
                    )}

                    {/*Add Balance button*/}
                    <div className="col-12 col-md-3 text-center mb-3">
                      <button
                        className="btn btn-primary w-100"
                        onClick={() =>
                          setShowAddBalanceForm(!showAddBalanceForm)
                        }
                        style={{ maxWidth: "80%" }}
                      >
                        {showAddBalanceForm ? "Cancel" : t("word59")}
                      </button>
                    </div>

                    {/*Payout button*/}
                    <div className="col-12 col-md-3 text-center mb-3">
                      <button
                        className="btn btn-outline-primary w-100"
                        onClick={() => setShowPayoutForm(!showPayoutForm)}
                        style={{
                          maxWidth: "80%",
                          backgroundColor: "transparent",
                          color: "white",
                        }}
                      >
                        {showPayoutForm ? "Cancel" : t("word58")}
                      </button>
                    </div>

                    {/*Password change button*/}
                    <div className="col-12 col-md-3 text-center mb-3">
                      <button
                        className="btn btn-outline-primary w-100"
                        onClick={() => setShowPasswordForm(!showPasswordForm)}
                        style={{
                          maxWidth: "80%",
                          backgroundColor: "transparent",
                          color: "white",
                        }}
                      >
                        {showPasswordForm ? "Cancel" : t("word57")}
                      </button>
                    </div>
                  </div>

                  {/* Show Crypto and Card/Bank sections only when showAddBalanceForm is true */}
                  {showAddBalanceForm && (
                    <div className="row justify-content-center">
                      {/* Crypto Section */}
                      {!showCardPaymentForm && (
                        <div className="col-md-4 mb-3">
                          <div className="p-3 bg-dark text-light">
                            <h5>
                              {t("word70")} <small>{t("word71")}</small>
                            </h5>
                            <ul className="list-unstyled mb-3">
                              <li className="text-success">• {t("word72")}</li>
                              <li className="text-success">• {t("word73")}</li>
                              <li>• {t("word74")}</li>
                            </ul>
                            <p style={{ fontSize: "0.875rem" }}>
                              {t("word75")}
                            </p>
                            {/* Button to show Add Balance form for Crypto */}
                            <button
                              className="btn btn-primary w-100"
                              style={{ marginTop: "21px" }}
                              onClick={() => {
                                setShowAddBalanceFormDetails(
                                  !showAddBalanceFormDetails
                                );
                                setShowCardPaymentForm(false);
                              }}
                            >
                              {showAddBalanceFormDetails
                                ? t("word85")
                                : t("word82")}
                            </button>
                          </div>
                        </div>
                      )}

                      {/* Card & Bank Transfer Section */}
                      {!showAddBalanceFormDetails && (
                        <div className="col-md-4 mb-3">
                          <div className="p-3 bg-dark text-light">
                            <h5>
                              {t("word76")} <small>{t("word77")}</small>
                            </h5>
                            <ul className="list-unstyled mb-3">
                              <li className="text-success">• {t("word78")}</li>
                              <li className="text-warning">• {t("word79")}</li>
                              <li>• {t("word80")}</li>
                            </ul>
                            <p style={{ fontSize: "0.875rem" }}>
                              {t("word81")}
                            </p>
                            {/* Button to show Add Balance form for Card */}
                            <button
                              className="btn btn-primary w-100"
                              onClick={() => {
                                setShowCardPaymentForm(!showCardPaymentForm);
                                setShowAddBalanceFormDetails(false);
                              }}
                            >
                              {showCardPaymentForm ? t("word85") : t("word83")}
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Show Add Balance Form for Crypto */}
                  {showAddBalanceFormDetails && (
                    <div className="row justify-content-center">
                      <div className="col-12 text-center mb-4">
                        <div className="add-balance-form mt-3">
                          {/* Use a flexbox to align buttons in a row */}
                          <div className="row justify-content-center mb-2">
                            <div className="col-auto">
                              {/* Button group for fixed amounts for Crypto */}
                              {[25, 50, 75, 100, 200, 500].map((amount) => (
                                <button
                                  key={amount}
                                  className={`btn mx-1 mb-2 ${
                                    balanceAmount === amount
                                      ? "btn-primary"
                                      : "btn-outline-primary"
                                  }`}
                                  onClick={() => setBalanceAmount(amount)}
                                  style={{ fontSize: "0.875rem" }}
                                >
                                  {amount} USD
                                </button>
                              ))}
                            </div>
                          </div>
                          {balanceError && (
                            <p
                              className="text-danger mb-2"
                              style={{ fontSize: "0.75rem" }}
                            >
                              {balanceError}
                            </p>
                          )}
                          <button
                            className="btn btn-primary w-100 mt-3"
                            onClick={handleAddBalance}
                            style={{
                              maxWidth: "200px",
                              padding: "0.5rem 1rem",
                              fontSize: "0.875rem",
                            }}
                          >
                            {t("word34")}
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Show Add Balance Form for Card/Bank */}
                  {showCardPaymentForm && (
                    <div className="row justify-content-center">
                      <div className="col-12 text-center mb-4">
                        <div className="add-balance-form mt-3">
                          {/* Use a flexbox to align buttons in a row */}
                          <div className="row justify-content-center mb-2">
                            <div className="col-auto">
                              {/* Button group for fixed amounts for Card */}
                              {[
                                { original: 25, formatted: 24.2 },
                                { original: 50, formatted: 48.5 },
                                { original: 75, formatted: 72.8 },
                                { original: 100, formatted: 97.1 },
                                { original: 200, formatted: 194.2 },
                                { original: 500, formatted: 485.6 },
                              ].map(({ original, formatted }) => (
                                <button
                                  key={original}
                                  className={`btn mx-1 mb-2 ${
                                    balanceAmount === original
                                      ? "btn-primary"
                                      : "btn-outline-primary"
                                  }`}
                                  onClick={() => setBalanceAmount(original)}
                                  style={{ fontSize: "0.875rem" }}
                                >
                                  {formatted} USD
                                </button>
                              ))}
                            </div>
                          </div>
                          {balanceError && (
                            <p
                              className="text-danger mb-2"
                              style={{ fontSize: "0.75rem" }}
                            >
                              {balanceError}
                            </p>
                          )}
                          <button
                            className="btn btn-primary w-100 mt-3"
                            onClick={submitCardPayment}
                            style={{
                              maxWidth: "200px",
                              padding: "0.5rem 1rem",
                              fontSize: "0.875rem",
                            }}
                          >
                            {t("word34")}
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {showPayoutForm && (
                    <div className="row justify-content-center">
                      <div className="col-12 text-center mb-4">
                        <div className="payout-form mt-3">
                          <div
                            className="input-group mb-2"
                            style={{ maxWidth: "300px", margin: "0 auto" }}
                          >
                            <select
                              className="form-select"
                              value={cryptoName}
                              onChange={(e) => setCryptoName(e.target.value)}
                              style={{
                                padding: "0.5rem",
                                fontSize: "0.875rem",
                                backgroundColor: "#191115",
                                color: "#ffffff",
                              }}
                            >
                              <option value="" disabled>
                                Select Crypto
                              </option>
                              <option value="USDT(TRC20)">
                                TRON USDT (TRC20)
                              </option>
                              <option value="Monero(XMR)">Monero (XMR)</option>
                              <option value="Bitcoin(BTC)">
                                Bitcoin (BTC)
                              </option>
                              <option value="Ethereum(ETH)">
                                Ethereum (ETH)
                              </option>
                              <option value="TRON(TRX)">TRON (TRX)</option>
                              <option value="USDT(ERC20)">
                                ETH USDT (ERC20)
                              </option>
                              <option value="Litecoin(LTC)">
                                Litecoin (LTC)
                              </option>
                              <option value="Polkadot(DOT)">
                                Polkadot (DOT)
                              </option>
                              <option value="Binance(BNB)">
                                Binance Coin(BNB)
                              </option>
                              <option value="Solana(SOL)">Solana (SOL)</option>

                              {/* Add more cryptocurrencies as needed */}
                            </select>
                          </div>

                          <div
                            className="input-group mb-2"
                            style={{ maxWidth: "300px", margin: "0 auto" }}
                          >
                            <input
                              type="text"
                              placeholder="Wallet Address"
                              value={address}
                              onChange={(e) => setAddress(e.target.value)}
                              className="form-control"
                              style={{
                                padding: "0.5rem",
                                fontSize: "0.875rem",
                              }}
                            />
                          </div>
                          <div
                            className="input-group mb-2"
                            style={{ maxWidth: "300px", margin: "0 auto" }}
                          >
                            <input
                              type="number"
                              placeholder="Amount in USD"
                              value={amount}
                              onChange={(e) => {
                                // Get the value entered by the user
                                let value = parseFloat(e.target.value);

                                // Ensure the amount is at least 0 and does not exceed the user's balance
                                if (isNaN(value)) {
                                  value = ""; // Reset to empty if the input is not a valid number
                                } else {
                                  value = Math.max(
                                    1,
                                    Math.min(value, user.balance)
                                  );
                                  value = Math.floor(value * 10) / 10;
                                }

                                // Update the state
                                setAmount(value);
                              }}
                              className="form-control"
                              style={{
                                padding: "0.5rem",
                                fontSize: "0.875rem",
                              }}
                            />
                          </div>

                          {payoutError && (
                            <p
                              className="text-danger mb-2"
                              style={{ fontSize: "0.75rem" }}
                            >
                              {payoutError}
                            </p>
                          )}

                          <button
                            className="btn btn-primary w-100"
                            onClick={handlePayout}
                            style={{
                              maxWidth: "200px",
                              padding: "0.5rem 1rem",
                              fontSize: "0.875rem",
                            }}
                          >
                            Create Payout
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {showPasswordForm && (
                    <div className="row justify-content-center">
                      <div className="col-12 text-center mb-4">
                        <div className="password-form mt-3">
                          <div
                            className="input-group mb-2"
                            style={{ maxWidth: "300px", margin: "0 auto" }}
                          >
                            <input
                              type="password"
                              placeholder="New Password"
                              value={newPassword}
                              onChange={(e) => setNewPassword(e.target.value)}
                              className="form-control"
                              style={{
                                padding: "0.5rem",
                                fontSize: "0.875rem",
                              }}
                            />
                          </div>
                          <div
                            className="input-group mb-2"
                            style={{ maxWidth: "300px", margin: "0 auto" }}
                          >
                            <input
                              type="password"
                              placeholder="Confirm Password"
                              value={confirmPassword}
                              onChange={(e) =>
                                setConfirmPassword(e.target.value)
                              }
                              className="form-control"
                              style={{
                                padding: "0.5rem",
                                fontSize: "0.875rem",
                              }}
                            />
                          </div>
                          {passwordError && (
                            <p
                              className="text-danger mb-2"
                              style={{ fontSize: "0.75rem" }}
                            >
                              {passwordError}
                            </p>
                          )}
                          <button
                            className="btn btn-primary w-100"
                            onClick={handlePasswordUpdate}
                            style={{
                              maxWidth: "200px",
                              padding: "0.5rem 1rem",
                              fontSize: "0.875rem",
                            }}
                          >
                            Confirm
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Ratings Section */}
                <div
                  className="col-11 col-md-12 mt-5 mb-5"
                  style={{
                    backgroundColor: "#171f29",
                    paddingBottom: "40px",
                    borderRadius: "10px",
                  }}
                >
                  <h2
                    className="text-left mt-5 mb-5"
                    style={{ marginLeft: "40px" }}
                  >
                    {t("word60")}
                  </h2>
                  <div
                    className="row justify-content-start gy-4"
                    style={{ paddingLeft: "40px", paddingRight: "40px" }}
                  >
                    {ratings.length > 0 ? (
                      <>
                        {ratings.map((rating) => (
                          <div
                            className="col-xxl-3 col-lg-4 col-md-6 mb-3"
                            key={rating._id}
                          >
                            <div
                              className="rating-card glass-bg p-3 text-center"
                              style={{ backgroundColor: "#333333" }}
                            >
                              <h5 className="mb-3">Submit Rating</h5>
                              <p
                                style={{
                                  wordWrap: "break-word",
                                  overflow: "hidden",
                                }}
                              >
                                <span>Campaign:</span> {rating.campaignTitle}
                              </p>
                              <p>
                                <span>Amount Contributed:</span>{" "}
                                {rating.amount.toFixed(2)} USD
                              </p>
                              <p>
                                <span>
                                  Are you satisfied with the campaign?
                                </span>
                              </p>
                              {!rating.isSubmitted && (
                                <div>
                                  <button
                                    className="btn btn-primary me-2"
                                    onClick={() =>
                                      handleRatingSubmit(rating.campaign, "yes")
                                    }
                                    disabled={submittingRating === rating._id}
                                  >
                                    Yes
                                  </button>
                                  <button
                                    className="btn btn-danger"
                                    onClick={() =>
                                      handleRatingSubmit(rating.campaign, "no")
                                    }
                                    disabled={submittingRating === rating._id}
                                  >
                                    No
                                  </button>
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      </>
                    ) : (
                      <div
                        className="col-12 text-center"
                        style={{ paddingLeft: "40px", paddingRight: "40px" }}
                      >
                        <p className="glass-bg p-3 mb-0 text-center">
                          {t("word84")}
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Contributions Section old
                <div className="col-12 mt-5 mb-5">
                  <h2 className="text-center mb-4">{t("word61")}</h2>
                  <div className="row justify-content-center gy-4">
                    {contributionsWithCampaigns.length > 0 ? (
                      contributionsWithCampaigns.map((campaign) => (
                        <div
                          className="col-xxl-3 col-lg-4 col-md-6"
                          key={campaign._id}
                        >
                          <FundraiseCard
                            id={campaign._id}
                            image={campaign.image}
                            title={campaign.title}
                            category={campaign.tags}
                            startAt={campaign.createdAt}
                            endAt={campaign.expiryDate}
                            creator={campaign.creator.username}
                            goalAmount={campaign.goalAmount}
                            remainingSlots={campaign.remainingSlots}
                            totalFundsRaised={campaign.totalFundsRaised}
                            description={campaign.description}
                            contributionPerSlot={
                              campaign.contributionPerParticipant
                            }
                            currentStatus={campaign.currentStatus}
                          />
                        </div>
                      ))
                    ) : (
                      <div className="col-12 text-center">
                        <p className="glass-bg p-3 mb-0 text-center">
                          There're no contributions yet
                        </p>
                      </div>
                    )}
                  </div>
                </div>*/}

                {/* Contributions */}
                <div
                  className="col-11 col-md-12 mt-5 mb-5"
                  style={{
                    backgroundColor: "#171f29",
                    paddingBottom: "40px",
                    borderRadius: "10px",
                  }}
                >
                  <h2
                    className="text-left mt-5 mb-5"
                    style={{ marginLeft: "40px" }}
                  >
                    {t("word61")}
                  </h2>

                  {contributionsWithCampaigns.length > 0 ? (
                    <div style={{ paddingLeft: "40px", paddingRight: "40px" }}>
                      {/* DataTable Component */}
                      <DataTable
                        columns={columns}
                        data={reversedContributions} // Use contributionsWithCampaigns directly
                        pagination
                        paginationPerPage={contributionsPerPage}
                        paginationRowsPerPageOptions={[10, 20, 30]} // Allows different page sizes
                        paginationComponentOptions={{
                          noRowsPerPage: false,
                        }}
                        responsive
                        theme="solarized"
                      />
                    </div>
                  ) : (
                    <div
                      className="col-12 text-center"
                      style={{ paddingLeft: "40px", paddingRight: "40px" }}
                    >
                      <p className="glass-bg p-3 mb-0 text-center">
                        There're no contributions yet
                      </p>
                    </div>
                  )}
                </div>

                {/* My Campaigns Section old
                <div className="col-12 mt-5 mb-5">
                  <h2 className="text-center mb-4">My Campaigns</h2>
                  <div className="row justify-content-center gy-4">
                    {myCampaigns.length > 0 ? (
                      myCampaigns.map((campaign) => (
                        <div
                          className="col-xxl-3 col-lg-4 col-md-6"
                          key={campaign._id}
                        >
                          <FundraiseCard
                            id={campaign._id}
                            image={campaign.image}
                            title={campaign.title}
                            category={campaign.tags}
                            startAt={campaign.createdAt}
                            endAt={campaign.expiryDate}
                            creator={campaign.creator.username}
                            goalAmount={campaign.goalAmount}
                            remainingSlots={campaign.remainingSlots}
                            totalFundsRaised={campaign.totalFundsRaised}
                            description={campaign.description}
                            contributionPerSlot={
                              campaign.contributionPerParticipant
                            }
                            currentStatus={campaign.currentStatus}
                          />
                        </div>
                      ))
                    ) : (
                      <div className="col-12 text-center">
                        <p className="glass-bg p-3 mb-0 text-center">
                          You haven't created any campaigns yet.
                        </p>
                      </div>
                    )}
                  </div>
                </div> */}

                {/* My Campaigns */}
                <div
                  className="col-11 col-md-12 mt-5 mb-5"
                  style={{
                    backgroundColor: "#171f29",
                    paddingBottom: "40px",
                    borderRadius: "10px",
                  }}
                >
                  <h2
                    className="text-left mt-5 mb-5"
                    style={{ marginLeft: "40px" }}
                  >
                    {t("word67")}
                  </h2>
                  {myCampaigns.length > 0 ? (
                    <div style={{ paddingLeft: "40px", paddingRight: "40px" }}>
                      <DataTable
                        columns={columns1}
                        data={reversedCampaigns}
                        pagination
                        paginationRowsPerPageOptions={[10, 20, 30]} // Options for pagination
                        paginationPerPage={10} // Default rows per page
                        responsive
                        theme="solarized"
                      />
                    </div>
                  ) : (
                    <div
                      className="col-12 text-center"
                      style={{ paddingLeft: "40px", paddingRight: "40px" }}
                    >
                      <p className="glass-bg p-3 mb-0 text-center">
                        You haven't created any campaigns yet.
                      </p>
                    </div>
                  )}
                </div>

                {/* Transactions Section old 
                <div className="transaction-list mb-5 mt-5">
                  <h2 className="text-center mt-5 mb-4">My Transactions</h2>
                  {loadingTransactions ? (
                    <p>Loading transactions...</p>
                  ) : transactions.length > 0 ? (
                    <table className="table table-striped mt-5">
                      <thead>
                        <tr>
                          <th>Transaction ID</th>
                          <th>Amount</th>
                          <th>Crypto</th>
                          <th>Status</th>
                          <th>Date</th>
                        </tr>
                      </thead>
                      <tbody>
                        {transactions.map((transaction) => (
                          <tr key={transaction._id}>
                            <td>{transaction._id}</td>
                            <td>{transaction.amount}</td>
                            <td>{transaction.cryptoName}</td>
                            <td>{transaction.status}</td>
                            <td>
                              {new Date(transaction.createdAt).toLocaleString()}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  ) : (
                    <p className="text-center">No transactions found.</p>
                  )}
                </div>*/}

                {/* Transactions Section */}
                <div
                  className="col-11 col-md-12 mb-5 mt-5"
                  style={{
                    backgroundColor: "#171f29",
                    paddingBottom: "40px",
                    borderRadius: "10px",
                  }}
                >
                  <h2
                    className="text-left mt-5 mb-5"
                    style={{ marginLeft: "40px" }}
                  >
                    {t("word68")}
                  </h2>
                  {loadingTransactions ? (
                    <p>Loading transactions...</p>
                  ) : transactions.length > 0 ? (
                    <div style={{ paddingLeft: "40px", paddingRight: "40px" }}>
                      <DataTable
                        columns={columns2}
                        data={transactions}
                        pagination
                        paginationRowsPerPageOptions={[10, 20, 30]} // Options for pagination
                        paginationPerPage={10} // Default rows per page
                        responsive
                        theme="solarized"
                      />
                    </div>
                  ) : (
                    <div
                      className="col-12 text-center"
                      style={{ paddingLeft: "40px", paddingRight: "40px" }}
                    >
                      <p className="glass-bg p-3 mb-0 text-center">
                        {t("word69")}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </section>
        </section>
      )}
    </>
  );
}

export default Profile;
