import api from "../utils/api";

export const addProduct = (data, token) =>
  api.post("/products/add", data, {
    headers: { Authorization: `Bearer ${token}` },
  });
