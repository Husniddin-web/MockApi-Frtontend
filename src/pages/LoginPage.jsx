import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import { decodeJWT } from "../utils/jwt";
import { useTheme } from "../context/ThemeContext";
import { useAuthRedirect } from "../hooks/useAuthRedirect";
import { Loader2 } from "lucide-react";
import Navbar from "../components/Navbar";
import Stars from "../components/Stars";
import "react-toastify/dist/ReactToastify.css";
import AuthService from "../services/authService";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { isDark } = useTheme();

  // Add auth redirect hook
  useAuthRedirect();

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      toast.error("Please fill in all fields.");
      return;
    }

    setLoading(true);

    try {
      await AuthService.login(email, password);
      toast.success("Login successful!");
      navigate("/dashboard");
    } catch (error) {
      console.error("Login error:", error);
      toast.error(error.message || "An error occurred while logging in.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-all duration-200">
      <Navbar />

      {/* Stars Background */}
      <Stars />

      <section className="min-h-screen flex flex-col items-center justify-center px-6 py-8">
        <div className="w-full max-w-md relative">
          {/* Logo */}
          <div className="mb-8 text-center">
            <svg
              className="h-12 w-12 mx-auto mb-4"
              viewBox="0 0 50 50"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle
                cx="25"
                cy="25"
                r="23"
                className="fill-blue-500 dark:fill-blue-400 transition-colors duration-200"
              />
              <path
                d="M20 15h12c3 0 5 2 5 5s-2 5-5 5H25v10"
                stroke="white"
                strokeWidth="4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <circle cx="35" cy="15" r="3" fill="white" />
            </svg>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white transition-colors duration-200">
              Welcome back
            </h2>
            <p className="mt-2 text-gray-700 dark:text-gray-300 transition-colors duration-200">
              Sign in to your account
            </p>
          </div>

          <div className="backdrop-blur-sm bg-white/30 dark:bg-gray-800/30 rounded-xl shadow-lg border border-gray-200/50 dark:border-gray-700/50 transition-all duration-200">
            <div className="p-6 space-y-6">
              <form className="space-y-4" onSubmit={handleLogin}>
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 transition-colors duration-200"
                  >
                    Email address
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="mt-1 block w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-4 py-2 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 transition-all duration-200"
                    placeholder="name@company.com"
                    required
                  />
                </div>

                <div>
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 transition-colors duration-200"
                  >
                    Password
                  </label>
                  <input
                    type="password"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="mt-1 block w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-4 py-2 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 transition-all duration-200"
                    placeholder="••••••••"
                    required
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <input
                      id="remember"
                      type="checkbox"
                      className="h-4 w-4 rounded border-gray-300 dark:border-gray-600 text-blue-600 focus:ring-blue-500 transition-all duration-200"
                    />
                    <label
                      htmlFor="remember"
                      className="ml-2 block text-sm text-gray-700 dark:text-gray-300 transition-colors duration-200"
                    >
                      Remember me
                    </label>
                  </div>
                  <a
                    href="#"
                    className="text-sm font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300 transition-colors duration-200"
                  >
                    Forgot password?
                  </a>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex justify-center items-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                >
                  {loading ? (
                    <>
                      <Loader2 className="animate-spin -ml-1 mr-2 h-4 w-4" />
                      Signing in...
                    </>
                  ) : (
                    "Sign in"
                  )}
                </button>
              </form>

              <div className="text-center">
                <p className="text-sm text-gray-600 dark:text-gray-400 transition-colors duration-200">
                  Don't have an account?{" "}
                  <a
                    href="/register"
                    className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300 transition-colors duration-200"
                  >
                    Sign up
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>

        <ToastContainer
          position="bottom-right"
          autoClose={3000}
          theme={isDark ? "dark" : "light"}
        />
      </section>
    </div>
  );
};

export default LoginPage;
