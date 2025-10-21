"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  FileImage,
  FileVideo,
  FileText,
  Trash2,
  ExternalLink,
  Database,
  Filter,
  FolderOpen,
  LogOut,
  X,
  Settings,
} from "lucide-react";

interface Project {
  id: number;
  name: string;
  apiKey: string;
}

interface File {
  id: number;
  filename: string;
  originalName: string;
  type: string;
  size: number;
  url: string;
  uploadedAt: string;
}

export default function FilesPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [files, setFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>("all");
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [fileToDelete, setFileToDelete] = useState<File | null>(null);
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
      if (data.projects.length > 0) {
        setSelectedProject(data.projects[0]);
        fetchFiles(data.projects[0].apiKey);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchFiles = async (apiKey: string, type?: string) => {
    try {
      const url =
        type && type !== "all" ? `/api/v1/files?type=${type}` : "/api/v1/files";

      const response = await fetch(url, {
        headers: { Authorization: `Bearer ${apiKey}` },
      });

      if (!response.ok) throw new Error("Failed to fetch files");

      const data = await response.json();
      setFiles(data.files || []);
    } catch (err) {
      console.error(err);
      setFiles([]);
    }
  };

  const handleProjectChange = (project: Project) => {
    setSelectedProject(project);
    setFilter("all");
    fetchFiles(project.apiKey);
  };

  const handleFilterChange = (newFilter: string) => {
    setFilter(newFilter);
    if (selectedProject) {
      fetchFiles(selectedProject.apiKey, newFilter);
    }
  };

  const openDeleteModal = (file: File) => {
    setFileToDelete(file);
    setDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setDeleteModalOpen(false);
    setFileToDelete(null);
  };

  const confirmDelete = async () => {
    if (!selectedProject || !fileToDelete) return;

    try {
      const response = await fetch(`/api/v1/files/${fileToDelete.id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${selectedProject.apiKey}` },
      });

      if (!response.ok) throw new Error("Failed to delete file");

      fetchFiles(selectedProject.apiKey, filter === "all" ? undefined : filter);
      closeDeleteModal();
    } catch (err) {
      alert("Failed to delete file");
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + " KB";
    return (bytes / (1024 * 1024)).toFixed(2) + " MB";
  };

  const getFileIcon = (type: string) => {
    switch (type) {
      case "image":
        return <FileImage className="w-8 h-8 text-yellow-500" />;
      case "video":
        return <FileVideo className="w-8 h-8 text-yellow-500" />;
      case "document":
        return <FileText className="w-8 h-8 text-yellow-500" />;
      default:
        return <FileText className="w-8 h-8 text-neutral-500" />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0A0A0F] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-yellow-500/30 border-t-yellow-500 rounded-full animate-spin" />
          <p className="text-neutral-400">Loading files...</p>
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
            <Link
              href="/dashboard"
              className="flex items-center gap-2 sm:gap-3"
            >
              <div className="w-8 h-8 sm:w-9 sm:h-9 bg-yellow-500 rounded-lg flex items-center justify-center">
                <Database className="w-4 h-4 sm:w-5 sm:h-5 text-black" />
              </div>
              <span className="text-base sm:text-lg font-semibold hidden xs:block">
                Kairoo Storage
              </span>
            </Link>
            <div className="flex items-center gap-1 sm:gap-3">
              <Link href="/dashboard">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-neutral-400 hover:text-white hover:bg-neutral-800 px-2 sm:px-4"
                >
                  <Database className="w-4 h-4 sm:mr-2" />
                  <span className="hidden sm:inline">Dashboard</span>
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
                onClick={() => {
                  localStorage.removeItem("token");
                  router.push("/login");
                }}
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

      <div className="container mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <h1 className="text-4xl font-bold mb-8">File Browser</h1>

        {projects.length === 0 ? (
          <div className="bg-neutral-900/50 border border-neutral-800 rounded-2xl p-12 text-center">
            <div className="w-16 h-16 bg-neutral-800 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Database className="w-8 h-8 text-neutral-500" />
            </div>
            <h3 className="text-2xl font-semibold mb-2 text-neutral-300">
              No projects found
            </h3>
            <p className="text-neutral-500 mb-6">
              Create a project first to start uploading files
            </p>
            <Link href="/dashboard">
              <Button className="bg-yellow-500 hover:bg-yellow-600 text-black font-semibold">
                Go to Dashboard
              </Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Project Selector */}
            <div className="bg-neutral-900/50 border border-neutral-800 rounded-2xl p-6">
              <label className="block text-sm font-medium text-neutral-300 mb-3">
                Select Project
              </label>
              <select
                value={selectedProject?.id || ""}
                onChange={(e) => {
                  const project = projects.find(
                    (p) => p.id === parseInt(e.target.value)
                  );
                  if (project) handleProjectChange(project);
                }}
                className="w-full px-4 py-3 bg-black/50 border border-neutral-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent text-white"
              >
                {projects.map((project) => (
                  <option key={project.id} value={project.id}>
                    {project.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Filter Tabs */}
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-neutral-500" />
              <div className="flex gap-2">
                {["all", "image", "video", "document"].map((type) => (
                  <button
                    key={type}
                    onClick={() => handleFilterChange(type)}
                    className={`px-4 py-2 rounded-lg font-medium capitalize text-sm transition-colors ${
                      filter === type
                        ? "bg-yellow-500 text-black"
                        : "bg-neutral-800/50 text-neutral-400 hover:text-white hover:bg-neutral-800"
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            {/* Files Grid */}
            {files.length === 0 ? (
              <div className="bg-neutral-900/50 border border-neutral-800 rounded-2xl p-12 text-center">
                <p className="text-neutral-400">
                  No files found. Upload some files using the API.
                </p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {files.map((file) => (
                  <div
                    key={file.id}
                    className="bg-neutral-900/50 border border-neutral-800 rounded-2xl p-6 hover:border-neutral-700 transition-all"
                  >
                    <div className="flex items-start gap-4 mb-4">
                      <div className="flex-shrink-0">
                        {getFileIcon(file.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-white truncate mb-1">
                          {file.originalName}
                        </h3>
                        <div className="flex items-center gap-2 flex-wrap">
                          <Badge
                            variant="outline"
                            className="text-xs bg-neutral-800 border-neutral-700"
                          >
                            {file.type}
                          </Badge>
                          <span className="text-xs text-neutral-500">
                            {formatFileSize(file.size)}
                          </span>
                        </div>
                        <p className="text-xs text-neutral-500 mt-2">
                          {new Date(file.uploadedAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <a
                        href={file.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1"
                      >
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full border-neutral-700 hover:bg-neutral-400 hover:border-neutral-600 text-black"
                        >
                          <ExternalLink className="w-4 h-4 mr-2" />
                          View
                        </Button>
                      </a>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openDeleteModal(file)}
                        className="border-red-500/20 text-red-400 hover:bg-red-500/10 hover:border-red-500/30"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {deleteModalOpen && fileToDelete && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 max-w-md w-full mx-4">
            <div className="flex items-start gap-4 mb-6">
              <div className="w-12 h-12 bg-red-500/10 rounded-xl flex items-center justify-center flex-shrink-0">
                <Trash2 className="w-6 h-6 text-red-400" />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-semibold text-white mb-2">
                  Delete File
                </h3>
                <p className="text-neutral-400 text-sm">
                  Are you sure you want to delete{" "}
                  <span className="text-white font-medium">
                    {fileToDelete.originalName}
                  </span>
                  ? This action cannot be undone.
                </p>
              </div>
              <button
                onClick={closeDeleteModal}
                className="text-neutral-500 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex gap-3">
              <Button
                onClick={closeDeleteModal}
                variant="outline"
                className="flex-1 border-neutral-700 hover:bg-neutral-400 hover:border-neutral-600 text-black"
              >
                Cancel
              </Button>
              <Button
                onClick={confirmDelete}
                className="flex-1 bg-red-500 hover:bg-red-600 text-white"
              >
                Delete File
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
