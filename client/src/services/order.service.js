import api from "./api.js";

export const createOrder = async () => {
  const response = await api.post("/orders");

  return response.data;
};

export const getOrders = async (params = {}) => {
  const response = await api.get("/orders", {
    params,
  });

  return response.data;
};

export const getOrderById = async (orderId) => {
  const response = await api.get(`/orders/${orderId}`);

  return response.data;
};

export const cancelOrder = async (orderId) => {
  const response = await api.patch(
    `/orders/${orderId}/cancel`
  );

  return response.data;
};

export const updateOrderStatus = async (orderId, status) => {
  const response = await api.patch(
    `/orders/${orderId}/status`,
    { status }
  );

  return response.data;
};