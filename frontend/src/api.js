
import axios from "axios";

const API_URL = "https://medicine-label-simplifier.onrender.com";

export async function analyzeMedicine(file) {
  const formData = new FormData();
  formData.append("file", file);

  const response = await axios.post(
    `${API_URL}/api/analyze-medicine`,
    formData
  );

  return response.data;
}

export async function getHistory() {
  const response = await axios.get(
    `${API_URL}/api/history`
  );

  return response.data;
}