const API_URL = 'http://localhost:5000/api';

export function getToken() {
  return localStorage.getItem('furntureToken');
}

export function setToken(token) {
  if (token) localStorage.setItem('furntureToken', token);
  else localStorage.removeItem('furntureToken');
}

export function getStoredUser() {
  try {
    const u = localStorage.getItem('furntureUser');
    return u ? JSON.parse(u) : null;
  } catch {
    return null;
  }
}

export function setStoredUser(user) {
  if (user) localStorage.setItem('furntureUser', JSON.stringify(user));
  else localStorage.removeItem('furntureUser');
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

export async function loginApi(email, password) {
  return request('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
}

export async function registerApi(name, email, password, phone) {
  return request('/auth/register', {
    method: 'POST',
    body: JSON.stringify({ name, email, password, phone }),
  });
}

export async function getProfileApi() {
  return request('/auth/profile');
}
