import React, { useState, useEffect } from "react";
import Select from "react-select";

import { getCampaigns, getTags } from "../../api";
import FundraiseCard from "../../components/general/FundraiseCard";
import { BiRightArrowAlt, BiLeftArrowAlt } from "react-icons/bi";

import { FixedSizeList as List } from "react-window";

import { useTranslation } from "react-i18next";

const DropdownVirtualizedMenu = (props) => {
  const children = React.Children.toArray(props.children);
  return (
    <List
      height={300} // Adjust height as needed
      itemCount={children.length}
      borderWidth={2}
      itemSize={40} // Height of each item
      width="100%"
    >
      {({ index, style }) => (
        <div
          style={{
            ...style,
            boxSizing: "border-box",
            overflow: "hidden",
            whiteSpace: "nowrap",
            textOverflow: "ellipsis",
          }}
        >
          <div
            style={{
              overflow: "hidden",
              whiteSpace: "nowrap",
              textOverflow: "ellipsis",
              width: "100%",
              wordBreak: "break-word", // Break long words when necessary
              overflowWrap: "break-word", // Ensure wrapping on word boundaries
            }}
          >
            {children[index]}
          </div>
        </div>
      )}
    </List>
  );
};

const selectStyles = {
  control: (provided) => ({
    ...provided,
    backgroundColor: "black",
    borderColor: "#414148",
    borderWidth: "2px",
    color: "#ffffff",
    boxShadow: "none",
    "&:hover": {
      borderColor: "#414148",
    },
    height: "40px",
  }),
  menu: (provided) => ({
    ...provided,
    backgroundColor: "black",
  }),
  singleValue: (provided) => ({
    ...provided,
    color: "#ffffff",
  }),
  option: (provided, state) => ({
    ...provided,
    color: "#ffffff",

    backgroundColor: state.isFocused ? "#11151d" : "#1a212d",

    "&:hover": {
      backgroundColor: "black",
    },
  }),
  placeholder: (provided) => ({
    ...provided,
    color: "#bbbbbb",
  }),
  dropdownIndicator: (provided) => ({
    ...provided,
    color: "#ffffff",
    "&:hover": {
      color: "#bbbbbb",
    },
  }),
  indicatorSeparator: () => ({
    display: "none",
  }),
  input: (provided) => ({
    ...provided,
    color: "#ffffff",
  }),
};

const inputStyles = {
  backgroundColor: "black",
  color: "#ffffff",
  border: "2px solid #414148",
  borderWidth: "2px",
  outline: "none",
  boxShadow: "none",
  borderRadius: "4px",
  padding: "0 12px",
  height: "40px",
  fontSize: "1rem",
  width: "100%",
  "&:focus": {
    borderColor: "#414148",
  },
  "&::placeholder": {
    color: "#bbbbbb",
  },
};

function CampaignsPage() {
  const { t } = useTranslation();
  const [campaigns, setCampaigns] = useState([]);
  const [filteredCampaigns, setFilteredCampaigns] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 7;
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [selectedTag, setSelectedTag] = useState({
    value: "all",
    label: t("word8"),
  });
  const [sortOption, setSortOption] = useState({
    value: "newest",
    label: t("word12"),
  });
  const [selectedStatus, setSelectedStatus] = useState({
    value: "active",
    label: t("word10"),
  });

  const [categories, setCategories] = useState([]);

  const statusOptions = [
    { value: "all", label: "All" },
    { value: "active", label: t("word10") },
    { value: "completed", label: t("word11") },
  ];

  const sortOptions = [
    { value: "newest", label: t("word12") },
    { value: "goalAmount", label: t("word13") },
    { value: "goalAmountPercentage", label: t("word14") },
    { value: "participants", label: t("word15") },
  ];

  const [subtags, setSubtags] = useState([]); // Store available subtags for the selected tag
  const [selectedSubtag, setSelectedSubtag] = useState({
    value: "all",
    label: t("word9"),
  });

  useEffect(() => {
    const fetchTags = async () => {
      try {
        const tags = await getTags();
        const formattedTags = tags.data.map((tag) => ({
          value: tag.name,
          label: tag.name,
          subtags: tag.subtags,
        }));
        setCategories([
          { value: "all", label: "All Categories" },
          ...formattedTags,
        ]);
      } catch (error) {
        console.error("Failed to fetch tags:", error);
      }
    };

    fetchTags();
  }, []);

  useEffect(() => {
    async function fetchCampaigns() {
      try {
        const response = await getCampaigns();
        const data = response.data;

        if (Array.isArray(data)) {
          setCampaigns(data);
          setFilteredCampaigns(data);
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

    // Filter by status
    if (selectedStatus.value !== "all") {
      updatedCampaigns = updatedCampaigns.filter(
        (campaign) => campaign.currentStatus === selectedStatus.value
      );
    }

    // Filter by tag
    if (selectedTag.value !== "all") {
      updatedCampaigns = updatedCampaigns.filter((campaign) =>
        campaign.tags.includes(selectedTag.value)
      );
    }

    // Filter by subtag
    if (selectedSubtag.value !== "all") {
      updatedCampaigns = updatedCampaigns.filter((campaign) =>
        campaign.subtags.includes(selectedSubtag.value)
      );
    }

    // Filter by search term
    if (search) {
      updatedCampaigns = updatedCampaigns.filter(
        (campaign) =>
          campaign.title.toLowerCase().includes(search.toLowerCase()) ||
          campaign.description.toLowerCase().includes(search.toLowerCase())
      );
    }

    // Sort campaigns
    switch (sortOption?.value) {
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
      case "newest": // Add this case for sorting by newest
        updatedCampaigns.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
        break;
      default:
        break;
    }

    setFilteredCampaigns(updatedCampaigns);
  }, [
    search,
    selectedTag,
    selectedSubtag,
    sortOption,
    selectedStatus,
    campaigns,
  ]);

  const indexOfLastCampaign = currentPage * itemsPerPage;
  const indexOfFirstCampaign = indexOfLastCampaign - itemsPerPage;
  const currentCampaigns = filteredCampaigns.slice(
    indexOfFirstCampaign,
    indexOfLastCampaign
  );

  const totalPages = Math.ceil(filteredCampaigns.length / itemsPerPage);

  const handleTagChange = (selectedTag) => {
    setSelectedTag(selectedTag);

    // If "All" is selected, reset subtags
    if (selectedTag.value === "all") {
      setSubtags([{ value: "all", label: "Sub-Category" }]);
      setSelectedSubtag({ value: "all", label: "Sub-Category" });
      return; // Exit the function early since there's no need to look for subtags
    }

    // Find the subtags for the selected tag
    const tag = categories.find(
      (category) => category.value === selectedTag.value
    );
    if (tag && tag.subtags) {
      const formattedSubtags = tag.subtags.map((subtag) => ({
        value: subtag,
        label: subtag,
      }));
      setSubtags([{ value: "all", label: "All" }, ...formattedSubtags]);
      setSelectedSubtag({ value: "all", label: "All" });
    } else {
      setSubtags([{ value: "all", label: "All" }]);
      setSelectedSubtag({ value: "all", label: "All" });
    }
  };

  const handleCreateButton = () => {
    if (!localStorage.getItem("token")) {
      // Redirect to the login page if no token is found
      window.location.href = "/login";
    } else {
      // Redirect to the create campaign page if a token is found
      window.location.href = "/create-campaign";
    }
  };

  return (
    <>
      <section className="hero-banner-bg">
        <section className="pb-5 mb-5 mt-5">
          <div
            className="container"
            style={{ paddingTop: "6rem", paddingBottom: "3rem" }}
          >
            <div
              className="d-none d-md-block mb-5"
              style={{ paddingBottom: "1rem" }}
            >
              <h1 className="text-center mb-5">{t("word6")}</h1>
            </div>
            <div className="row mb-5">
              <div className="col-md-4 mb-1">
                <input
                  type="text"
                  className="form-control"
                  style={inputStyles}
                  placeholder={t("word7")}
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              <div className="col-md-2 mb-1">
                <Select
                  components={{ MenuList: DropdownVirtualizedMenu }}
                  options={categories}
                  value={selectedTag}
                  onChange={(selectedOption) => {
                    setSelectedTag(selectedOption); // Update the selected tag
                    handleTagChange(selectedOption); // Update subtags based on the selected tag
                  }}
                  styles={selectStyles}
                  isClearable={false}
                  placeholder="Select Tag"
                  filterOption={(option, inputValue) =>
                    option.label
                      .toLowerCase()
                      .includes(inputValue.toLowerCase())
                  }
                />
              </div>

              <div className="col-md-2 mb-1">
                <Select
                  components={{ MenuList: DropdownVirtualizedMenu }}
                  options={subtags}
                  value={selectedSubtag}
                  onChange={setSelectedSubtag}
                  styles={selectStyles}
                  isClearable={false}
                  placeholder="Select Subtag"
                  filterOption={(option, inputValue) =>
                    option.label
                      .toLowerCase()
                      .includes(inputValue.toLowerCase())
                  }
                />
              </div>

              <div className="col-md-2 mb-1">
                <Select
                  options={statusOptions}
                  value={selectedStatus}
                  onChange={setSelectedStatus}
                  styles={selectStyles}
                  isClearable={false}
                  isSearchable={false}
                  placeholder="Select Status"
                />
              </div>
              <div className="col-md-2 mb-1">
                <Select
                  options={sortOptions}
                  value={sortOption}
                  onChange={setSortOption}
                  styles={selectStyles}
                  isClearable={false}
                  isSearchable={false}
                  placeholder="Sort By"
                />
              </div>
            </div>

            {/* Create Campaign Button for Mobile Screens Only */}
            <div className="col-12 d-block d-md-none text-center mb-3">
              <button
                className="btn btn-primary"
                onClick={handleCreateButton}
                style={{
                  padding: "10px 20px",
                  fontSize: "16px",
                  borderRadius: "10px",
                  width: "100%",
                }}
              >
                Create a New Campaign
              </button>
            </div>

            {/* Campaign Cards */}
            <div className="row justify-content-start gy-4">
              {/* Permanent Add Campaign Card as First Card */}
              <div className="col-xxl-3 col-lg-4 col-md-6 d-none d-md-block">
                <div
                  className="card fund-card overflow-hidden mb-4 mt-2"
                  onClick={handleCreateButton}
                  style={{
                    textAlign: "center",
                    cursor: "pointer",
                    minHeight: "508px", // Set height of the entire card
                    height: "93.75%", // Set height of the entire card
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    borderTopLeftRadius: "15px",
                    borderTopRightRadius: "15px",
                    borderBottomLeftRadius: "10px",
                    borderBottomRightRadius: "10px",
                    transition: "opacity 0.5s ease-in-out",
                  }}
                  onMouseEnter={(e) => {
                    e.target.querySelector("img").style.opacity = "1"; // On hover, set opacity to 1
                  }}
                  onMouseLeave={(e) => {
                    e.target.querySelector("img").style.opacity = "0.5"; // On leave, set opacity back to 0.5
                  }}
                >
                  <img
                    src={`${process.env.PUBLIC_URL}/plus-icon.svg`}
                    alt="Add new campaign"
                    style={{
                      width: "150px", // Adjust size as needed
                      height: "150px", // Adjust size as needed
                      opacity: "0.5",
                      transition: "opacity 0.5s ease-in-out",
                    }}
                  />
                </div>
              </div>

              {loading && <p>Loading campaigns...</p>}
              {error && <p>Error: {error}</p>}
              {!loading && !error && currentCampaigns.length > 0 ? (
                currentCampaigns.map((campaign) => (
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
                      contributionPerSlot={campaign.contributionPerParticipant}
                      currentStatus={campaign.currentStatus}
                    />
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
                    {/* Previous Button */}
                    <li
                      className={`page-item ${
                        currentPage === 1 ? "disabled" : ""
                      }`}
                    >
                      <button
                        className="page-link"
                        onClick={() => setCurrentPage(currentPage - 1)}
                        aria-label="Previous"
                        style={{ border: "none", background: "transparent" }} // Removing background
                      >
                        <BiLeftArrowAlt size={24} /> {/* Left arrow icon */}
                      </button>
                    </li>

                    {/* Page Numbers */}
                    {[...Array(totalPages).keys()].map((number) => (
                      <li
                        key={number}
                        className={`page-item ${
                          currentPage === number + 1 ? "active" : ""
                        }`}
                      >
                        <button
                          className={`page-link ${
                            currentPage === number + 1 ? "btn-primary" : ""
                          }`}
                          onClick={() => setCurrentPage(number + 1)}
                          style={{
                            border:
                              currentPage === number + 1
                                ? "none"
                                : "transparent",
                            borderRadius:
                              currentPage === number + 1 ? "4px" : "0",
                            background:
                              currentPage === number + 1 ? "" : "transparent",
                          }} // Custom styling for active page
                        >
                          {number + 1}
                        </button>
                      </li>
                    ))}

                    {/* Next Button */}
                    <li
                      className={`page-item ${
                        currentPage === totalPages ? "disabled" : ""
                      }`}
                    >
                      <button
                        className="page-link"
                        onClick={() => setCurrentPage(currentPage + 1)}
                        aria-label="Next"
                        style={{ border: "none", background: "transparent" }} // Removing background
                      >
                        <BiRightArrowAlt size={24} /> {/* Right arrow icon */}
                      </button>
                    </li>
                  </ul>
                </nav>
              </div>
            </div>
          </div>
        </section>
      </section>
    </>
  );
}

export default CampaignsPage;
