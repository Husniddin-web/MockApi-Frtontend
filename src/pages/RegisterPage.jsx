import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import { useTheme } from "../context/ThemeContext";
import { useAuthRedirect } from "../hooks/useAuthRedirect";
import { Loader2 } from "lucide-react";
import "react-toastify/dist/ReactToastify.css";

const RegisterPage = () => {
  const BASE_URL = `${import.meta.env.VITE_API_URL}/user`;
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { isDark } = useTheme();
  console.log(BASE_URL);
  // Add auth redirect hook
  useAuthRedirect();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    if (
      !formData.fullName ||
      !formData.email ||
      !formData.password ||
      !formData.confirmPassword
    ) {
      toast.error("Please fill out all fields.");
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match.");
      return false;
    }
    return true;
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {


      const response = await fetch(BASE_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.fullName,
          email: formData.email,
          password: formData.password,
        }),
      });
      const data = await response.json();
      console.log(data);

      if (!response.ok) {
        throw new Error(data.message || "Registration failed");
      }

      toast.success(
        "Registration successful! Please check your email to activate your account.",
        {
          onClose: () => navigate("/login"),
        }
      );
    } catch (error) {
      console.error("Registration error:", error);
      toast.error(error.message || "An error occurred during registration");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="min-h-screen flex flex-col items-center justify-center px-6 py-8 bg-gray-50 dark:bg-gray-900 transition-all duration-200">
      <div className="w-full max-w-md">
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
            Create an account
          </h2>
          <p className="mt-2 text-gray-600 dark:text-gray-400 transition-colors duration-200">
            Start your journey with us today
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 backdrop-blur-sm transition-all duration-200">
          <div className="p-6 space-y-6">
            <form className="space-y-4" onSubmit={handleRegister}>
              <div>
                <label
                  htmlFor="fullName"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 transition-colors duration-200"
                >
                  Full Name
                </label>
                <input
                  type="text"
                  id="fullName"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-4 py-2 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 transition-all duration-200"
                  placeholder="John Doe"
                  required
                />
              </div>

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
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
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
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-4 py-2 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 transition-all duration-200"
                  placeholder="••••••••"
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="confirmPassword"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 transition-colors duration-200"
                >
                  Confirm Password
                </label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-4 py-2 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 transition-all duration-200"
                  placeholder="••••••••"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center items-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
              >
                {loading ? (
                  <>
                    <Loader2 className="animate-spin -ml-1 mr-2 h-4 w-4" />
                    Creating account...
                  </>
                ) : (
                  "Create account"
                )}
              </button>
            </form>

            <div className="text-center">
              <p className="text-sm text-gray-600 dark:text-gray-400 transition-colors duration-200">
                Already have an account?{" "}
                <a
                  href="/login"
                  className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300 transition-colors duration-200"
                >
                  Sign in
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
  );
};

export default RegisterPage;
