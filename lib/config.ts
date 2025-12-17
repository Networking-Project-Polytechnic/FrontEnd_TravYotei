// Replace this with your Spring Boot backend URL
export const API_BASE_URL = "https://backend-planning-travyotei-12.onrender.com" // Change this to your backend URL

// Helper function to build API URLs
export const buildApiUrl = (endpoint: string) => `${API_BASE_URL}${endpoint}`
