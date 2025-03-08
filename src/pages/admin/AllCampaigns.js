import React, { useState, useEffect } from "react";
import PageBanner from "../../components/general/PageBanner";
import { getCampaigns, getTags, deleteCampaign } from "../../api";
import FundraiseCard from "../../components/general/FundraiseCard";

function CampaignsPage() {
  const [campaigns, setCampaigns] = useState([]);
  const [filteredCampaigns, setFilteredCampaigns] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8; // Adjust items per page as needed
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [selectedTag, setSelectedTag] = useState("all");
  const [sortOption, setSortOption] = useState("none");

  const [categories, setCategories] = useState([]);

  const handleDelete = async (campaignId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this campaign?"
    );
    if (confirmed) {
      try {
        await deleteCampaign(campaignId);
        // Optionally, refresh the page or remove the campaign from UI
        alert("Campaign deleted successfully");
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      } catch (error) {
        console.error("Error deleting campaign:", error);
        alert("Failed to delete campaign");
      }
    }
  };

  useEffect(() => {
    // Fetch tags when component mounts
    const fetchTags = async () => {
      try {
        const tags = await getTags(); // Fetch tags from API
        const formattedTags = tags.data.map((tag) => ({
          value: tag.name,
          label: tag.name,
        })); // Format tags for categories
        setCategories(formattedTags); // Update state
      } catch (error) {
        console.error("Failed to fetch tags:", error);
      }
    };

    fetchTags(); // Call the fetch function
  }, []);

  useEffect(() => {
    async function fetchCampaigns() {
      try {
        const response = await getCampaigns();
        const data = response.data;

        if (Array.isArray(data)) {
          setCampaigns(data);
          setFilteredCampaigns(data); // Initialize filtered campaigns
        } else {
          console.error("Expected array but received:", data);
          setError("Invalid data format");
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchCampaigns();
  }, []);

  useEffect(() => {
    let updatedCampaigns = [...campaigns];

    // Filter by currentStatus
    updatedCampaigns = updatedCampaigns.filter(
      (campaign) => campaign.currentStatus === "active"
    );

    // Filter by search term
    if (search) {
      updatedCampaigns = updatedCampaigns.filter(
        (campaign) =>
          campaign.title.toLowerCase().includes(search.toLowerCase()) ||
          campaign.description.toLowerCase().includes(search.toLowerCase())
      );
    }

    // Filter by selected tag
    if (selectedTag !== "all") {
      updatedCampaigns = updatedCampaigns.filter((campaign) =>
        campaign.tags.includes(selectedTag)
      );
    }

    // Sort campaigns
    switch (sortOption) {
      case "goalAmount":
        updatedCampaigns.sort((a, b) => b.goalAmount - a.goalAmount);
        break;
      case "goalAmountPercentage":
        updatedCampaigns.sort((a, b) => {
          const aPercentage = (a.totalFundsRaised / a.goalAmount) * 100;
          const bPercentage = (b.totalFundsRaised / b.goalAmount) * 100;
          return bPercentage - aPercentage;
        });
        break;
      case "participants":
        updatedCampaigns.sort(
          (a, b) => b.participants.length - a.participants.length
        );
        break;
      default:
        break;
    }

    setFilteredCampaigns(updatedCampaigns);
  }, [search, selectedTag, sortOption, campaigns]);

  // Pagination logic
  const indexOfLastCampaign = currentPage * itemsPerPage;
  const indexOfFirstCampaign = indexOfLastCampaign - itemsPerPage;
  const currentCampaigns = filteredCampaigns.slice(
    indexOfFirstCampaign,
    indexOfLastCampaign
  );

  // Calculate total pages
  const totalPages = Math.ceil(filteredCampaigns.length / itemsPerPage);

  return (
    <>
      <PageBanner
        heading="All Campaigns"
        text="Browse through various fundraising campaigns"
      />

      <section className="pb-5">
        <div className="container">
          {/* Filters and Sorting */}
          <div className="row mb-4">
            <div className="col-md-4">
              <input
                type="text"
                className="form-control"
                style={{ backgroundColor: "#333333", color: "#ffffff" }}
                placeholder="Search by title or description"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <div className="col-md-4">
              <select
                className="form-select"
                style={{ backgroundColor: "#333333", color: "#ffffff" }}
                value={selectedTag}
                onChange={(e) => setSelectedTag(e.target.value)}
              >
                <option value="all">All</option>
                {categories.map((tag) => (
                  <option key={tag.value} value={tag.value}>
                    {tag.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="col-md-4">
              <select
                className="form-select"
                value={sortOption}
                style={{ backgroundColor: "#333333", color: "#ffffff" }}
                onChange={(e) => setSortOption(e.target.value)}
              >
                <option value="none">Sort By</option>
                <option value="goalAmount">Goal Amount</option>
                <option value="goalAmountPercentage">
                  Goal Amount Percentage
                </option>
                <option value="participants">Number of Participants</option>
              </select>
            </div>
          </div>

          {/* Campaign Cards */}
          <div className="row justify-content-center gy-4">
            {loading && <p>Loading campaigns...</p>}
            {error && <p>Error: {error}</p>}
            {!loading && !error && currentCampaigns.length > 0 ? (
              currentCampaigns.map((campaign) => (
                <div className="col-xxl-3 col-lg-4 col-md-6" key={campaign._id}>
                  <div style={{ position: "relative" }}>
                    {/* FundraiseCard component */}
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
                      contributionPerSlot={campaign.contributionPerParticipant}
                      currentStatus={campaign.currentStatus}
                    />
                    {/* Delete button positioned on top of the card */}
                    <button
                      className="btn btn-sm btn-danger"
                      onClick={() => handleDelete(campaign._id)}
                      style={{
                        position: "absolute",
                        top: "40px", // Adjust the vertical position
                        right: "20px", // Adjust the horizontal position, or center using "left: 50%; transform: translateX(-50%);"
                        zIndex: 1,
                      }}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-12 text-center">
                <p className="glass-bg p-3 mb-0 text-center">
                  There're no campaigns at the moment
                </p>
              </div>
            )}
          </div>

          {/* Pagination Controls */}
          <div className="row mt-4">
            <div className="col-12 text-center">
              <nav aria-label="Page navigation">
                <ul className="pagination justify-content-center">
                  <li
                    className={`page-item ${
                      currentPage === 1 ? "disabled" : ""
                    }`}
                  >
                    <button
                      className="page-link"
                      onClick={() => setCurrentPage(currentPage - 1)}
                      aria-label="Previous"
                      style={{ backgroundColor: "#333333", color: "#ffffff" }}
                    >
                      <span aria-hidden="true">&laquo;</span>
                    </button>
                  </li>
                  {[...Array(totalPages).keys()].map((number) => (
                    <li
                      key={number}
                      className={`page-item ${
                        currentPage === number + 1 ? "active" : ""
                      }`}
                    >
                      <button
                        className="page-link"
                        onClick={() => setCurrentPage(number + 1)}
                        style={{ backgroundColor: "#333333", color: "#ffffff" }}
                      >
                        {number + 1}
                      </button>
                    </li>
                  ))}
                  <li
                    className={`page-item ${
                      currentPage === totalPages ? "disabled" : ""
                    }`}
                  >
                    <button
                      className="page-link"
                      onClick={() => setCurrentPage(currentPage + 1)}
                      aria-label="Next"
                      style={{ backgroundColor: "#333333", color: "#ffffff" }}
                    >
                      <span aria-hidden="true">&raquo;</span>
                    </button>
                  </li>
                </ul>
              </nav>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
export default CampaignsPage;
