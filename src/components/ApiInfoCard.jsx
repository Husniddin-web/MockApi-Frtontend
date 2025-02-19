import PropTypes from "prop-types";
import { toast } from "react-toastify";
import { Copy, ChevronRight, Globe } from "lucide-react";

const ApiInfoCard = ({ project_link }) => {
  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    toast.success("API URL copied to clipboard!");
  };

  const baseUrl = `${import.meta.env.VITE_API_URL}/mock/${project_link}`;

  const endpoints = [
    { method: "GET", path: "/", description: "Get all records" },
    { method: "GET", path: "/:id", description: "Get a single record" },
    { method: "POST", path: "/", description: "Create a new record" },
    { method: "PUT", path: "/:id", description: "Update a record" },
    { method: "DELETE", path: "/:id", description: "Delete a record" },
  ];

  const getMethodColor = (method) => {
    const colors = {
      GET: "text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20",
      POST: "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20",
      PUT: "text-yellow-600 dark:text-yellow-400 bg-yellow-50 dark:bg-yellow-900/20",
      DELETE: "text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20",
    };
    return colors[method] || "text-gray-600 bg-gray-50";
  };

  return (
    <div className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-xl shadow-sm border border-gray-200/50 dark:border-gray-700/50 overflow-hidden">
      {/* Base URL Section */}
      <div className="p-4 border-b border-gray-200/50 dark:border-gray-700/50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Globe className="h-5 w-5 text-gray-400" />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Base URL
            </span>
          </div>
          <button
            onClick={() => copyToClipboard(baseUrl)}
            className="p-1.5 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700/50 rounded-lg transition-all duration-200"
          >
            <Copy className="h-4 w-4" />
          </button>
        </div>
        <code className="mt-1 block text-sm font-mono text-gray-600 dark:text-gray-400">
          {baseUrl}
        </code>
      </div>

      {/* Endpoints Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-gray-200/50 dark:bg-gray-700/50">
        {endpoints.map((endpoint, index) => (
          <div
            key={index}
            className="p-3 bg-white/50 dark:bg-gray-800/50 hover:bg-gray-50/50 dark:hover:bg-gray-700/50 transition-all duration-200"
          >
            <div className="flex items-center gap-2">
              <span
                className={`px-2 py-0.5 rounded text-xs font-medium ${getMethodColor(
                  endpoint.method
                )}`}
              >
                {endpoint.method}
              </span>
              <code className="text-xs font-mono text-gray-600 dark:text-gray-400">
                {endpoint.path}
              </code>
            </div>
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              {endpoint.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

ApiInfoCard.propTypes = {
  project_link: PropTypes.string.isRequired,
};

export default ApiInfoCard;
