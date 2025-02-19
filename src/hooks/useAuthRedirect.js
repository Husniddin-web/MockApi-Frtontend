import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AuthService from "../services/authService";

export const useAuthRedirect = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("accessToken");

    if (token) {
      if (!AuthService.isTokenExpired(token)) {
        navigate("/dashboard");
      } else {
        // Try to refresh the token
        AuthService.refreshToken()
          .then(() => navigate("/dashboard"))
          .catch(() => {
            AuthService.logout();
          });
      }
    }
  }, [navigate]);
};
