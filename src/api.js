import axios from "axios";
const API_URL = process.env.REACT_APP_BACKEND_URL; // Your backend URL

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

// Add a request interceptor to include the token in the headers
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const register = (userData) => api.post("/users", userData);
export const login = (credentials) => api.post("/users/login", credentials);
export const getProfile = () => api.get("/users/me");
export const getCampaigns = () => api.get("/campaigns");
export const getCampaign = (id) => api.get(`/campaigns/${id}`);

export const createCampaign = (campaignData) =>
  api.post("/campaigns", campaignData);

export const sendMessage = (campaignId, messageData) =>
  api.post(`/campaigns/${campaignId}/messages`, messageData);

export const getMessages = (campaignId) =>
  api.get(`/campaigns/${campaignId}/messages`);

export const contribute = (campaignId) =>
  api.post(`/campaigns/${campaignId}/contribute`);

export const updatePassword = (passwordData) =>
  api.patch("/users/me", passwordData);

export const getRatings = () => api.get("/ratings");

export const rateUser = (ratingData) => api.post("/ratings", ratingData);

export const receivedRatings = (userId) =>
  api.get(`ratings/received/${userId}`);

export const fetchUser = (userId) => api.get(`/user/${userId}`);

export const addTag = (tag) => api.post("/add-tag", tag);

export const getTags = () => api.get("/tags");

export const deleteCampaign = (campaignId) =>
  api.delete(`/campaigns/${campaignId}`);

export const deleteTag = (tagName) => api.delete(`/tags/${tagName}`);

export const addTransaction = (transactionData) =>
  api.post("/transactions", transactionData);

export const getTransactions = () => api.get("/transactions");

export const createPayout = (payoutData) => api.post("/payout", payoutData);

export const getPayouts = () => api.get("/payouts");

export const patchPayout = (id, newData) => api.patch(`/payout/${id}`, newData);

export const getNotifications = () => api.get("/notifications");

export const notifyUser = (notificationData) =>
  api.post("/notify-user", notificationData);

export const notifyAll = (notificationData) =>
  api.post("/notify-all", notificationData);

export const getCommunityChatMessages = () => api.get("/communityChat");

export const sendCommunityChatMessage = (messageData) =>
  api.post("/communityChat", messageData);

export const markAllAsRead = () => api.patch("notifications/read");

export const uploadTransactions = (file) =>
  api.post("upload-transactions", file);

export const createRawTransaction = (amount) =>
  api.post("create-raw-transaction", amount);

export const getNonUsedTransactions = () => api.get("not-used-transactions");

export const banUser = (username) => api.patch(`ban/${username}`);

export const getFinalWalletBalance = () => api.get("getFinalWalletBalance");

export const getTotalUsersBalance = () => api.get("getTotalUsersBalance");

export const verify2FA = (code) => api.post("verify-2fa", code);

export default api;
