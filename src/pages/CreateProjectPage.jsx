import { useState, useEffect } from "react";
import { useParams, useSearchParams, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import { Plus, Loader2, Info, Database, ArrowLeft } from "lucide-react";
import { useTheme } from "../context/ThemeContext";
import Navbar from "../components/Navbar";
import SchemaList from "../components/SchemaList";
import CreateSchemaModal from "../components/CreateSchemaModal";
import ApiInfoCard from "../components/ApiInfoCard";
import "react-toastify/dist/ReactToastify.css";

const SchemaPage = () => {
  const { projectId } = useParams();
  const [searchParams] = useSearchParams();
  const project_link = searchParams.get("project_link");
  const [schemas, setSchemas] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isInfoModalOpen, setIsInfoModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const { isDark } = useTheme();
  const navigate = useNavigate();
  const [gradientAngle, setGradientAngle] = useState(0);
  const [gradientColors, setGradientColors] = useState({
    color1: { r: 59, g: 130, b: 246 },
    color2: { r: 139, g: 92, b: 246 },
  });

  const handleAuthError = (message) => {
    if (
      message === "jwt expired" ||
      message === "jwt malformed" ||
      message === "invalid token"
    ) {
      localStorage.removeItem("user");
      localStorage.removeItem("accessToken");
      toast.error("Session expired. Please log in again.");
      setTimeout(() => {
        navigate("/login");
      }, 1500);
    }
  };

  const fetchSchemas = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/schema/${projectId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        }
      );
      const data = await response.json();

      if (!response.ok) {
        handleAuthError(data.message);
        throw new Error(data.message || "Failed to fetch schemas");
      }

      // Transform the data to match the expected schema structure
      const transformedSchemas = data.data
        .map((schema) => ({
          _id: schema._id,
          name: schema.schema_name,
          description: `${Object.keys(schema.data[0] || {}).length} fields`,
          endpoint: schema.schema_name.toLowerCase(),
          data: schema.data,
          createdAt: schema.createdAt,
        }))
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

      setSchemas(transformedSchemas);
    } catch (error) {
      console.error("Error fetching schemas:", error);
      toast.error("Failed to load schemas");

      if (!localStorage.getItem("accessToken")) {
        setTimeout(() => {
          navigate("/login");
        }, 1500);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Check for token before fetching
    const token = localStorage.getItem("accessToken");
    if (!token) {
      toast.error("Please log in to access this page");
      navigate("/login");
      return;
    }

    fetchSchemas();
  }, [projectId, navigate]);

  const handleSchemaCreated = (newSchema) => {
    // Add the new schema to the beginning of the list
    setSchemas((prevSchemas) => [newSchema, ...prevSchemas]);
  };

  const handleSchemaDeleted = (schemaId) => {
    setSchemas((prevSchemas) =>
      prevSchemas.filter((schema) => schema._id !== schemaId)
    );
  };

  const getColor1 = () => {
    const { r, g, b } = gradientColors.color1;
    return isDark
      ? `rgba(${r}, ${g}, ${b}, 0.15)`
      : `rgba(${r}, ${g}, ${b}, 0.25)`;
  };

  const getColor2 = () => {
    const { r, g, b } = gradientColors.color2;
    return isDark
      ? `rgba(${r}, ${g}, ${b}, 0.15)`
      : `rgba(${r}, ${g}, ${b}, 0.25)`;
  };

  return (
    <div
      className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-all duration-200 relative"
      style={{
        backgroundImage: `
          radial-gradient(circle at 2px 2px, ${getColor1()} 1px, transparent 0px)`,
        backgroundSize: "40px 40px",
        backgroundPosition: `${
          Math.sin((gradientAngle * Math.PI) / 180) * 20
        }px ${Math.cos((gradientAngle * Math.PI) / 180) * 20}px`,
      }}
    >
      {/* Gradient Light Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute -inset-[10%] opacity-50"
          style={{
            background: `
              radial-gradient(circle at 15% 50%, ${getColor1()} 0%, transparent 25%),
              radial-gradient(circle at 85% 30%, ${getColor2()} 0%, transparent 25%)`,
            transform: `rotate(${gradientAngle}deg)`,
          }}
        />
      </div>

      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-12">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-2">
            <button
              onClick={() => navigate("/dashboard")}
              className="p-2 rounded-lg text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-all duration-200"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                API Schemas
              </h1>
              <p className="mt-1 text-gray-600 dark:text-gray-400">
                Create and manage your API endpoints
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between mt-6">
            <div className="flex-1">
              <div className="inline-flex items-center px-3 py-1 rounded-lg bg-blue-100 dark:bg-blue-900/20">
                <Database className="h-4 w-4 text-blue-600 dark:text-blue-400 mr-2" />
                <code className="text-sm font-mono text-blue-600 dark:text-blue-400">
                  {project_link}
                </code>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsInfoModalOpen(true)}
                className="p-2 rounded-lg text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-all duration-200"
                title="API Information"
              >
                <Info className="h-5 w-5" />
              </button>
              <button
                onClick={() => setIsModalOpen(true)}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200"
              >
                <Plus className="h-5 w-5 mr-2" />
                New Schema
              </button>
            </div>
          </div>
        </div>

        {/* API Info Card */}
        <div className="mb-8">
          <ApiInfoCard project_link={project_link} />
        </div>

        {/* Schema List */}
        <div className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-xl shadow-sm border border-gray-200/50 dark:border-gray-700/50">
          <SchemaList
            schemas={schemas}
            loading={loading}
            project_link={project_link}
            onCreateSchema={() => setIsModalOpen(true)}
            onDeleteSchema={handleSchemaDeleted}
          />
        </div>

        {/* Create Schema Modal */}
        <CreateSchemaModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSchemaCreated={handleSchemaCreated}
          projectId={projectId}
        />

        <ToastContainer
          position="bottom-right"
          autoClose={3000}
          theme={isDark ? "dark" : "light"}
        />
      </main>
    </div>
  );
};

export default SchemaPage;
