import axios from "axios";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:7000/api";

export const api = axios.create({
  baseURL: API_BASE
});

export async function fetchClubs() {
  const { data } = await api.get("/clubs");
  return data;
}

export async function fetchEvents(params = {}) {
  const { data } = await api.get("/events", { params });
  return data;
}

export async function createReview(payload) {
  const { data } = await api.post("/reviews", payload);
  return data;
}

export async function fetchReviews(params = {}) {
  const { data } = await api.get("/reviews", { params });
  return data;
}

export async function fetchStats() {
  const { data } = await api.get("/reviews/stats");
  return data;
}

export async function removeReview(reviewId) {
  const { data } = await api.delete(`/reviews/${reviewId}`);
  return data;
}
