import { X } from "lucide-react";
import PropTypes from "prop-types";
import { createPortal } from "react-dom";

const AlertDialog = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  type = "warning", // warning, danger, info
}) => {
  if (!isOpen) return null;

  const mainElement = document.querySelector("main");
  if (!mainElement) return null;

  const getTypeStyles = () => {
    switch (type) {
      case "danger":
        return {
          button: "bg-red-600 hover:bg-red-700 focus:ring-red-500",
          icon: "text-red-600 dark:text-red-400",
          border: "border-red-200 dark:border-red-800/50",
        };
      case "warning":
        return {
          button: "bg-yellow-600 hover:bg-yellow-700 focus:ring-yellow-500",
          icon: "text-yellow-600 dark:text-yellow-400",
          border: "border-yellow-200 dark:border-yellow-800/50",
        };
      default:
        return {
          button: "bg-blue-600 hover:bg-blue-700 focus:ring-blue-500",
          icon: "text-blue-600 dark:text-blue-400",
          border: "border-blue-200 dark:border-blue-800/50",
        };
    }
  };

  const styles = getTypeStyles();

  return createPortal(
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
        {/* Backdrop */}
        <div
          className="fixed inset-0 bg-black/30 dark:bg-black/50 backdrop-blur-sm transition-opacity"
          onClick={onClose}
        />

        {/* Modal */}
        <div className="relative transform overflow-hidden rounded-lg bg-white dark:bg-gray-800 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg border border-gray-200/50 dark:border-gray-700/50">
          <div className="px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
            <div className="sm:flex sm:items-start">
              <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                <h3 className="text-lg font-semibold leading-6 text-gray-900 dark:text-white">
                  {title}
                </h3>
                <div className="mt-2">
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {message}
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 dark:bg-gray-700/30 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
            <button
              type="button"
              onClick={() => {
                onConfirm();
                onClose();
              }}
              className={`inline-flex w-full justify-center rounded-lg px-3 py-2 text-sm font-semibold text-white shadow-sm sm:ml-3 sm:w-auto ${styles.button} focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all duration-200`}
            >
              {confirmText}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="mt-3 inline-flex w-full justify-center rounded-lg bg-white dark:bg-gray-800 px-3 py-2 text-sm font-semibold text-gray-900 dark:text-gray-300 shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 sm:mt-0 sm:w-auto transition-all duration-200"
            >
              {cancelText}
            </button>
          </div>
        </div>
      </div>
    </div>,
    mainElement
  );
};

AlertDialog.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  message: PropTypes.string.isRequired,
  confirmText: PropTypes.string,
  cancelText: PropTypes.string,
  type: PropTypes.oneOf(["warning", "danger", "info"]),
};

export default AlertDialog; 