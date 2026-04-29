const BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000/api";

// ─── MOCK DATA (remove when backend is ready) ────────────────────────────────
const MOCK_USER = {
  id: "mock-001",
  name: "Timothy Dakup",
  email: "timothy@plasu.edu.ng",
  phone: "08012345678",
  role: "student",
  matricNumber: "PLU/CSC/2021/001",
  department: "Computer Science",
  token: "mock-jwt-token-123",
};

const USE_MOCK = true; // set to false when backend is ready
// ─────────────────────────────────────────────────────────────────────────────

export const loginUser = async (email, password) => {
  if (USE_MOCK) {
    // Accept any email/password in mock mode
    return { ...MOCK_USER, email };
  }
  const res = await fetch(`${BASE_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  if (!res.ok) throw new Error("Login failed");
  return res.json();
};

export const registerUser = async (userData) => {
  if (USE_MOCK) {
    return { ...MOCK_USER, ...userData };
  }
  const res = await fetch(`${BASE_URL}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(userData),
  });
  if (!res.ok) throw new Error("Registration failed");
  return res.json();
};

export const logoutUser = async (token) => {
  if (USE_MOCK) return;
  await fetch(`${BASE_URL}/auth/logout`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
  });
};
