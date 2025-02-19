import PropTypes from "prop-types";
import { X } from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import Editor from "@monaco-editor/react";
import DraggableModal from "./DraggableModal";

const SchemaDataModal = ({ isOpen, onClose, schema }) => {
  const [data, setData] = useState("");
  const [isValid, setIsValid] = useState(true);
  const [fields, setFields] = useState({});
  const [count, setCount] = useState(5);

  useEffect(() => {
    // Extract fields from the first data item
    if (schema.data && schema.data[0]) {
      const extractedFields = {};
      Object.keys(schema.data[0]).forEach((key) => {
        if (key !== "id") {
          // Skip the id field as it's auto-generated
          extractedFields[key] = schema.data[0][key];
        }
      });
      setFields(extractedFields);
      setCount(schema.data.length);
    }
    // Format the initial data for display
    setData(JSON.stringify(schema.data, null, 2));
  }, [schema.data]);

  const handleDataChange = (value) => {
    setData(value);

    // Validate JSON as user types
    try {
      const parsedData = JSON.parse(value);
      if (Array.isArray(parsedData) && parsedData.length > 0) {
        // Extract fields from the first item of edited data
        const newFields = {};
        Object.keys(parsedData[0]).forEach((key) => {
          if (key !== "id") {
            newFields[key] = parsedData[0][key];
          }
        });
        setFields(newFields);
        setCount(parsedData.length);
      }
      setIsValid(true);
    } catch (error) {
      setIsValid(false);
    }
  };

  const handleUpdate = async () => {
    if (!isValid) {
      toast.error("Please enter valid JSON data");
      return;
    }

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/schema/${schema._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
          body: JSON.stringify({
            schema_name: schema.name,
            fields: fields,
            count: count,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update schema data");
      }

      toast.success("Schema data updated successfully");
      onClose();
      window.location.reload();
    } catch (error) {
      console.error("Error updating schema data:", error);
      toast.error(error.message || "Failed to update schema data");
    }
  };

  if (!isOpen) return null;

  return (
    <DraggableModal
      isOpen={isOpen}
      onClose={onClose}
      title={`Schema Data · ${schema.name}`}
      initialPosition={{
        x: Math.random() * 100 + 50,
        y: Math.random() * 100 + 50,
      }}
      zIndex={Math.floor(Math.random() * 100) + 9900}
    >
      <div className="flex flex-col h-full p-4">
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
          Edit or replace data for {schema.name.toLowerCase()} resource
        </p>

        {/* Editor */}
        <div className="flex-1 relative rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700">
          <Editor
            height="100%"
            defaultLanguage="json"
            value={data}
            onChange={handleDataChange}
            theme={
              document.documentElement.classList.contains("dark")
                ? "vs-dark"
                : "light"
            }
            options={{
              minimap: { enabled: false },
              fontSize: 14,
              lineNumbers: "on",
              roundedSelection: true,
              scrollBeyondLastLine: false,
              automaticLayout: true,
              formatOnPaste: true,
              formatOnType: true,
              tabSize: 2,
              wordWrap: "on",
              wrappingIndent: "indent",
              renderValidationDecorations: "on",
            }}
          />
          {!isValid && (
            <div className="absolute bottom-4 right-4 text-sm text-red-500 dark:text-red-400 bg-white/90 dark:bg-gray-800/90 px-3 py-1.5 rounded-lg shadow-sm">
              Invalid JSON format
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700/50 rounded-lg transition-all duration-200"
          >
            Cancel
          </button>
          <button
            onClick={handleUpdate}
            disabled
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
          >
            Update Data
          </button>
        </div>
      </div>
    </DraggableModal>
  );
};

SchemaDataModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  schema: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    data: PropTypes.array.isRequired,
  }).isRequired,
};

export default SchemaDataModal;
