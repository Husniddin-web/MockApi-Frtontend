import { useState } from "react";
import PropTypes from "prop-types";
import { Trash2, Loader2, Plus, Database, Copy } from "lucide-react";
import { toast } from "react-toastify";
import SchemaDataModal from "./SchemaDataModal";
import AlertDialog from "./AlertDialog";

const SchemaList = ({
  schemas = [],
  loading = false,
  project_link,
  onCreateSchema,
  onDeleteSchema,
}) => {
  const [deleteLoading, setDeleteLoading] = useState(null);
  const [selectedSchema, setSelectedSchema] = useState(null);
  const [isDataModalOpen, setIsDataModalOpen] = useState(false);
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [schemaToDelete, setSchemaToDelete] = useState(null);

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    toast.success("API URL copied to clipboard!");
  };

  const getEndpointUrl = (endpoint) => {
    return `${import.meta.env.VITE_API_URL}/mock/${project_link}/${endpoint}`;
  };

  const handleDeleteClick = (schema) => {
    setSchemaToDelete(schema);
    setIsAlertOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!schemaToDelete) return;

    setDeleteLoading(schemaToDelete._id);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/schema/${schemaToDelete._id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete schema");
      }

      toast.success("Schema deleted successfully");
      onDeleteSchema(schemaToDelete._id);
    } catch (error) {
      console.error("Error deleting schema:", error);
      toast.error("Failed to delete schema");
    } finally {
      setDeleteLoading(null);
      setSchemaToDelete(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500 dark:text-blue-400" />
      </div>
    );
  }

  if (!schemas.length) {
    return (
      <div className="p-12 text-center">
        <div className="mx-auto h-12 w-12 rounded-lg bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center mb-4">
          <Plus className="h-6 w-6 text-blue-600 dark:text-blue-400" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
          No Schemas Yet
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-6 max-w-sm mx-auto">
          Create your first schema to start generating mock data for your API
          endpoints.
        </p>
        <button
          onClick={onCreateSchema}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200"
        >
          <Plus className="h-5 w-5 mr-2" />
          Create Schema
        </button>
      </div>
    );
  }

  return (
    <>
      <div className="divide-y divide-gray-200/50 dark:divide-gray-700/50">
        {schemas.map((schema) => (
          <div
            key={schema._id}
            className="hover:bg-gray-50/50 dark:hover:bg-gray-700/50 transition-all duration-200"
          >
            <div className="px-6 py-4 flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-4">
                  <div className="h-10 w-10 rounded-lg bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center">
                    <Database className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <h4 className="text-lg font-medium text-gray-900 dark:text-white">
                      {schema?.name || "Untitled Schema"}
                    </h4>
                    <div className="mt-1 flex items-center gap-2">
                      <code className="text-xs font-mono bg-gray-100 dark:bg-gray-700/50 px-2 py-1 rounded text-gray-600 dark:text-gray-400">
                        {getEndpointUrl(schema?.endpoint || "")}
                      </code>
                      <button
                        onClick={() =>
                          copyToClipboard(
                            getEndpointUrl(schema?.endpoint || "")
                          )
                        }
                        className="p-1 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700/50 rounded transition-all duration-200"
                      >
                        <Copy className="h-4 w-4" />
                      </button>
                    </div>
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                      {schema?.description || "No description"}
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    setSelectedSchema(schema);
                    setIsDataModalOpen(true);
                  }}
                  className="px-4 py-2 text-sm font-medium text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-all duration-200 flex items-center gap-2"
                >
                  <Database className="h-4 w-4" />
                  Data
                </button>
                <button
                  onClick={() => handleDeleteClick(schema)}
                  disabled={deleteLoading === schema._id}
                  className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {deleteLoading === schema._id ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    <Trash2 className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Schema Data Modal */}
      {selectedSchema && (
        <SchemaDataModal
          isOpen={isDataModalOpen}
          onClose={() => {
            setIsDataModalOpen(false);
            setSelectedSchema(null);
          }}
          schema={selectedSchema}
        />
      )}

      <AlertDialog
        isOpen={isAlertOpen}
        onClose={() => setIsAlertOpen(false)}
        onConfirm={handleDeleteConfirm}
        title="Delete Schema"
        message={`Are you sure you want to delete "${schemaToDelete?.name}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        type="danger"
      />
    </>
  );
};

SchemaList.propTypes = {
  schemas: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      description: PropTypes.string,
      endpoint: PropTypes.string.isRequired,
      data: PropTypes.array,
    })
  ),
  loading: PropTypes.bool,
  project_link: PropTypes.string.isRequired,
  onCreateSchema: PropTypes.func.isRequired,
  onDeleteSchema: PropTypes.func.isRequired,
};

export default SchemaList;
