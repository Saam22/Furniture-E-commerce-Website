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
  if (!res.ok) throw new Error(data.message || 'Something went wrong');
  return data;
}

export async function getDashboard() {
  return request('/admin/dashboard');
}

export async function getAllOrders(page = 1, status = '') {
  const params = new URLSearchParams({ page, limit: '50' });
  if (status) params.set('status', status);
  return request(`/admin/orders?${params}`);
}

export async function updateOrderStatus(orderId, status) {
  return request(`/admin/orders/${orderId}/status`, {
    method: 'PUT',
    body: JSON.stringify({ status }),
  });
}

export async function getAdminProducts(page = 1) {
  return request(`/products?page=${page}&limit=100`);
}

export async function createProduct(data) {
  return request('/products', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function updateProduct(id, data) {
  return request(`/products/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

export async function deleteProduct(id) {
  return request(`/products/${id}`, { method: 'DELETE' });
}
