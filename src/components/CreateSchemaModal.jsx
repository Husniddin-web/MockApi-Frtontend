import { useState } from "react";
import PropTypes from "prop-types";
import { toast } from "react-toastify";
import { fakerCategories } from "../utils/fakerCategories";
import { X, Plus, Trash2 } from "lucide-react";

const CreateSchemaModal = ({ isOpen, onClose, onSchemaCreated, projectId }) => {
  const [newSchema, setNewSchema] = useState({
    schema_name: "",
    project_id: projectId,
    fields: {
      name: "name.firstName",
      surname: "name.lastName",
      email: "internet.email",
    },
    count: 5,
  });

  // Keep track of fields with unique IDs
  const [fields, setFields] = useState([
    { id: crypto.randomUUID(), name: "name", value: "name.firstName" },
    { id: crypto.randomUUID(), name: "surname", value: "name.lastName" },
    { id: crypto.randomUUID(), name: "email", value: "internet.email" },
  ]);

  const handleAddField = () => {
    const fieldId = crypto.randomUUID();
    const fieldName = `field${fields.length + 1}`;

    setFields((prev) => [...prev, { id: fieldId, name: fieldName, value: "" }]);
    setNewSchema((prev) => ({
      ...prev,
      fields: {
        ...prev.fields,
        [fieldName]: "",
      },
    }));
  };

  const handleRemoveField = (fieldId) => {
    const fieldToRemove = fields.find((f) => f.id === fieldId);
    if (!fieldToRemove) return;

    setFields((prev) => prev.filter((f) => f.id !== fieldId));
    const { [fieldToRemove.name]: removed, ...remainingFields } =
      newSchema.fields;
    setNewSchema((prev) => ({
      ...prev,
      fields: remainingFields,
    }));
  };

  const handleFieldNameChange = (fieldId, newName) => {
    const field = fields.find((f) => f.id === fieldId);
    if (!field) return;

    // Check for duplicate names
    if (fields.some((f) => f.id !== fieldId && f.name === newName)) {
      return;
    }

    const oldName = field.name;
    const fieldValue = newSchema.fields[oldName];

    setFields((prev) =>
      prev.map((f) => (f.id === fieldId ? { ...f, name: newName } : f))
    );

    setNewSchema((prev) => {
      const { [oldName]: value, ...rest } = prev.fields;
      return {
        ...prev,
        fields: {
          ...rest,
          [newName]: fieldValue,
        },
      };
    });
  };

  const handleFieldValueChange = (fieldId, newValue) => {
    const field = fields.find((f) => f.id === fieldId);
    if (!field) return;

    setNewSchema((prev) => ({
      ...prev,
      fields: {
        ...prev.fields,
        [field.name]: newValue,
      },
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/schema`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
        body: JSON.stringify(newSchema),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to create schema");
      }

      toast.success("Schema created successfully");
      
      // Transform the new schema to match the expected format
      const transformedSchema = {
        _id: data.newSchema._id,
        name: data.newSchema.schema_name,
        description: `${Object.keys(newSchema.fields || {}).length} fields`,
        endpoint: data.newSchema.schema_name.toLowerCase(),
        data: data.newSchema.data || [],
        createdAt: data.newSchema.createdAt,
      };

      // Call onSchemaCreated with the transformed schema
      onSchemaCreated(transformedSchema);
      onClose();
    } catch (error) {
      console.error("Error creating schema:", error);
      toast.error(error.message || "Failed to create schema");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-full items-center justify-center p-4">
        {/* Backdrop */}
        <div
          className="fixed inset-0 bg-black/30 dark:bg-black/50 backdrop-blur-sm transition-opacity"
          onClick={onClose}
        />

        {/* Modal */}
        <div className="relative w-full max-w-2xl bg-white dark:bg-gray-800 rounded-xl shadow-xl transition-all">
          <div className="p-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Create New Schema
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Define your schema structure and generate mock data.
                </p>
              </div>
              <button
                onClick={onClose}
                className="p-2 text-gray-400 hover:text-gray-500 dark:hover:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-all duration-200"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                {/* Schema Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Schema Name
                  </label>
                  <input
                    type="text"
                    value={newSchema.schema_name}
                    onChange={(e) =>
                      setNewSchema((prev) => ({
                        ...prev,
                        schema_name: e.target.value,
                      }))
                    }
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg 
                      bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100
                      focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400
                      transition-colors duration-200"
                    placeholder="Enter schema name"
                    required
                  />
                </div>

                {/* Count */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Number of Records
                  </label>
                  <input
                    type="number"
                    value={newSchema.count}
                    onChange={(e) =>
                      setNewSchema((prev) => ({
                        ...prev,
                        count: parseInt(e.target.value),
                      }))
                    }
                    min="1"
                    max="100"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg 
                      bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100
                      focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400
                      transition-colors duration-200"
                  />
                </div>

                {/* Fields */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Fields
                  </label>
                  <div className="space-y-3">
                    {/* ID Field (disabled) */}
                    <div className="flex gap-3 opacity-75">
                      <input
                        type="text"
                        value="id"
                        disabled
                        className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg 
                          bg-gray-50 dark:bg-gray-700/50 text-gray-500 dark:text-gray-400
                          cursor-not-allowed"
                        placeholder="Field name"
                      />
                      <select
                        value="string.uuid"
                        disabled
                        className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg 
                          bg-gray-50 dark:bg-gray-700/50 text-gray-500 dark:text-gray-400
                          cursor-not-allowed"
                      >
                        <option>UUID (Auto-generated)</option>
                      </select>
                      <div className="w-9"></div> {/* Spacer for alignment */}
                    </div>

                    {/* Dynamic Fields */}
                    {fields.map((field) => (
                      <div key={field.id} className="flex gap-3">
                        <input
                          type="text"
                          value={field.name}
                          onChange={(e) =>
                            handleFieldNameChange(field.id, e.target.value)
                          }
                          className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg 
                            bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100
                            focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400
                            transition-colors duration-200"
                          placeholder="Field name"
                        />
                        <select
                          value={newSchema.fields[field.name]}
                          onChange={(e) =>
                            handleFieldValueChange(field.id, e.target.value)
                          }
                          className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg 
                            bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100
                            focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400
                            transition-colors duration-200"
                        >
                          <option value="">Select type</option>
                          {Object.entries(fakerCategories).map(
                            ([category, methods]) => (
                              <optgroup
                                key={category}
                                label={
                                  category.charAt(0).toUpperCase() +
                                  category.slice(1)
                                }
                              >
                                {methods.map((method) => (
                                  <option
                                    key={`${category}.${method}`}
                                    value={`${category}.${method}`}
                                  >
                                    {method}
                                  </option>
                                ))}
                              </optgroup>
                            )
                          )}
                        </select>
                        <button
                          type="button"
                          onClick={() => handleRemoveField(field.id)}
                          className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 
                            rounded-lg transition-all duration-200"
                        >
                          <Trash2 className="h-5 w-5" />
                        </button>
                      </div>
                    ))}
                  </div>
                  <button
                    type="button"
                    onClick={handleAddField}
                    className="mt-3 inline-flex items-center px-4 py-2 text-sm font-medium text-blue-600 dark:text-blue-400 
                      hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-all duration-200"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Field
                  </button>
                </div>
              </div>

              {/* Footer */}
              <div className="mt-6 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700/50 
                    rounded-lg transition-all duration-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 
                    disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                >
                  Create Schema
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

CreateSchemaModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSchemaCreated: PropTypes.func.isRequired,
  projectId: PropTypes.string.isRequired,
};

export default CreateSchemaModal;
