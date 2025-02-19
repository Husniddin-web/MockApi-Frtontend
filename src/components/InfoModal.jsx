import PropTypes from "prop-types";
import { X } from "lucide-react";

const InfoModal = ({ isOpen, onClose, project_link }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
        {/* Backdrop */}
        <div
          className="fixed inset-0 bg-black/30 dark:bg-black/50 backdrop-blur-sm transition-opacity"
          onClick={onClose}
        />

        {/* Modal */}
        <div className="relative transform overflow-hidden rounded-lg bg-white dark:bg-gray-800 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
          <div className="absolute right-0 top-0 pr-4 pt-4">
            <button
              onClick={onClose}
              className="rounded-lg p-2 text-gray-400 hover:text-gray-500 dark:text-gray-500 dark:hover:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-all duration-200"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="px-6 pt-6 pb-8">
            <div className="text-center sm:text-left">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 transition-colors duration-200">
                API Documentation
              </h3>

              <div className="space-y-4 text-sm text-gray-600 dark:text-gray-400 transition-colors duration-200">
                <p>Your mock API is now live at the following base URL:</p>
                <code className="block p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg font-mono text-sm transition-all duration-200">
                  ${import.meta.env.VITE_API_URL}/mock/{project_link}
                </code>

                <div>
                  <p className="font-medium text-gray-900 dark:text-white mb-2 transition-colors duration-200">
                    Available Methods:
                  </p>
                  <ul className="list-disc list-inside space-y-2 ml-2">
                    <li>GET / - Retrieve all records</li>
                    <li>GET /:id - Retrieve a specific record</li>
                    <li>POST / - Create a new record</li>
                    <li>PUT /:id - Update a record</li>
                    <li>DELETE /:id - Delete a record</li>
                  </ul>
                </div>

                <div>
                  <p className="font-medium text-gray-900 dark:text-white mb-2 transition-colors duration-200">
                    Response Format:
                  </p>
                  <p>
                    All responses will be in JSON format and will include the
                    appropriate HTTP status codes.
                  </p>
                </div>

                <div>
                  <p className="font-medium text-gray-900 dark:text-white mb-2 transition-colors duration-200">
                    Authentication:
                  </p>
                  <p>
                    No authentication is required to access these endpoints.
                    They are publicly available for testing purposes.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

InfoModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  project_link: PropTypes.string.isRequired,
};

export default InfoModal;
