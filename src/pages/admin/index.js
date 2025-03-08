import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import {
  getTags,
  addTag,
  deleteTag,
  getProfile,
  getPayouts,
  patchPayout,
  notifyUser,
  notifyAll,
  getNonUsedTransactions,
  uploadTransactions,
  banUser,
  getFinalWalletBalance,
  getTotalUsersBalance,
  verify2FA,
} from "../../api";
import PageBanner from "../../components/general/PageBanner";
import AllCampaigns from "./AllCampaigns";
import { useNavigate } from "react-router-dom"; // Import useNavigate for redirection

function AdminPanel() {
  const [tags, setTags] = useState([]);
  const [newTag, setNewTag] = useState("");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isAdmin, setIsAdmin] = useState(null); // State to store admin status
  const navigate = useNavigate(); // Hook for redirection

  const [payouts, setPayouts] = useState([]);

  const [username, setUsername] = useState(""); // User-specific username
  const [userMessage, setUserMessage] = useState(""); // Message for a specific user
  const [allMessage, setAllMessage] = useState(""); // Message for all users

  const [file, setFile] = useState(null);
  const [uploadSuccess, setUploadSuccess] = useState("");
  const [uploadError, setUploadError] = useState("");
  const [nonUsedTransactionCount, setNonUsedTransactionCount] = useState([]);

  const [banUsername, setBanUsername] = useState("");
  const [isConfirmed, setIsConfirmed] = useState(false);

  const [totalUsersBalance, setTotalUsersBalance] = useState(null);
  const [finalWalletBalance, setFinalWalletBalance] = useState(null);

  const [isVerified, setIsVerified] = useState(false);
  const [verificationCode, setVerificationCode] = useState("");
  const [verificationError, setVerificationError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handle2FASubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setVerificationError("");

    try {
      const response = await verify2FA({ twoFactorCode: verificationCode });
      if (response.data.verified) {
        setIsVerified(true);
        toast.success("2FA verification successful!");
      } else {
        setVerificationError("Invalid verification code");
        toast.error("Invalid verification code");
      }
    } catch (error) {
      setVerificationError("Verification failed. Please try again.");
      toast.error("Verification failed");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle file change event
  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  // Handle file submit event
  const handleFileSubmit = async (e) => {
    e.preventDefault();

    if (!file) {
      setUploadError("Please select a file");
      return;
    }

    try {
      // Call the API to upload the file
      const formData = new FormData();
      formData.append("file", file);

      await uploadTransactions(formData);

      setUploadSuccess("File uploaded successfully");
      setUploadError("");
      setFile(null); // Clear file after successful upload

      // Optionally, refresh the count of non-used transactions
      fetchNonUsedTransactionCount();
    } catch (error) {
      setUploadError("Failed to upload file");
      setUploadSuccess("");
    }
  };

  // Fetch count of non-used transactions
  const fetchNonUsedTransactionCount = async () => {
    try {
      const count = await getNonUsedTransactions();
      setNonUsedTransactionCount(count.data);
    } catch (error) {
      console.error("Failed to fetch non-used transactions", error);
    }
  };

  // Fetch non-used transaction count when the component loads
  useEffect(() => {
    fetchNonUsedTransactionCount();
  }, []);

  useEffect(() => {
    const fetchPayouts = async () => {
      const response = await getPayouts();
      setPayouts(response.data);
    };

    fetchPayouts();
  }, []);

  // Function to fetch balances
  const fetchBalances = async () => {
    try {
      // Replace with actual API endpoints or logic to fetch balances
      const totalBalanceResponse = await getTotalUsersBalance();
      const finalBalanceResponse = await getFinalWalletBalance();
      setTotalUsersBalance(totalBalanceResponse.data.totalBalance);
      setFinalWalletBalance(finalBalanceResponse.data.balance);
    } catch (err) {
      setError("Error fetching wallet balances.");
      console.error(err);
    }
  };

  useEffect(() => {
    fetchBalances();
  }, []);

  // Fetch user profile and tags on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const profileResponse = await getProfile(); // Fetch user profile
        if (profileResponse.data.admin) {
          setIsAdmin(true); // Set admin status
          // Fetch tags if user is an admin
          const tagsResponse = await getTags();
          setTags(tagsResponse.data); // Update state with fetched tags
        } else {
          setIsAdmin(false); // Set non-admin status
          navigate("/"); // Redirect to Page Not Found
        }
      } catch (error) {
        console.error("Failed to fetch profile or tags:", error);
        setIsAdmin(false); // Handle errors and set non-admin status
        navigate("/"); // Redirect to Page Not Found
      }
    };

    fetchData(); // Call the fetch function
  }, [navigate]); // Run effect when component mounts

  // Handle form submission for adding a new tag
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newTag.trim()) {
      setError("Tag name is required.");
      return;
    }

    try {
      await addTag({ name: newTag.trim() }); // Add new tag
      setNewTag(""); // Clear input
      setSuccessMessage("Tag added successfully!");
      setError(""); // Clear any previous error
      // Refetch tags to update the list
      const response = await getTags();
      setTags(response.data);
    } catch (error) {
      setError("Failed to add tag.");
      console.error("Failed to add tag:", error);
    }
  };

  // Handle deleting a tag
  const handleDeleteTag = async (tagName) => {
    try {
      await deleteTag(tagName); // Delete tag by name
      // Refetch tags to update the list
      const response = await getTags();
      setTags(response.data);
      setSuccessMessage(`Tag "${tagName}" deleted successfully!`);
      setError(""); // Clear any previous error
    } catch (error) {
      setError("Failed to delete tag.");
      console.error("Failed to delete tag:", error);
    }
  };

  if (isAdmin === null) {
    return <p>Loading...</p>; // Show loading state while checking admin status
  }

  if (isAdmin === false) {
    return <p>Page Not Found</p>; // Render a Page Not Found message for non-admin users
  }

  // Function to handle payout actions (mark as paid or reject)
  const handlePayoutAction = async (id, updateData) => {
    try {
      // Call the API to patch the payout status with the passed updateData object
      await patchPayout(id, updateData);

      // Show a success toast notification based on the updated status
      toast.success(
        `Payout ${
          updateData.status === "processed" ? "marked as Paid" : "Rejected"
        } successfully!`
      );

      // Re-fetch the payouts after updating the status
      const response = await getPayouts(); // Ensure this is awaited
      setPayouts(response.data); // Update state with the new payouts
    } catch (error) {
      // Show an error toast notification if something goes wrong
      toast.error("Failed to update payout status. Please try again.");
    }
  };

  // Handle the user-specific notification submission
  const handleUserNotificationSubmit = async (e) => {
    e.preventDefault();
    if (username && userMessage) {
      try {
        // Call the notifyUser function with the username and message
        await notifyUser({ username: username, message: userMessage });
        toast.success("Notification sent successfully!"); // Show a success toast notification
        setUsername(""); // Clear the username field
        setUserMessage(""); // Clear the message field
      } catch (error) {
        console.error("Failed to send notification:", error);
        toast.error("Failed to send notification. Please try again."); // Show an error toast notification
      }
    }
  };

  // Handle the "all users" notification submission
  const handleAllNotificationSubmit = async (e) => {
    e.preventDefault();

    if (allMessage) {
      try {
        // Call the notifyAll function with the message

        await notifyAll({ message: allMessage }); // Call the notifyAll function
        toast.success("Notification sent successfully!"); // Show a success toast notification
        setAllMessage(""); // Clear the message field
      } catch (error) {
        console.error("Failed to send notification:", error);
        toast.error("Failed to send notification. Please try again."); // Show an error toast notification
      }
    }
  };

  const handleBanSubmit = async (e) => {
    e.preventDefault();

    if (!isConfirmed) {
      toast.warn("Please check the confirmation box to ban the user.");
      return;
    }

    try {
      await banUser(banUsername);
      toast.success(`User ${banUsername} has been banned successfully.`);
      resetBanForm();
    } catch (error) {
      toast.error("Failed to ban user. Please try again.");
      resetBanForm();
    }
  };

  const resetBanForm = () => {
    setBanUsername("");
    setIsConfirmed(false);
  };

  if (isAdmin && !isVerified) {
    return (
      <>
        <div className="container mt-5 mb-5" style={{ paddingBottom: "100px" }}>
          <h1 className="mb-5 text-center">Admin Verfication</h1>
          <div
            className="card mx-auto"
            style={{
              maxWidth: "400px",
              backgroundColor: "#333333",
              borderRadius: "8px",
            }}
          >
            <div
              className="card-header"
              style={{
                backgroundColor: "#333333",
                color: "#ffffff",
                borderRadius: "8px 8px 0 0",
              }}
            >
              <h2 className="mb-0">Enter 2FA Code</h2>
            </div>
            <div
              className="card-body"
              style={{ backgroundColor: "#333333", color: "#ffffff" }}
            >
              <form onSubmit={handle2FASubmit}>
                <div className="mb-3">
                  <label htmlFor="verificationCode" className="form-label">
                    Verification Code
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="verificationCode"
                    value={verificationCode}
                    onChange={(e) => setVerificationCode(e.target.value)}
                    style={{
                      backgroundColor: "black",
                      color: "#ffffff",
                      borderColor: "#666666",
                    }}
                    placeholder="Enter 6-digit code"
                    maxLength="6"
                    required
                  />
                </div>
                {verificationError && (
                  <div className="alert alert-danger">{verificationError}</div>
                )}
                <button
                  type="submit"
                  className="btn btn-primary w-100"
                  disabled={isLoading}
                >
                  {isLoading ? "Verifying..." : "Verify"}
                </button>
              </form>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <PageBanner heading="Admin Panel" text="Admin Controls" />

      {/* Wallet Balances */}
      <div
        className="container mt-4 mb-5"
        style={{
          backgroundColor: "#333333",
          borderRadius: "8px",
          padding: "20px",
        }}
      >
        <h1 className="mb-4 text-light">All Balances</h1>

        {/* Card for Total Users Balance */}
        <div
          className="card mb-4"
          style={{ borderRadius: "8px", backgroundColor: "#444444" }}
        >
          <div
            className="card-header"
            style={{
              backgroundColor: "#333333",
              color: "#ffffff",
              borderRadius: "8px 8px 0 0",
            }}
          >
            <h4 className="mb-0">Total Users Balance (USD)</h4>
          </div>
          <div
            className="card-body"
            style={{ backgroundColor: "#333333", color: "#ffffff" }}
          >
            <p style={{ color: "#ffffff" }}>
              {totalUsersBalance !== null ? totalUsersBalance : "Loading..."}
            </p>
          </div>
        </div>

        {/* Card for Final Wallet Balance */}
        <div
          className="card mb-4"
          style={{ borderRadius: "8px", backgroundColor: "#444444" }}
        >
          <div
            className="card-header"
            style={{
              backgroundColor: "#333333",
              color: "#ffffff",
              borderRadius: "8px 8px 0 0",
            }}
          >
            <h4 className="mb-0">Final Wallet Balance (USDT)</h4>
          </div>
          <div
            className="card-body"
            style={{ backgroundColor: "#333333", color: "#ffffff" }}
          >
            <p style={{ color: "#ffffff" }}>
              {finalWalletBalance !== null ? finalWalletBalance : "Loading..."}
            </p>
          </div>
        </div>

        <div className="mb-5 px-4">
          <h5> Net Balance: {finalWalletBalance - totalUsersBalance}</h5>
        </div>
      </div>

      <div style={{ padding: "40px" }}></div>

      {/*Tags*/}
      <div
        className="container mt-4 mb-5"
        style={{
          backgroundColor: "#333333",
          borderRadius: "8px",
          padding: "20px",
        }}
      >
        <h1 className="mb-4 text-light">Manage Tags</h1>

        {/* Card for displaying current tags */}
        <div
          className="card mb-4"
          style={{ borderRadius: "8px", backgroundColor: "#444444" }}
        >
          <div
            className="card-header"
            style={{
              backgroundColor: "#333333",
              color: "#ffffff",
              borderRadius: "8px 8px 0 0",
            }}
          >
            <h2 className="mb-0">Current Tags</h2>
          </div>
          <div
            className="card-body"
            style={{ backgroundColor: "#333333", color: "#333333" }}
          >
            <ul className="list-group">
              {tags.length > 0 ? (
                tags.map((tag) => (
                  <li
                    key={tag.name}
                    className="list-group-item d-flex justify-content-between align-items-center"
                    style={{
                      backgroundColor: "#444444",
                      border: "none",
                      color: "#ffffff",
                    }}
                  >
                    {tag.name}
                    <button
                      onClick={() => handleDeleteTag(tag.name)}
                      className="btn btn-danger btn-sm"
                      style={{
                        marginLeft: "10px",
                        backgroundColor: "#ff4d4d",
                        borderColor: "#ff4d4d",
                        color: "#ffffff",
                      }}
                    >
                      Delete
                    </button>
                  </li>
                ))
              ) : (
                <p className="text-muted">No tags available.</p>
              )}
            </ul>
          </div>
        </div>

        {/* Card for form to add new tag */}
        <div
          className="card"
          style={{ borderRadius: "8px", backgroundColor: "#333333" }}
        >
          <div
            className="card-header"
            style={{
              backgroundColor: "#333333",
              color: "#ffffff",
              borderRadius: "8px 8px 8px 8px",
            }}
          >
            <h2 className="mb-0">Add New Tag</h2>
          </div>
          <div
            className="card-body"
            style={{ backgroundColor: "#333333", color: "#ffffff" }}
          >
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label
                  htmlFor="newTag"
                  className="form-label"
                  style={{ color: "#ffffff" }}
                >
                  Tag Name
                </label>
                <input
                  type="text"
                  id="newTag"
                  className="form-control"
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  style={{
                    backgroundColor: "#555555",
                    color: "#ffffff",
                    borderColor: "#666666",
                  }}
                />
              </div>
              {error && <p className="text-danger">{error}</p>}
              {successMessage && (
                <p className="text-success">{successMessage}</p>
              )}
              <button type="submit" className="btn btn-primary">
                Add Tag
              </button>
            </form>
          </div>
        </div>
      </div>

      <div style={{ padding: "40px" }}></div>

      {/* Payouts */}
      <div
        className="container mt-5"
        style={{
          backgroundColor: "#333333",
          borderRadius: "8px",
          padding: "20px",
        }}
      >
        <h1 className="mb-4 text-light">Manage Payouts</h1>

        {/* Card for displaying current payouts */}
        <div
          className="card mb-4"
          style={{ borderRadius: "8px", backgroundColor: "#444444" }}
        >
          <div
            className="card-header"
            style={{
              backgroundColor: "#333333",
              color: "#ffffff",
              borderRadius: "8px 8px 0 0",
            }}
          >
            <h2 className="mb-0">Pending Payouts</h2>
          </div>
          <div
            className="card-body"
            style={{ backgroundColor: "#333333", color: "#ffffff" }}
          >
            <ul className="list-group">
              {payouts.length > 0 ? (
                payouts.map((payout) => (
                  <li
                    key={payout._id}
                    className="list-group-item d-flex justify-content-between align-items-center"
                    style={{
                      backgroundColor: "#444444",
                      border: "none",
                      color: "#ffffff",
                    }}
                  >
                    <div className="d-flex justify-content-between align-items-center">
                      {/* User Name Box */}
                      <div
                        className="p-2"
                        style={{
                          backgroundColor: "#555555",
                          color: "#ffffff",
                          borderRadius: "8px",
                          width: "150px",
                          marginRight: "20px",
                        }}
                      >
                        <span>user: {payout.username}</span>
                      </div>

                      {/* Crypto Name Box */}
                      <div
                        className="p-2"
                        style={{
                          backgroundColor: "#555555",
                          color: "#ffffff",
                          borderRadius: "8px",
                          width: "140px",
                          marginRight: "20px",
                        }}
                      >
                        <strong>{payout.cryptoName}</strong>
                      </div>

                      {/* Amount in USD Box */}
                      <div
                        className="p-2"
                        style={{
                          backgroundColor: "#666666",
                          color: "#ffffff",
                          borderRadius: "8px",
                          width: "100px",
                          marginRight: "20px",
                        }}
                      >
                        {payout.amount} USD
                      </div>

                      {/* Address Box */}
                      <div
                        className="p-2"
                        style={{
                          backgroundColor: "#777777",
                          color: "#ffffff",
                          borderRadius: "8px",
                          width: "600px",
                          marginRight: "20px",
                        }}
                      >
                        {payout.address}
                      </div>
                    </div>
                    <div className="d-flex">
                      {/* Mark Paid Button */}
                      <button
                        onClick={() =>
                          handlePayoutAction(payout._id, {
                            status: "processed",
                          })
                        }
                        className="btn btn-success btn-sm mx-2"
                        style={{
                          backgroundColor: "#28a745",
                          borderColor: "#28a745",
                          color: "#ffffff",
                        }}
                        disabled={payout.status === "processed"}
                      >
                        Mark Paid
                      </button>

                      {/* Rejected Button */}
                      <button
                        onClick={() =>
                          handlePayoutAction(payout._id, {
                            status: "rejected",
                          })
                        }
                        className="btn btn-danger btn-sm"
                        style={{
                          backgroundColor: "#dc3545",
                          borderColor: "#dc3545",
                          color: "#ffffff",
                        }}
                        disabled={payout.status === "rejected"}
                      >
                        Rejected
                      </button>
                    </div>
                  </li>
                ))
              ) : (
                <p className="text-muted">No payouts available.</p>
              )}
            </ul>
          </div>
        </div>
      </div>

      <div style={{ padding: "40px" }}></div>

      {/* Transactions Upload */}
      <div
        className="container mt-4 mb-5"
        style={{
          backgroundColor: "#333333",
          borderRadius: "8px",
          padding: "20px",
        }}
      >
        <h1 className="mb-4 text-light">Manage Card Payment Links</h1>

        {/* Upload XLSX File Card */}
        <div
          className="card mb-4"
          style={{ borderRadius: "8px", backgroundColor: "#444444" }}
        >
          <div
            className="card-header"
            style={{
              backgroundColor: "#333333",
              color: "#ffffff",
              borderRadius: "8px 8px 0 0",
            }}
          >
            <h2 className="mb-1">Upload Payment Links (.xlsx)</h2>
            <h5 className="mb-0 text-warning" style={{ fontSize: "15px" }}>
              1. File content and headers must be exactly same as the demo file!
              <br />
              2. Only .xlsx files allowed!
            </h5>
          </div>
          <div
            className="card-body"
            style={{ backgroundColor: "#333333", color: "#ffffff" }}
          >
            <form onSubmit={handleFileSubmit}>
              <div className="mb-3">
                <label
                  htmlFor="transactionFile"
                  className="form-label"
                  style={{ color: "#ffffff" }}
                >
                  Choose File
                </label>
                <input
                  type="file"
                  id="transactionFile"
                  className="form-control"
                  accept=".xlsx"
                  onChange={handleFileChange}
                  style={{
                    backgroundColor: "#555555",
                    color: "#ffffff",
                    borderColor: "#666666",
                  }}
                />
              </div>
              {uploadError && <p className="text-danger">{uploadError}</p>}
              {uploadSuccess && <p className="text-success">{uploadSuccess}</p>}
              <button type="submit" className="btn btn-primary">
                Upload File
              </button>
            </form>
          </div>
        </div>

        {/* Non-Used Transactions Count Card */}
        {nonUsedTransactionCount.map((transaction) => (
          <div
            key={transaction.amount}
            className="card mb-0"
            style={{ borderRadius: "8px", backgroundColor: "#333333" }}
          >
            <div
              className="card-header"
              style={{
                backgroundColor: "#333333",
                color: "#ffffff",
                borderRadius: "8px 8px 8px 8px",
              }}
            >
              <h2
                className="mb-0"
                style={{
                  fontSize: "1rem",
                  fontWeight: "normal",
                  color: "#cccccc",
                }}
              >
                Payment Links left for {transaction.amount} USD:{" "}
                {transaction.count}
              </h2>
            </div>
          </div>
        ))}
      </div>

      <div style={{ padding: "40px" }}></div>

      {/*Notifications*/}
      <div
        className="container mt-5"
        style={{
          backgroundColor: "#333333",
          borderRadius: "8px",
          padding: "20px",
        }}
      >
        <h1 className="mb-4 text-light">Send Notifications</h1>

        <div className="row">
          {/* Send Notification to a Specific User */}
          <div className="col-md-6 mb-4">
            <div
              className="card"
              style={{ borderRadius: "8px", backgroundColor: "#444444" }}
            >
              <div
                className="card-header"
                style={{
                  backgroundColor: "#333333",
                  color: "#ffffff",
                  borderRadius: "8px 8px 0 0",
                }}
              >
                <h2 className="mb-0">Send Notification to Specific User</h2>
              </div>
              <div
                className="card-body"
                style={{ backgroundColor: "#333333", color: "#ffffff" }}
              >
                <form onSubmit={handleUserNotificationSubmit}>
                  <div className="mb-3">
                    <label htmlFor="username" className="form-label">
                      Username
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="username"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      style={{
                        backgroundColor: "#555555",
                        color: "#ffffff",
                        borderRadius: "8px",
                      }}
                      required
                    />
                  </div>

                  <div className="mb-3">
                    <label htmlFor="userMessage" className="form-label">
                      Message
                    </label>
                    <textarea
                      className="form-control"
                      id="userMessage"
                      rows="3"
                      value={userMessage}
                      onChange={(e) => setUserMessage(e.target.value)}
                      style={{
                        backgroundColor: "#555555",
                        color: "#ffffff",
                        borderRadius: "8px",
                      }}
                      required
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    className="btn btn-primary"
                    style={{
                      backgroundColor: "#007bff",
                      borderColor: "#007bff",
                    }}
                  >
                    Send Notification to User
                  </button>
                </form>
              </div>
            </div>
          </div>

          {/* Send Notification to All Users */}
          <div className="col-md-6 mb-4">
            <div
              className="card"
              style={{ borderRadius: "8px", backgroundColor: "#444444" }}
            >
              <div
                className="card-header"
                style={{
                  backgroundColor: "#333333",
                  color: "#ffffff",
                  borderRadius: "8px 8px 0 0",
                }}
              >
                <h2 className="mb-0">Send Notification to All Users</h2>
              </div>
              <div
                className="card-body"
                style={{ backgroundColor: "#333333", color: "#ffffff" }}
              >
                <form onSubmit={handleAllNotificationSubmit}>
                  <div className="mb-3">
                    <label htmlFor="allMessage" className="form-label">
                      Message
                    </label>
                    <textarea
                      className="form-control"
                      id="allMessage"
                      rows="3"
                      value={allMessage}
                      onChange={(e) => setAllMessage(e.target.value)}
                      style={{
                        backgroundColor: "#555555",
                        color: "#ffffff",
                        borderRadius: "8px",
                      }}
                      required
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    className="btn btn-primary"
                    style={{
                      backgroundColor: "#007bff",
                      borderColor: "#007bff",
                    }}
                  >
                    Send Notification to All
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div style={{ padding: "40px" }}></div>

      {/* Ban User */}
      <div
        className="container mt-5"
        style={{
          backgroundColor: "#333333",
          borderRadius: "8px",
          padding: "20px",
        }}
      >
        <h1 className="mb-4 text-light">Ban User</h1>

        <div className="row">
          <div className="col-md-6 mb-4">
            <div
              className="card"
              style={{ borderRadius: "8px", backgroundColor: "#444444" }}
            >
              <div
                className="card-header"
                style={{
                  backgroundColor: "#333333",
                  color: "#ffffff",
                  borderRadius: "8px 8px 0 0",
                }}
              >
                <h2 className="mb-0">Enter Exact Username</h2>
              </div>
              <div
                className="card-body"
                style={{ backgroundColor: "#333333", color: "#ffffff" }}
              >
                <form onSubmit={handleBanSubmit}>
                  <div className="mb-3">
                    <label htmlFor="banUsername" className="form-label">
                      Username
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="banUsername"
                      value={banUsername}
                      onChange={(e) => setBanUsername(e.target.value)}
                      style={{
                        backgroundColor: "#555555",
                        color: "#ffffff",
                        borderRadius: "8px",
                      }}
                      required
                    />
                  </div>

                  <div className="mb-3 form-check">
                    <input
                      type="checkbox"
                      className="form-check-input"
                      id="confirmBan"
                      checked={isConfirmed}
                      onChange={() => setIsConfirmed(!isConfirmed)}
                    />
                    <label
                      htmlFor="confirmBan"
                      className="form-check-label text-light"
                    >
                      I understand that this action is irreversible.
                    </label>
                  </div>

                  <button
                    type="submit"
                    className="btn btn-danger"
                    style={{
                      backgroundColor: isConfirmed ? "#dc3545" : "#6c757d",
                      borderColor: isConfirmed ? "#dc3545" : "#6c757d",
                    }}
                    disabled={!isConfirmed}
                  >
                    Ban User
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>

      <AllCampaigns />
    </>
  );
}

export default AdminPanel;
