import axios from "axios";

const API = "http://localhost:5000/api/notifications";

export const getNotifications = async (token) => {
  return await axios.get(API, {
    headers: { Authorization: `Bearer ${token}` }
  });
};

export const markAsRead = async (id, token) => {
  return await axios.put(`${API}/read/${id}`, {}, {
    headers: { Authorization: `Bearer ${token}` }
  });
};
export const markAllNotifications = async (token) => {
  return await axios.put(`${API}/read-all`, {}, {
    headers: { Authorization: `Bearer ${token}` }
  });
};
