import axios from "axios";

const API_URL = "http://127.0.0.1:8000";

export async function analyzeMedicine(file, getToken) {
  const token = await getToken();

  console.log("Token exists:", !!token);

  if (!token) {
    throw new Error("Clerk token was not available.");
  }

  const formData = new FormData();
  formData.append("file", file);

  const response = await axios.post(
    `${API_URL}/api/analyze-medicine`,
    formData,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
}

export async function getHistory(getToken) {
  const token = await getToken();

  if (!token) {
    throw new Error("Clerk token was not available.");
  }

  const response = await axios.get(
    `${API_URL}/api/history`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
}