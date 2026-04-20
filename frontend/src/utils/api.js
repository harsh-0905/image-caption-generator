const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

/**
 * Generate captions for an uploaded image file.
 * @param {File} file - The image file
 * @param {string[]} styles - Array of caption styles
 * @returns {Promise<{basic, funny, professional, instagram}>}
 */
export async function generateCaptions(file, styles = ["basic", "funny", "professional", "instagram"]) {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("styles", styles.join(","));

  const response = await fetch(`${API_URL}/caption`, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    let detail = "Failed to generate captions.";
    try {
      const err = await response.json();
      detail = err.detail || detail;
    } catch (_) {}
    throw new Error(detail);
  }

  return response.json();
}

export async function checkHealth() {
  const response = await fetch(`${API_URL}/health`);
  return response.json();
}
