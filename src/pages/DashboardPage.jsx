import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import {
  Plus,
  Loader2,
  FolderOpen,
  X,
  LayoutGrid,
  List,
  Search,
  Filter,
  SortAsc,
  Clock,
} from "lucide-react";
import Navbar from "../components/Navbar";
import { useTheme } from "../context/ThemeContext";

const ProjectsDashboard = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteLoading, setDeleteLoading] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [createLoading, setCreateLoading] = useState(false);
  const [viewMode, setViewMode] = useState("grid"); // 'grid' or 'list'
  const [searchQuery, setSearchQuery] = useState("");
  const [newProject, setNewProject] = useState({
    project_name: "",
    description: "",
  });
  const navigate = useNavigate();
  const { isDark } = useTheme();
  const [gradientAngle, setGradientAngle] = useState(0);
  const [gradientColors, setGradientColors] = useState({
    color1: { r: 59, g: 130, b: 246 }, // blue-500
    color2: { r: 139, g: 92, b: 246 }, // purple-500
  });

  useEffect(() => {
    fetchProjects();
  }, []);

  useEffect(() => {
    let animationFrame;
    const animate = () => {
      setGradientAngle((prev) => (prev + 0.1) % 360);

      // Smoothly transition colors
      setGradientColors((prev) => ({
        color1: {
          r: prev.color1.r + (Math.random() - 0.5) * 0.5,
          g: prev.color1.g + (Math.random() - 0.5) * 0.5,
          b: prev.color1.b + (Math.random() - 0.5) * 0.5,
        },
        color2: {
          r: prev.color2.r + (Math.random() - 0.5) * 0.5,
          g: prev.color2.g + (Math.random() - 0.5) * 0.5,
          b: prev.color2.b + (Math.random() - 0.5) * 0.5,
        },
      }));

      animationFrame = requestAnimationFrame(animate);
    };

    animate();
    return () => cancelAnimationFrame(animationFrame);
  }, []);

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

  const handleAuthError = (message) => {
    if (message === "jwt expired") {
      localStorage.removeItem("user");
      localStorage.removeItem("accessToken");
      toast.error("Session expired. Please log in again.");
      setTimeout(() => {
        navigate("/login");
      }, 100);
    }
  };

  const getInitials = (name) => {
    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const fetchProjects = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/project/user/${user?._id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        }
      );
      const data = await response.json();

      if (!response.ok) {
        handleAuthError(data.message);
        toast.error(data.message);
      } else {
        setProjects(data.projects);
      }
    } catch (error) {
      console.error("Error fetching projects:", error.message);
      toast.error("An error occurred while fetching projects");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateProject = async (e) => {
    e.preventDefault();
    if (!newProject.project_name.trim()) {
      toast.error("Project name is required");
      return;
    }

    setCreateLoading(true);
    try {
      const user = JSON.parse(localStorage.getItem("user"));

      if (!user) {
        navigate("/login");
        return;
      }

      const response = await fetch(`${import.meta.env.VITE_API_URL}/project`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
        body: JSON.stringify({
          ...newProject,
          user_id: user._id,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        handleAuthError(data.message);
        toast.error(data.message || "Failed to create project");
      } else {
        setProjects([...projects, data.project]);
        setNewProject({ project_name: "", description: "" });
        setIsModalOpen(false);
        toast.success("Project created successfully!");
      }
    } catch (error) {
      console.error("Error creating project:", error);
      toast.error("An error occurred while creating the project");
    } finally {
      setCreateLoading(false);
    }
  };

  const handleDeleteProject = async (projectId) => {
    try {
      setDeleteLoading(projectId);
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/project/${projectId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        }
      );
      const data = await response.json();

      if (!response.ok) {
        console.log(data);
        handleAuthError(data.message);
        toast.error(data.message || "Failed to delete project");
      } else {
        setProjects(projects.filter((project) => project._id !== projectId));
        toast.success("Project deleted successfully");
      }
    } catch (error) {
      console.error("Error deleting project:", error);
      toast.error("An error occurred while deleting project");
    } finally {
      setDeleteLoading(null);
    }
  };

  useEffect(() => {
    const handleEsc = (event) => {
      if (event.keyCode === 27) setIsModalOpen(false);
    };
    window.addEventListener("keydown", handleEsc);

    return () => {
      window.removeEventListener("keydown", handleEsc);
    };
  }, []);

  useEffect(() => {
    if (isModalOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isModalOpen]);

  const filteredProjects = projects.filter(
    (project) =>
      project.project_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

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

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-12">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Projects
              </h1>
              <p className="mt-2 text-gray-600 dark:text-gray-400">
                Manage and organize your API projects
              </p>
            </div>
            <button
              onClick={() => setIsModalOpen(true)}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200"
            >
              <Plus className="h-5 w-5 mr-2" />
              New Project
            </button>
          </div>

          {/* Toolbar */}
          <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center justify-between">
            {/* Search Bar */}
            <div className="relative flex-1 max-w-md">
              <input
                type="text"
                placeholder="Search projects..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 transition-all duration-200"
              />
            </div>

            {/* Controls */}
            <div className="flex items-center gap-2">
              <button className="p-2 rounded-lg text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-all duration-200">
                <Filter className="h-5 w-5" />
              </button>
              <button className="p-2 rounded-lg text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-all duration-200">
                <SortAsc className="h-5 w-5" />
              </button>
              <div className="h-6 w-px bg-gray-200 dark:bg-gray-700" />
              <button
                onClick={() => setViewMode("grid")}
                className={`p-2 rounded-lg transition-all duration-200 ${
                  viewMode === "grid"
                    ? "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20"
                    : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700/50"
                }`}
              >
                <LayoutGrid className="h-5 w-5" />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-2 rounded-lg transition-all duration-200 ${
                  viewMode === "list"
                    ? "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20"
                    : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700/50"
                }`}
              >
                <List className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Projects Grid/List */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-12">
            <Loader2 className="h-8 w-8 text-blue-500 animate-spin mb-4" />
            <p className="text-gray-600 dark:text-gray-400">
              Loading your projects...
            </p>
          </div>
        ) : filteredProjects.length === 0 ? (
          <div className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-xl shadow-sm border border-gray-200/50 dark:border-gray-700/50 p-12 text-center">
            <FolderOpen className="h-16 w-16 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              {searchQuery ? "No matching projects" : "No Projects Yet"}
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md mx-auto">
              {searchQuery
                ? "Try adjusting your search terms or clear the search"
                : "Start your journey by creating your first project. Track your progress, set milestones, and achieve your goals."}
            </p>
            {!searchQuery && (
              <button
                onClick={() => setIsModalOpen(true)}
                className="inline-flex items-center px-6 py-3 border border-transparent rounded-xl shadow-sm text-base font-medium text-white bg-blue-600 hover:bg-blue-700 transition-all duration-200 focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <Plus className="h-5 w-5 mr-2" />
                Create Your First Project
              </button>
            )}
          </div>
        ) : (
          <div
            className={
              viewMode === "grid"
                ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                : "space-y-4"
            }
          >
            {filteredProjects.map((project) => (
              <div
                key={project._id}
                className="group relative bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-xl shadow-sm border border-gray-200/50 dark:border-gray-700/50 hover:shadow-md transition-all duration-200"
              >
                <div className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="h-10 w-10 rounded-lg bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center">
                        <FolderOpen className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div>
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-200">
                          {project.project_name}
                        </h3>
                        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                          {project.description || "No description provided"}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleDeleteProject(project._id)}
                      disabled={deleteLoading === project._id}
                      className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-200"
                    >
                      {deleteLoading === project._id ? (
                        <Loader2 className="h-5 w-5 animate-spin" />
                      ) : (
                        <X className="h-5 w-5" />
                      )}
                    </button>
                  </div>

                  <div className="mt-4">
                    <code className="text-xs font-mono bg-gray-100 dark:bg-gray-700/50 px-2 py-1 rounded-md text-gray-600 dark:text-gray-400">
                      {project.project_link}
                    </code>
                  </div>

                  <div className="mt-4 flex items-center justify-between">
                    <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                      <Clock className="h-4 w-4 mr-1" />
                      <span>Updated 2 days ago</span>
                    </div>
                    <button
                      onClick={() =>
                        navigate(
                          `/projects/${project._id}/schema?project_link=${project.project_link}`
                        )
                      }
                      className="px-4 py-2 text-sm font-medium text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-all duration-200"
                    >
                      Open Project
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Create Project Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="fixed inset-0 bg-black/30 dark:bg-black/50 backdrop-blur-sm transition-opacity" />
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <div className="relative transform overflow-hidden rounded-lg bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm px-4 pb-4 pt-5 text-left shadow-xl transition-all w-full max-w-md">
              <div className="absolute right-0 top-0 pt-4 pr-4">
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="rounded-md bg-white/80 dark:bg-gray-800/80 text-gray-400 hover:text-gray-500 dark:hover:text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="mb-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white transition-colors duration-200">
                  Create New Project
                </h3>
                <p className="mt-2 text-sm text-gray-500 dark:text-gray-400 transition-colors duration-200">
                  Fill in the details below to create your new project.
                </p>
              </div>

              <form onSubmit={handleCreateProject}>
                <div className="space-y-4">
                  <div>
                    <label
                      htmlFor="project_name"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300 transition-colors duration-200"
                    >
                      Project Name *
                    </label>
                    <input
                      type="text"
                      id="project_name"
                      name="project_name"
                      value={newProject.project_name}
                      onChange={(e) =>
                        setNewProject({
                          ...newProject,
                          project_name: e.target.value,
                        })
                      }
                      className="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all duration-200"
                      placeholder="Enter project name"
                      required
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="description"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300 transition-colors duration-200"
                    >
                      Description
                    </label>
                    <textarea
                      id="description"
                      name="description"
                      value={newProject.description}
                      onChange={(e) =>
                        setNewProject({
                          ...newProject,
                          description: e.target.value,
                        })
                      }
                      rows="4"
                      className="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all duration-200"
                      placeholder="Enter project description"
                    />
                  </div>
                </div>

                <div className="mt-6 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={createLoading}
                    className="inline-flex justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                  >
                    {createLoading ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                        Creating...
                      </>
                    ) : (
                      "Create Project"
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      <ToastContainer
        position="bottom-right"
        autoClose={3000}
        theme={isDark ? "dark" : "light"}
      />
    </div>
  );
};

export default ProjectsDashboard;
