"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Database,
  Plus,
  Key,
  Calendar,
  LogOut,
  FileText,
  FolderOpen,
  Copy,
  Check,
  X,
  Edit,
  Trash2,
  Settings,
  Save,
  AlertTriangle,
} from "lucide-react";

interface Project {
  id: number;
  name: string;
  apiKey: string;
  maxFileSize: number;
  createdAt: string;
}

export default function DashboardPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [showNewProject, setShowNewProject] = useState(false);
  const [newProjectName, setNewProjectName] = useState("");
  const [newProjectMaxSize, setNewProjectMaxSize] = useState("50");
  const [error, setError] = useState("");
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [editingProject, setEditingProject] = useState<number | null>(null);
  const [editMaxSize, setEditMaxSize] = useState("");
  const [deletingProject, setDeletingProject] = useState<number | null>(null);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    const token = localStorage.getItem("token");
    try {
      const response = await fetch("/api/v1/projects", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) {
        if (response.status === 401) {
          localStorage.removeItem("token");
          router.push("/login");
          return;
        }
        throw new Error("Failed to fetch projects");
      }

      const data = await response.json();
      setProjects(data.projects);
    } catch (err) {
      setError("Failed to load projects");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const token = localStorage.getItem("token");
    const maxFileSizeBytes = parseInt(newProjectMaxSize) * 1024 * 1024; // Convert MB to bytes

    try {
      const response = await fetch("/api/v1/projects", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: newProjectName,
          maxFileSize: maxFileSizeBytes,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Failed to create project");
        return;
      }

      setProjects([data.project, ...projects]);
      setNewProjectName("");
      setNewProjectMaxSize("50");
      setShowNewProject(false);
    } catch (err) {
      setError("An error occurred");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("admin");
    router.push("/login");
  };

  const copyToClipboard = (text: string, id: number) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(`${id}`);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleEditMaxSize = async (projectId: number) => {
    const token = localStorage.getItem("token");
    const maxFileSizeBytes = parseInt(editMaxSize) * 1024 * 1024;

    try {
      const response = await fetch(`/api/v1/projects/${projectId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ maxFileSize: maxFileSizeBytes }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Failed to update project");
        return;
      }

      // Update local state
      setProjects(
        projects.map((p) =>
          p.id === projectId ? { ...p, maxFileSize: maxFileSizeBytes } : p
        )
      );
      setEditingProject(null);
      setEditMaxSize("");
    } catch (err) {
      setError("An error occurred");
    }
  };

  const handleDeleteProject = async (projectId: number) => {
    const token = localStorage.getItem("token");

    try {
      const response = await fetch(`/api/v1/projects/${projectId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Failed to delete project");
        return;
      }

      // Remove from local state
      setProjects(projects.filter((p) => p.id !== projectId));
      setDeletingProject(null);
    } catch (err) {
      setError("An error occurred");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0A0A0F] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-yellow-500/30 border-t-yellow-500 rounded-full animate-spin" />
          <p className="text-neutral-400">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0A0A0F] text-white">
      {/* Background */}
      <div className="fixed inset-0 -z-10 bg-[linear-gradient(to_right,#1a1a1a_1px,transparent_1px),linear-gradient(to_bottom,#1a1a1a_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)]" />

      {/* Navigation */}
      <nav className="border-b border-neutral-800 bg-[#0A0A0F]/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="container mx-auto px-4 sm:px-6 py-3 sm:py-4">
          <div className="flex justify-between items-center">
            <Link href="/" className="flex items-center gap-2 sm:gap-3">
              <div className="w-8 h-8 sm:w-9 sm:h-9 bg-yellow-500 rounded-lg flex items-center justify-center">
                <Database className="w-4 h-4 sm:w-5 sm:h-5 text-black" />
              </div>
              <span className="text-base sm:text-lg font-semibold hidden xs:block">
                Kairoo Storage
              </span>
            </Link>
            <div className="flex items-center gap-1 sm:gap-3">
              <Link href="/dashboard/files">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-neutral-400 hover:text-white hover:bg-neutral-800 px-2 sm:px-4"
                >
                  <FolderOpen className="w-4 h-4 sm:mr-2" />
                  <span className="hidden sm:inline">Files</span>
                </Button>
              </Link>
              <Link href="/dashboard/docs">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-neutral-400 hover:text-white hover:bg-neutral-800 px-2 sm:px-4"
                >
                  <FileText className="w-4 h-4 sm:mr-2" />
                  <span className="hidden sm:inline">Docs</span>
                </Button>
              </Link>
              <Link href="/dashboard/settings">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-neutral-400 hover:text-white hover:bg-neutral-800 px-2 sm:px-4"
                >
                  <Settings className="w-4 h-4 sm:mr-2" />
                  <span className="hidden sm:inline">Settings</span>
                </Button>
              </Link>
              <Button
                onClick={handleLogout}
                variant="ghost"
                size="sm"
                className="text-red-400 hover:text-red-300 hover:bg-red-500/10 px-2 sm:px-4"
              >
                <LogOut className="w-4 h-4 sm:mr-2" />
                <span className="hidden sm:inline">Logout</span>
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="container mx-auto px-4 sm:px-6 py-8 sm:py-12">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-12">
          <div>
            <h1 className="text-4xl font-bold mb-2">Projects</h1>
            <p className="text-neutral-400">
              Manage your API projects and access keys
            </p>
          </div>
          <Button
            onClick={() => setShowNewProject(true)}
            className="bg-yellow-500 hover:bg-yellow-600 text-black font-semibold px-6"
          >
            <Plus className="w-5 h-5 mr-2" />
            New Project
          </Button>
        </div>

        {/* Error Message */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-red-500/10 border border-red-500/20 text-red-400 px-6 py-4 rounded-2xl mb-8 flex items-center justify-between"
          >
            <span>{error}</span>
            <button
              onClick={() => setError("")}
              className="text-red-400 hover:text-red-300"
            >
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        )}

        {/* New Project Form */}
        {showNewProject && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="bg-neutral-900/50 border border-neutral-800 rounded-2xl p-8">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-semibold">Create New Project</h3>
                <button
                  onClick={() => {
                    setShowNewProject(false);
                    setNewProjectName("");
                    setNewProjectMaxSize("50");
                    setError("");
                  }}
                  className="text-neutral-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <form onSubmit={handleCreateProject} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-neutral-300 mb-2">
                    Project Name
                  </label>
                  <input
                    type="text"
                    value={newProjectName}
                    onChange={(e) => setNewProjectName(e.target.value)}
                    required
                    className="w-full px-4 py-3 bg-black/50 border border-neutral-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent text-white placeholder-neutral-500"
                    placeholder="my-awesome-app"
                  />
                  <p className="text-xs text-neutral-500 mt-2">
                    Use lowercase letters, numbers, and hyphens only
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-300 mb-2">
                    Max File Size (MB)
                  </label>
                  <input
                    type="number"
                    value={newProjectMaxSize}
                    onChange={(e) => setNewProjectMaxSize(e.target.value)}
                    required
                    min="1"
                    max="100"
                    className="w-full px-4 py-3 bg-black/50 border border-neutral-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent text-white placeholder-neutral-500"
                    placeholder="50"
                  />
                  <p className="text-xs text-neutral-500 mt-2">
                    Maximum file size allowed for uploads (1-100 MB)
                  </p>
                </div>
                <div className="flex gap-3">
                  <Button
                    type="submit"
                    className="bg-yellow-500 hover:bg-yellow-600 text-black font-semibold"
                  >
                    Create Project
                  </Button>
                  <Button
                    type="button"
                    onClick={() => {
                      setShowNewProject(false);
                      setNewProjectName("");
                      setError("");
                    }}
                    variant="outline"
                    className="border-neutral-700 hover:bg-neutral-400 hover:border-neutral-600 text-black"
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </div>
          </motion.div>
        )}

        {/* Projects Grid */}
        {projects.length === 0 && !showNewProject ? (
          <div className="text-center py-20">
            <div className="w-20 h-20 bg-neutral-900/50 border border-neutral-800 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Database className="w-10 h-10 text-neutral-500" />
            </div>
            <h3 className="text-2xl font-semibold mb-2 text-neutral-300">
              No projects yet
            </h3>
            <p className="text-neutral-500 mb-6">
              Create your first project to get started
            </p>
            <Button
              onClick={() => setShowNewProject(true)}
              className="bg-yellow-500 hover:bg-yellow-600 text-black font-semibold"
            >
              <Plus className="w-4 h-4 mr-2" />
              Create Project
            </Button>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project, index) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="bg-neutral-900/50 border border-neutral-800 rounded-2xl p-6 hover:border-neutral-700 transition-all"
              >
                <div className="flex items-start justify-between mb-6">
                  <div className="w-12 h-12 bg-yellow-500/10 rounded-xl flex items-center justify-center">
                    <Database className="w-6 h-6 text-yellow-500" />
                  </div>
                  <div className="flex items-center gap-2 text-xs text-neutral-500">
                    <Calendar className="w-3 h-3" />
                    {new Date(project.createdAt).toLocaleDateString()}
                  </div>
                </div>

                <h3 className="text-xl font-semibold mb-6 text-white">
                  {project.name}
                </h3>

                <div className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-xs font-medium text-neutral-400 flex items-center gap-1">
                        <Key className="w-3 h-3" />
                        API Key
                      </label>
                      <button
                        onClick={() =>
                          copyToClipboard(project.apiKey, project.id)
                        }
                        className="text-xs text-yellow-500 hover:text-yellow-400 transition-colors flex items-center gap-1 font-medium"
                      >
                        {copiedKey === `${project.id}` ? (
                          <>
                            <Check className="w-3 h-3" />
                            Copied
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3" />
                            Copy
                          </>
                        )}
                      </button>
                    </div>
                    <code className="block bg-black/50 text-xs p-3 rounded-lg break-all text-neutral-300 font-mono border border-neutral-800">
                      {project.apiKey}
                    </code>
                  </div>

                  <div>
                    <label className="text-xs font-medium text-neutral-400 mb-2 block">
                      Max File Size
                    </label>
                    {editingProject === project.id ? (
                      <div className="flex gap-2">
                        <input
                          type="number"
                          value={editMaxSize}
                          onChange={(e) => setEditMaxSize(e.target.value)}
                          min="1"
                          max="100"
                          className="flex-1 px-3 py-2 bg-black/50 border border-neutral-700 rounded-lg text-xs text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
                          placeholder="MB"
                        />
                        <button
                          onClick={() => handleEditMaxSize(project.id)}
                          className="p-2 bg-yellow-500 hover:bg-yellow-600 text-black rounded-lg transition-colors"
                        >
                          <Save className="w-3 h-3" />
                        </button>
                        <button
                          onClick={() => {
                            setEditingProject(null);
                            setEditMaxSize("");
                          }}
                          className="p-2 bg-neutral-700 hover:bg-neutral-600 text-white rounded-lg transition-colors"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center justify-between bg-black/50 text-xs p-3 rounded-lg text-neutral-300 border border-neutral-800">
                        <span>
                          {(project.maxFileSize / (1024 * 1024)).toFixed(0)} MB
                        </span>
                        <button
                          onClick={() => {
                            setEditingProject(project.id);
                            setEditMaxSize(
                              (project.maxFileSize / (1024 * 1024)).toFixed(0)
                            );
                          }}
                          className="text-yellow-500 hover:text-yellow-400 transition-colors"
                        >
                          <Edit className="w-3 h-3" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                <div className="mt-6 pt-6 border-t border-neutral-800">
                  <button
                    onClick={() => setDeletingProject(project.id)}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg transition-colors text-sm font-medium"
                  >
                    <Trash2 className="w-4 h-4" />
                    Delete Project
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {deletingProject && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-neutral-900 border border-neutral-800 rounded-2xl p-8 max-w-md w-full"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-red-500/10 rounded-xl flex items-center justify-center">
                <AlertTriangle className="w-6 h-6 text-red-500" />
              </div>
              <h3 className="text-2xl font-semibold">Delete Project?</h3>
            </div>

            <p className="text-neutral-400 mb-6">
              This will permanently delete the project{" "}
              <span className="font-semibold text-white">
                {projects.find((p) => p.id === deletingProject)?.name}
              </span>{" "}
              and all associated files including:
            </p>

            <div className="bg-black/50 border border-neutral-800 rounded-lg p-4 mb-6">
              <ul className="space-y-2 text-sm text-neutral-400">
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-red-500 rounded-full" />
                  All uploaded images
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-red-500 rounded-full" />
                  All uploaded videos
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-red-500 rounded-full" />
                  All uploaded documents
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-red-500 rounded-full" />
                  The entire project folder
                </li>
              </ul>
            </div>

            <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 mb-6">
              <p className="text-sm text-red-400 font-medium">
                ⚠️ This action cannot be undone!
              </p>
            </div>

            <div className="flex gap-3">
              <Button
                onClick={() => handleDeleteProject(deletingProject)}
                className="flex-1 bg-red-500 hover:bg-red-600 text-white font-semibold"
              >
                Yes, Delete Everything
              </Button>
              <Button
                onClick={() => setDeletingProject(null)}
                variant="outline"
                className="flex-1 border-neutral-700 hover:bg-neutral-400 hover:border-neutral-600 text-black"
              >
                Cancel
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
