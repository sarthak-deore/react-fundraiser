import React, { useState, useEffect, useContext } from "react";
import Select from "react-select-virtualized-glore";
import { useForm, Controller } from "react-hook-form";
// import { categories } from "../../helpers/constants";
import { toast } from "react-toastify";
import "react-datepicker/dist/react-datepicker.css";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

// API
import { createCampaign, getTags, getProfile } from "../../api";
import { AuthContext } from "../../context/authContext";

// HOOKS
import useApp from "../../hooks/useApp";

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
    height: "45px",
  }),
  menu: (provided) => ({
    ...provided,
    backgroundColor: "#1a212d",
    zIndex: 1000,
  }),

  singleValue: (provided) => ({
    ...provided,
    color: "#ffffff",
  }),
  option: (provided, state) => ({
    ...provided,
    backgroundColor: state.isFocused ? "lightblue" : "white",
    color: state.isSelected ? "white" : "black",
    padding: 10,
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

function CampaignForm() {
  const { t } = useTranslation();
  const { isAuthenticated } = useContext(AuthContext);
  const [user, setUser] = useState(null);

  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]); // State for subtags

  const [contributionPerHead, setContributionPerHead] = useState(0); // State for contribution per head
  const [warning, setWarning] = useState(""); // State for warning message
  const [totalFee, setTotalFee] = useState(0); // State for total fee

  useEffect(() => {
    // Fetch tags when component mounts
    const fetchTags = async () => {
      try {
        if (isAuthenticated) {
          const profileResponse = await getProfile();
          setUser(profileResponse.data);
        }

        const tags = await getTags(); // Fetch tags from API
        const formattedTags = tags.data.map((tag) => ({
          value: tag.name,
          label: tag.name,
          subtags: tag.subtags,
        })); // Format tags for categories
        setCategories(formattedTags); // Update state
      } catch (error) {
        console.error("Failed to fetch tags:", error);
      }
    };

    fetchTags(); // Call the fetch function
  }, [isAuthenticated]);

  const navigate = useNavigate();
  const { setTransactionLoading } = useApp();
  const [submit, setSubmit] = useState(false);
  const [image, setImage] = useState(null); // Add state for the image

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm({
    defaultValues: {
      profit: 0,
    },
  });

  const goal = watch("goal");
  const participantSlots = watch("participantSlots");
  const profit = watch("profit");

  useEffect(() => {
    if (goal && participantSlots) {
      if (participantSlots < 2) {
        setContributionPerHead("Minimum 2 participants needed");
        setTotalFee(0); // Reset total fee if minimum not met
        setWarning(""); // Clear any warnings
        return;
      }

      const baseContribution = goal / participantSlots;
      const baseFee = 0.1 * baseContribution;
      let additionalFee = 0;

      if (Number(profit) > 0) {
        additionalFee =
          (Number(profit) + Number(baseContribution)) /
          (Number(participantSlots) - 1);

        // Check if additionalFee is more than 30% of baseContribution
        if (additionalFee > 0.3 * baseContribution) {
          setWarning(t("word113"));
        } else {
          setWarning(""); // Clear warning if condition is met
        }
      } else {
        // Clear warning if profit is zero
        setWarning("");
      }

      const totalFee = Number(baseFee) + Number(additionalFee);
      setTotalFee(totalFee);

      const formattedContribution =
        t("word112") + `: ${baseContribution.toFixed(2)} USD`;
      setContributionPerHead(formattedContribution);
    } else {
      setContributionPerHead("");
      setTotalFee(0); // Reset total fee when there's no goal or slots
      setWarning(""); // Clear any warnings
    }
  }, [goal, participantSlots, profit, t]);

  /* --------------------------------------------- 
          HANDLE REGISTER FORM SUBMIT
    --------------------------------------------- */
  async function handleFormSubmit(data) {
    try {
      setTransactionLoading(true);
      setSubmit(true);

      const formData = new FormData(); // Use FormData for image upload

      formData.append("goalAmount", data.goal); // Matching backend goalAmount
      formData.append("title", data.title);
      formData.append("description", data.description);

      // Ensure category is a string
      const category = data.category ? data.category.value : "";
      formData.append("tags", category);

      formData.append("subtags", data.subtag.value); // Add subtags
      formData.append("profit", data.profit); // Add profit

      formData.append("participantSlots", data.participantSlots); // Add participantSlots
      formData.append("image", image);

      // Check if the user's status is active
      if (user && user.status !== "active") {
        toast.error("Please complete pending actions in your profile first.");
        setSubmit(false);
        setTimeout(() => {
          window.location.reload();
        }, 3000);
        return;
      }

      // Make the API request
      const response = await createCampaign(formData);

      // Check if the response status is 201
      if (response.status === 201) {
        toast.success("Campaign created successfully!");
        navigate(`/campaigns/${response.data._id}`); // Redirect to campaigns page
        setTimeout(() => {
          window.location.reload();
        }, 3000);
      } else {
        throw new Error("Failed to create campaign");
      }
    } catch (error) {
      setSubmit(false);

      // Check for error code and provide custom messages based on status code
      if (error.response) {
        switch (error.response.status) {
          case 400:
            toast.error(
              "Insufficient funds. Please add more funds to proceed."
            );
            setTimeout(() => {
              window.location.reload();
            }, 2000);
            break;
          case 500:
            toast.error(
              "Incorrect image format. Only PNG and JPG are allowed."
            );
            setTimeout(() => {
              window.location.reload();
            }, 2000);
            break;
          default:
            toast.error("An unexpected error occurred. Please try again.");
            setTimeout(() => {
              window.location.reload();
            }, 2000);
        }
      } else if (error.message) {
        toast.error(error.message || "Something went wrong");
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      } else {
        toast.error("An unknown error occurred");
        // wait 2 seconds then reload the page

        setTimeout(() => {
          window.location.reload();
        }, 2000);
      }
    } finally {
      setTransactionLoading(false);
    }
  }

  //handle tag change

  useEffect(() => {
    setSubcategories([]); // Reset subtags when the tag changes
  }, [categories]);

  // Function to handle tag change and update subtags
  const handleTagChange = (selectedTag) => {
    setValue("subtag", null); // Reset subtag value
    if (selectedTag && selectedTag.subtags) {
      // If a tag is selected, set its subtags
      const formattedSubtags = selectedTag.subtags.map((subtag) => ({
        value: subtag,
        label: subtag,
      }));
      setSubcategories(formattedSubtags); // Update the subtags list
    } else {
      // If no tag or "All" is selected, clear the subtags list
      setSubcategories([]); // This will trigger re-render
    }
  };

  /* --------------------------------------------- 
          HANDLE IMAGE UPLOAD
    --------------------------------------------- */
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
  };

  return (
    <>
      {!submit && (
        <form onSubmit={handleSubmit(handleFormSubmit)} noValidate>
          <div className="row g-4">
            {/* TITLE */}
            <div className="col-lg-12">
              <label className="form-label" htmlFor="title">
                {t("word89")}
              </label>
              <input
                type="text"
                className={`form-control ${errors.title ? "is-invalid" : ""}`}
                id="title"
                placeholder={t("word90")}
                name="title"
                maxLength="29" // Limit input to 40 characters
                {...register("title", {
                  required: {
                    value: true,
                    message: t("word105"),
                  },
                  maxLength: {
                    value: 40,
                    message: "Title must be at most 40 characters",
                  },
                })}
              />
              {errors.title && (
                <span className="invalid-feedback">
                  {errors.title?.message}
                </span>
              )}
            </div>

            {/* DESCRIPTION */}
            <div className="col-lg-12">
              <label className="form-label" htmlFor="description">
                {t("word91")}
              </label>
              <textarea
                rows="7"
                className={`form-control ${
                  errors.description ? "is-invalid" : ""
                }`}
                id="description"
                placeholder={t("word92")}
                name="description"
                {...register("description", {
                  required: {
                    value: true,
                    message: t("word106"),
                  },
                  minLength: {
                    value: 40,
                    message:
                      "Campaign description must be more than 40 characters",
                  },
                })}
              ></textarea>
              {errors.description && (
                <span className="invalid-feedback">
                  {errors.description?.message}
                </span>
              )}
            </div>

            {/* GOAL */}
            <div className="col-lg-6">
              <label className="form-label" htmlFor="goal">
                {t("word93")}
              </label>
              <input
                type="number"
                step="1"
                className={`form-control ${errors.goal ? "is-invalid" : ""}`}
                id="goal"
                placeholder={t("word94")}
                name="goal"
                {...register("goal", {
                  required: {
                    value: true,
                    message: t("word107"),
                  },
                  min: {
                    value: 1,
                    message: t("word107"),
                  },
                })}
              />
              {errors.goal && (
                <span className="invalid-feedback">{errors.goal?.message}</span>
              )}
            </div>

            {/* PARTICIPANT SLOTS */}
            <div className="col-lg-6">
              <label className="form-label" htmlFor="participantSlots">
                {t("word95")}
              </label>
              <input
                type="number"
                className={`form-control ${
                  errors.participantSlots ? "is-invalid" : ""
                }`}
                id="participantSlots"
                placeholder={t("word96")}
                name="participantSlots"
                {...register("participantSlots", {
                  required: {
                    value: true,
                    message: t("word108"),
                  },
                  min: {
                    value: 2,
                    message: "There must be at least 2 participant slot",
                  },
                })}
              />
              {errors.participantSlots && (
                <span className="invalid-feedback">
                  {errors.participantSlots?.message}
                </span>
              )}
            </div>

            {/* PROFIT */}
            <div className="col-lg-12">
              <label className="form-label" htmlFor="profit">
                {t("word97")}
              </label>
              <input
                type="number" // Use text to control the input precisely
                className={`form-control ${errors.profit ? "is-invalid" : ""}`}
                id="profit"
                placeholder="0"
                name="profit"
                value={watch("profit") || ""} // Keep input state in sync
                onChange={(e) => {
                  const value = e.target.value;

                  // Allow only non-negative integers: test against a regex for whole numbers
                  if (/^\d*$/.test(value)) {
                    setValue("profit", value); // Update the form value if the input is valid
                  }
                }}
                {...register("profit", {
                  required: {
                    value: true,
                    message: "Enter profit amount",
                  },
                  validate: {
                    nonNegativeInteger: (value) =>
                      /^\d+$/.test(value) ||
                      "Profit must be a non-negative integer",

                    // Check that additionalFee is within 30% of baseContribution
                    maxAdditionalFee: (value) => {
                      // Perform calculations only if goal and participantSlots are set
                      const baseContribution =
                        goal && participantSlots ? goal / participantSlots : 0;

                      // If value is zero, set additionalFee to zero
                      const additionalFee =
                        Number(value) === 0
                          ? 0
                          : (Number(value) + Number(baseContribution)) /
                            (Number(participantSlots) - 1);

                      return (
                        additionalFee <= 0.3 * baseContribution || t("word113")
                      );
                    },
                  },
                })}
              />
              {errors.profit && (
                <span className="invalid-feedback">
                  {errors.profit?.message}
                </span>
              )}
            </div>

            {/* CATEGORY */}
            <div className="col-lg-6">
              <label className="form-label" htmlFor="category">
                {t("word98")}
              </label>
              <Controller
                name="category"
                control={control}
                rules={{ required: t("word109") }}
                render={({ field }) => (
                  <Select
                    options={categories}
                    id="category"
                    styles={selectStyles}
                    optionHeight={40}
                    fast-option-focused={"background-color: #deebff"}
                    className={`border-0 shadow-sm ${
                      errors.category ? "is-invalid" : ""
                    }`}
                    placeholder="Select"
                    isSearchable={true}
                    onChange={(selectedOption) => {
                      field.onChange(selectedOption);
                      handleTagChange(selectedOption); // Update subtags
                    }}
                  />
                )}
              />
              {errors.category && (
                <span className="invalid-feedback">
                  {errors.category?.message}
                </span>
              )}
            </div>

            {/* SUBTAG */}
            <div className="col-lg-6">
              <label className="form-label" htmlFor="subtag">
                {t("word99")}
              </label>
              <Controller
                name="subtag"
                control={control}
                rules={{ required: t("word110") }}
                render={({ field }) => (
                  <Select
                    options={subcategories}
                    id="subtag"
                    optionHeight={40}
                    styles={selectStyles}
                    className={`border-0 shadow-sm ${
                      errors.subtag ? "is-invalid" : ""
                    }`}
                    placeholder="Select"
                    isSearchable={true}
                    {...field}
                  />
                )}
              />
              {errors.subtag && (
                <span className="invalid-feedback">
                  {errors.subtag?.message}
                </span>
              )}
            </div>

            {/* Show contribution per head */}
            <div className="col-lg-12 text-muted">
              <p>
                <span>
                  {contributionPerHead}
                  {totalFee !== 0 && (
                    <span>
                      {warning ? (
                        <span className="text-warning">
                          {" "}
                          (+ {totalFee.toFixed(2)})
                        </span>
                      ) : (
                        ` (+ ${totalFee.toFixed(2)})`
                      )}{" "}
                      USD
                    </span>
                  )}
                </span>
                <br />
                {warning && <span className="text-warning">{warning}</span>}
              </p>
            </div>

            <div className="col-lg-12">
              <p>{t("word100")}</p>
            </div>

            {/* CAMPAIGN IMAGE */}
            <div className="col-lg-12">
              <label className="form-label" htmlFor="image">
                {t("word101")}
              </label>
              <input
                type="file"
                className={`form-control ${errors.image ? "is-invalid" : ""}`}
                id="image"
                accept="image/png, image/jpeg"
                {...register("image", {
                  required: {
                    value: true,
                    message: t("word111"),
                  },
                  validate: {
                    acceptedFormats: (file) =>
                      file[0]?.type === "image/png" ||
                      file[0]?.type === "image/jpeg" ||
                      "Only PNG and JPEG formats are allowed",
                  },
                })}
                onChange={handleImageChange} // Handle image upload
              />
              {errors.image && (
                <span className="invalid-feedback">
                  {errors.image?.message}
                </span>
              )}
            </div>

            {/* SUBMIT */}
            <div className="col-12">
              <button className="btn btn-primary" type="submit">
                {t("word104")}
              </button>
            </div>
          </div>
        </form>
      )}
    </>
  );
}

export default CampaignForm;
