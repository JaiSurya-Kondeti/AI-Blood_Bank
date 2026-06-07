const API_BASE_URL = "http://localhost:8000";

export const api = {
  async test() {
    const response = await fetch(`${API_BASE_URL}/test`);
    return response.json();
  },

  async analyzeHealth(file) {
    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch(
      `${API_BASE_URL}/health/analyze`,
      {
        method: "POST",
        body: formData,
      }
    );

    return response.json();
  },
};