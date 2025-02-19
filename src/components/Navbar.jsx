import React, { useState, useEffect } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import {
  Sun,
  Moon,
  LogOut,
  User,
  Settings,
  Search,
  Menu,
  X,
} from "lucide-react";
import PropTypes from "prop-types";
import AuthService from "../services/authService";

const Navbar = ({ isLanding }) => {
  const { isDark, toggleTheme } = useTheme();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const initials =
    user.name
      ?.split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase() || "U";

  // Check if we're on auth pages
  const isAuthPage =
    location.pathname === "/login" || location.pathname === "/register";

  // Check if we're on the dashboard
  const isDashboard =
    location.pathname === "/dashboard" ||
    location.pathname.includes("/projects/");

  // Add scroll event listener
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setIsScrolled(scrollPosition > 10); // Change background after 10px of scroll
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = () => {
    AuthService.logout();
    setIsProfileOpen(false); // Close profile dropdown
    navigate("/login");
  };

  // Updated menu items - removed Dashboard, Profile, and Settings
  const menuItems = [
    { label: "Features", path: "#features" },
    { label: "Demo", path: "#demo" },
  ];

  const showLandingNav = isLanding || isAuthPage; // New condition to show landing nav

  return (
    <nav className="fixed w-full top-0 z-50 transition-all duration-200">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="relative mt-3">
          {/* Glassmorphism container */}
          <div
            className={`absolute inset-0 rounded-[15px] ${
              isMobileMenuOpen ? "!rounded-b-[15px]" : ""
            } transition-all duration-300
              ${
                isScrolled || isMobileMenuOpen
                  ? "bg-white/50 dark:bg-black/50 shadow-glass backdrop-blur-xs"
                  : "bg-white/0 dark:bg-black/0"
              }`}
          />

          <div className="relative flex h-16 items-center justify-between px-5">
            {/* Left section - Logo */}
            <Link
              to={isDashboard ? "/dashboard" : "/"}
              className="flex-shrink-0 flex items-center group"
            >
              <div className="relative">
                <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-blue-600 to-blue-400 opacity-0 group-hover:opacity-100 blur transition-all duration-200" />
                <svg
                  className="relative h-10 w-10 transition-transform duration-200 group-hover:scale-105"
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
              </div>
              <div className="ml-3 flex flex-col">
                <span className="text-xl font-bold text-gray-900 dark:text-white transition-colors duration-200">
                  MockAPI
                </span>
                <span className="text-sm text-gray-600 dark:text-gray-400 transition-colors duration-200">
                  {isLanding ? "Mock API Platform" : "Dashboard"}
                </span>
              </div>
            </Link>

            {/* Right section - Navigation */}
            {showLandingNav ? (
              <div className="hidden md:flex items-center space-x-6">
                {isLanding && (
                  <>
                    <a
                      href="#features"
                      className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
                    >
                      Features
                    </a>
                    <a
                      href="#demo"
                      className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
                    >
                      Demo
                    </a>
                  </>
                )}
                <button
                  onClick={toggleTheme}
                  className="p-2 rounded-lg text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200"
                  aria-label="Toggle theme"
                >
                  {isDark ? (
                    <Sun className="h-5 w-5" />
                  ) : (
                    <Moon className="h-5 w-5" />
                  )}
                </button>
                {!isAuthPage && (
                  <>
                    <button
                      onClick={() => navigate("/login")}
                      className="px-4 py-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
                    >
                      Sign in
                    </button>
                    <button
                      onClick={() => navigate("/register")}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Get Started
                    </button>
                  </>
                )}
              </div>
            ) : (
              /* Original dashboard navigation items */
              <div className="flex items-center gap-4">
                {/* Theme Toggle */}
                <button
                  onClick={toggleTheme}
                  className="p-2 rounded-lg text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200"
                  aria-label="Toggle theme"
                >
                  {isDark ? (
                    <Sun className="h-5 w-5" />
                  ) : (
                    <Moon className="h-5 w-5" />
                  )}
                </button>

                {/* Only show profile section if not on auth pages */}
                {!isAuthPage && (
                  <>
                    {user?.email ? (
                      // Profile button for logged-in users
                      <div className="relative">
                        <button
                          onClick={() => setIsProfileOpen(!isProfileOpen)}
                          className="group p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200"
                        >
                          <div className="relative">
                            <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-blue-600 to-blue-400 opacity-0 group-hover:opacity-100 blur transition-all duration-200" />
                            <div className="relative h-8 w-8 rounded-full bg-gradient-to-r from-blue-600 to-blue-400 flex items-center justify-center ring-2 ring-gray-200 dark:ring-gray-800 transition-all duration-200">
                              <span className="text-white font-semibold text-sm drop-shadow-sm">
                                {initials}
                              </span>
                            </div>
                          </div>
                        </button>

                        {isProfileOpen && (
                          <>
                            <div className="absolute right-0 mt-2 w-56 rounded-xl shadow-lg transition-all duration-200 overflow-hidden">
                              {/* Glassmorphism background */}
                              <div className="absolute inset-0 bg-white/50 dark:bg-black/50 backdrop-blur-xs transition-all duration-200" />

                              {/* Content */}
                              <div className="relative">
                                <div className="px-4 py-2 border-b border-gray-200/50 dark:border-gray-700/50">
                                  <p className="text-sm font-medium text-gray-900 dark:text-white transition-colors duration-200">
                                    {user.name}
                                  </p>
                                  <p className="text-xs text-gray-500 dark:text-gray-400 truncate transition-colors duration-200">
                                    {user.email}
                                  </p>
                                </div>
                                <div className="py-1">
                                  <button
                                    onClick={() => navigate("/profile")}
                                    className="w-full px-4 py-2 text-sm text-left text-gray-700 dark:text-gray-300 
                                      hover:bg-gray-100 dark:hover:bg-gray-700/50 
                                      hover:text-blue-600 dark:hover:text-blue-400
                                      flex items-center gap-2 transition-all duration-200 cursor-pointer"
                                  >
                                    <User className="h-4 w-4" />
                                    Profile
                                  </button>
                                  <button
                                    onClick={() => navigate("/settings")}
                                    className="w-full px-4 py-2 text-sm text-left text-gray-700 dark:text-gray-300 
                                      hover:bg-gray-100 dark:hover:bg-gray-700/50 
                                      hover:text-blue-600 dark:hover:text-blue-400
                                      flex items-center gap-2 transition-all duration-200 cursor-pointer"
                                  >
                                    <Settings className="h-4 w-4" />
                                    Settings
                                  </button>
                                  <button
                                    onClick={handleLogout}
                                    className="w-full px-4 py-2 text-sm text-left text-red-600 dark:text-red-400 
                                      hover:bg-red-50 dark:hover:bg-red-900/20 
                                      hover:text-red-700 dark:hover:text-red-300
                                      flex items-center gap-2 transition-all duration-200 cursor-pointer"
                                  >
                                    <LogOut className="h-4 w-4" />
                                    Sign out
                                  </button>
                                </div>
                              </div>
                            </div>
                          </>
                        )}
                      </div>
                    ) : (
                      // Auth buttons for non-logged-in users
                      <div className="flex items-center gap-4">
                        <Link
                          to="/login"
                          className="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors duration-200"
                        >
                          Sign in
                        </Link>
                        <Link
                          to="/register"
                          className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors duration-200"
                        >
                          Sign up
                        </Link>
                      </div>
                    )}
                  </>
                )}
              </div>
            )}

            {/* Mobile Controls */}
            <div className="md:hidden flex items-center gap-2">
              {/* Theme toggle button */}
              <button
                onClick={toggleTheme}
                className="relative z-50 p-2 text-gray-500 dark:text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-all duration-200"
              >
                {isDark ? (
                  <Sun className="h-5 w-5" />
                ) : (
                  <Moon className="h-5 w-5" />
                )}
              </button>

              {/* Menu button */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="relative z-50 p-2 text-gray-500 dark:text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-all duration-200"
              >
                {isMobileMenuOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </button>
            </div>
          </div>

          {/* Mobile menu */}
          {isMobileMenuOpen && (
            <div className="relative md:hidden border-t border-gray-200/50 dark:border-gray-700/50 z-40 pb-4 rounded-b-[15px]">
              <div className="px-5 py-4 space-y-4">
                {/* Menu items */}
                {showLandingNav && isLanding && (
                  <div className="space-y-2">
                    {menuItems.map((item) => {
                      // Use anchor tag for hash links, Link for routes
                      const Component = item.path.startsWith("#") ? "a" : Link;

                      return (
                        <Component
                          key={item.path}
                          to={
                            !item.path.startsWith("#") ? item.path : undefined
                          }
                          href={
                            item.path.startsWith("#") ? item.path : undefined
                          }
                          onClick={() => {
                            setIsMobileMenuOpen(false);
                            if (item.path.startsWith("#")) {
                              document
                                .querySelector(item.path)
                                ?.scrollIntoView({ behavior: "smooth" });
                            }
                          }}
                          className="relative z-50 block px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700/50 rounded-lg transition-all duration-200"
                        >
                          {item.label}
                        </Component>
                      );
                    })}
                  </div>
                )}

                {/* Auth buttons */}
                {!user?.email && !isAuthPage && (
                  <div className="border-t border-gray-200/50 dark:border-gray-700/50 pt-4 space-y-2">
                    <Link
                      to="/login"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="relative z-50 block w-full px-4 py-2 text-center text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700/50 rounded-lg transition-all duration-200"
                    >
                      Sign in
                    </Link>
                    <Link
                      to="/register"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="relative z-50 block w-full px-4 py-2 text-center bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-200"
                    >
                      Sign up
                    </Link>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

Navbar.propTypes = {
  isLanding: PropTypes.bool,
};

export default Navbar;
