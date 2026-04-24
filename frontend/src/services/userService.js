const BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000/api";

export const getAllUsers = async (token) => {
  const res = await fetch(`${BASE_URL}/users`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("Failed to fetch users");
  return res.json();
};

export const getUserById = async (id, token) => {
  const res = await fetch(`${BASE_URL}/users/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("Failed to fetch user");
  return res.json();
};
