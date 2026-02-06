import { apiClient } from "./apiClient";

export const fetchLandingMetrics = () => {
  return apiClient.get("/landing/metrics");
};
