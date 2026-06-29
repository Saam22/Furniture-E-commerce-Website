const API_URL = 'http://localhost:5000/api';

function getToken() {
  return localStorage.getItem('furntureToken');
}

async function request(endpoint, options = {}) {
  const token = getToken();
  const headers = { 'Content-Type': 'application/json', ...options.headers };
  if (token) headers.Authorization = `Bearer ${token}`;
  const res = await fetch(`${API_URL}${endpoint}`, { ...options, headers });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Order operation failed');
  return data;
}

export async function createOrderApi(orderData) {
  const data = await request('/orders', {
    method: 'POST',
    body: JSON.stringify(orderData),
  });
  return data.data.order;
}

export async function fetchOrdersApi(page = 1, limit = 50) {
  const data = await request(`/orders?page=${page}&limit=${limit}`);
  return { orders: data.data, pagination: data.pagination };
}

export async function cancelOrderApi(orderId) {
  if (!orderId || typeof orderId !== 'string') throw new Error('Invalid order ID');
  const data = await request(`/orders/${orderId}/cancel`, {
    method: 'PUT',
  });
  return data.data.order;
}
