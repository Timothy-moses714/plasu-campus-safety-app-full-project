const BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000/api";

export const loginUser = async (email, password) => {
  const res = await fetch(`${BASE_URL}/auth/login`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email, password }) });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Login failed");
  return data;
};

export const registerUser = async (userData) => {
  const res = await fetch(`${BASE_URL}/auth/register`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(userData) });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Registration failed");
  return data;
};

export const logoutUser = async (token) => {
  await fetch(`${BASE_URL}/auth/logout`, { method: "POST", headers: { Authorization: `Bearer ${token}` } });
};
