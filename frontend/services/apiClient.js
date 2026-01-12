import axios from "axios";

class ApiClient {
  constructor() {
    this.baseURL = "https://gigflow-servicehive.onrender.com/api/v1";

    this.client = axios.create({
      baseURL: this.baseURL,
      withCredentials: true, // 👈 equivalent of fetch credentials: "include"
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });

    // Optional: response interceptor (clean errors)
    this.client.interceptors.response.use(
      (response) => response.data,
      (error) => {
        console.error("API Error:", error.response || error.message);
        throw error.response?.data || error;
      }
    );
  }

  async customRequest(endpoint, options = {}) {
    try {
      const config = {
        url: endpoint,
        method: options.method || "GET",
        headers: options.headers || {},
        data: options.body || null,
      };

      // 🧠 If FormData → let browser set Content-Type
      if (options.body instanceof FormData) {
        delete config.headers["Content-Type"];
      }

      return await this.client(config);
    } catch (error) {
      throw error;
    }
  }

  // ============================
  // Auth APIs
  // ============================

  async signup(formData) {
    return this.customRequest("/auth/register", {
      method: "POST",
      body: formData, // 👈 FormData supported
    });
  }

  async login(email, username, password) {
    return this.customRequest("/auth/login", {
      method: "POST",
      body: { email, username, password }, // axios auto JSON.stringify
    });
  }

  async logout() {
    return this.customRequest("/auth/logout", {
      method: "POST",
    });
  }

  async getCurrentUser(userID) {
    return this.customRequest(`/auth/get-user/${userID}`, {
      method: "GET",
    });
  }

  async getAllGigs() {
    return this.customRequest(`/gig`, {
      method: "GET",
    });
  }

  async getGigByID(gigId) {
    return this.customRequest(`/bids/${gigId}`, {
      method: "GET",
    });
  }

  async postBid(gigId, message) {
    return this.customRequest(`/bids`, {
      method: "POST",
      body: { gigId, message },
    });
  }

  async healthCheck() {
    return this.customRequest(`/healthcheck`, {
      method: "GET",
    });
  }
}

const apiClient = new ApiClient();
export default apiClient;
