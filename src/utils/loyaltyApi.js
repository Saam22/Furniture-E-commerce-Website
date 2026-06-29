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
  if (!res.ok) throw new Error(data.message || 'Request failed');
  return data;
}

export async function fetchLoyaltyInfo() {
  const data = await request('/auth/loyalty');
  return data.data;
}
