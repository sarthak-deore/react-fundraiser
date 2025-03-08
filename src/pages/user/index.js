import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchUser, receivedRatings } from "../../api";
import NotFound from "../../components/NotFound";
import PageBanner from "../../components/general/PageBanner";

function UserProfile() {
  const { username } = useParams();
  const [user, setUser] = useState(null);
  const [ratingsReceived, setRatingsReceived] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getUserData = async () => {
      try {
        // Fetch user details
        const userResponse = await fetchUser(username);
        setUser(userResponse.data);

        // Fetch ratings received
        const ratingsResponse = await receivedRatings(username);
        setRatingsReceived(ratingsResponse.data);
      } catch (err) {
        setError("User not found or failed to fetch user data");
      } finally {
        setLoading(false);
      }
    };

    getUserData();
  }, [username]);

  if (loading) return <p>Loading...</p>;
  if (error || !user) return <NotFound />;

  return (
    <>
      <PageBanner heading={`${user.username}'s Profile`} text="Profile" />

      <section style={{ paddingTop: "0rem", paddingBottom: "16rem" }}>
        <div
          style={{
            backgroundColor: "#333333",
            color: "#ffffff",
            borderRadius: "0.5rem",
            padding: "1rem",
            margin: "1rem auto",
            maxWidth: "800px",
          }}
        >
          <div style={{ marginBottom: "1rem" }}>
            <p>Username: {user.username}</p>
            <p>Joined on: {new Date(user.joinDate).toLocaleDateString()}</p>
            <p>Total Contributions: {user.totalContributions} USD</p>
            <p>Campaigns Created: {user.campaignsCreated}</p>
            {ratingsReceived && (
              <>
                <p>Number of Ratings: {ratingsReceived.number}</p>
                <p>
                  Trust Score:{" "}
                  <span
                    style={{
                      backgroundColor: "#28a745",
                      color: "#fff",
                      padding: "0.25rem 0.5rem",
                      borderRadius: "0.25rem",
                    }}
                  >
                    {ratingsReceived.score}%
                  </span>
                </p>
              </>
            )}
          </div>
        </div>
      </section>
    </>
  );
}

export default UserProfile;
