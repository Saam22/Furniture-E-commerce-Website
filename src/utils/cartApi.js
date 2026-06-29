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
  if (!res.ok) throw new Error(data.message || 'Cart operation failed');
  return data;
}

export async function fetchCart() {
  const data = await request('/cart');
  return data.data.cart;
}

export async function addToCartApi(productId, quantity = 1) {
  const data = await request('/cart/items', {
    method: 'POST',
    body: JSON.stringify({ productId, quantity }),
  });
  return data.data.cart;
}

export async function updateCartItemApi(productId, quantity) {
  const data = await request('/cart/items', {
    method: 'PUT',
    body: JSON.stringify({ productId, quantity }),
  });
  return data.data.cart;
}

export async function removeFromCartApi(productId) {
  const data = await request(`/cart/items/${productId}`, {
    method: 'DELETE',
  });
  return data.data.cart;
}

export async function clearCartApi() {
  const data = await request('/cart', { method: 'DELETE' });
  return data.data.cart;
}
