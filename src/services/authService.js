import { AUTH_ENDPOINTS, TOKEN_CONFIG } from "../config";
import { decodeJWT } from "../utils/jwt";

class AuthService {
  static async refreshToken() {
    try {
      const response = await fetch(AUTH_ENDPOINTS.REFRESH, {
        method: "POST",
        credentials: "include", // Important for cookies
      });

      if (!response.ok) throw new Error("Failed to refresh token");

      const data = await response.json();
      localStorage.setItem(TOKEN_CONFIG.ACCESS_TOKEN_KEY, data.accessToken);

      return data.accessToken;
    } catch (error) {
      this.logout();
      throw error;
    }
  }

  static async login(email, password) {
    const response = await fetch(AUTH_ENDPOINTS.LOGIN, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include", // Important for cookies
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (response.ok && data.accessToken) {
      localStorage.setItem(TOKEN_CONFIG.ACCESS_TOKEN_KEY, data.accessToken);
      const decodedToken = decodeJWT(data.accessToken);
      localStorage.setItem(
        "user",
        JSON.stringify({
          ...decodedToken,
          email: decodedToken.email || email,
        })
      );
      return data;
    }

    throw new Error(data.message || "Login failed");
  }

  static logout() {
    localStorage.removeItem(TOKEN_CONFIG.ACCESS_TOKEN_KEY);
    localStorage.removeItem("user");
    // Clear refresh token cookie by setting it to expire
    document.cookie =
      "refreshToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
  }

  static isTokenExpired(token) {
    if (!token) return true;

    const decodedToken = decodeJWT(token);
    if (!decodedToken || !decodedToken.exp) return true;

    const currentTime = Date.now() / 1000;
    // Add 30-second buffer for token refresh
    return decodedToken.exp < currentTime + 30;
  }
}

export default AuthService;
