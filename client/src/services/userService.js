import axios from "axios";

const API = "http://localhost:5000/api/users";

export const getUsers = async (token) => {
  return await axios.get(API, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const createUser = async (data, token) => {
  return await axios.post(`${API}/add`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const deleteUser = async (id, token) => {
  return await axios.delete(`${API}/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};
