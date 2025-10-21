"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Code2,
  Upload,
  List,
  Trash2,
  FileText,
  Copy,
  Check,
  ChevronRight,
  Database,
  Key,
  Shield,
  Zap,
  FolderOpen,
  Settings,
} from "lucide-react";
import Link from "next/link";

export default function DocsPage() {
  const [activeTab, setActiveTab] = useState("getting-started");
  const [apiKey, setApiKey] = useState("");
  const [uploadResult, setUploadResult] = useState<any>(null);
  const [filesResult, setFilesResult] = useState<any>(null);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const copyCode = (code: string, id: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(id);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const handleTestUpload = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    try {
      const response = await fetch("/api/v1/upload", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
        },
        body: formData,
      });

      const data = await response.json();
      setUploadResult(data);
    } catch (error) {
      setUploadResult({ error: "Upload failed" });
    }
  };

  const handleListFiles = async () => {
    try {
      const response = await fetch("/api/v1/files", {
        headers: {
          Authorization: `Bearer ${apiKey}`,
        },
      });

      const data = await response.json();
      setFilesResult(data);
    } catch (error) {
      setFilesResult({ error: "Failed to list files" });
    }
  };

  const sections = [
    { id: "getting-started", label: "Getting Started", icon: FileText },
    { id: "authentication", label: "Authentication", icon: Shield },
    { id: "upload", label: "Upload Files", icon: Upload },
    { id: "list", label: "List Files", icon: List },
    { id: "delete", label: "Delete Files", icon: Trash2 },
    { id: "playground", label: "API Playground", icon: Code2 },
  ];

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
            </div>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <div className="flex gap-8">
          {/* Sidebar */}
          <aside className="hidden lg:block w-64 shrink-0">
            <div className="sticky top-24 space-y-1">
              <h3 className="text-sm font-semibold text-neutral-400 uppercase tracking-wider mb-4">
                Documentation
              </h3>
              {sections.map((section) => (
                <button
                  key={section.id}
                  onClick={() => setActiveTab(section.id)}
                  className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-left transition-colors ${
                    activeTab === section.id
                      ? "bg-yellow-500/10 text-yellow-500 font-medium"
                      : "text-neutral-400 hover:text-white hover:bg-neutral-800/50"
                  }`}
                >
                  <section.icon className="w-4 h-4" />
                  {section.label}
                </button>
              ))}
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1 max-w-4xl">
            {/* Mobile Tabs */}
            <div className="lg:hidden mb-8 overflow-x-auto">
              <div className="flex gap-2 pb-2">
                {sections.map((section) => (
                  <button
                    key={section.id}
                    onClick={() => setActiveTab(section.id)}
                    className={`px-4 py-2 rounded-lg whitespace-nowrap text-sm font-medium transition-colors ${
                      activeTab === section.id
                        ? "bg-yellow-500/10 text-yellow-500"
                        : "bg-neutral-800/50 text-neutral-400 hover:text-white"
                    }`}
                  >
                    {section.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Getting Started */}
            {activeTab === "getting-started" && (
              <div className="space-y-8">
                <div>
                  <h1 className="text-4xl font-bold mb-4">Getting Started</h1>
                  <p className="text-lg text-neutral-400">
                    Welcome to Kairoo Storage API documentation. Learn how to
                    integrate file storage into your applications.
                  </p>
                </div>

                <div className="bg-neutral-900/50 border border-neutral-800 rounded-2xl p-8">
                  <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
                    <Zap className="w-6 h-6 text-yellow-500" />
                    Quick Start
                  </h2>
                  <div className="space-y-4 text-neutral-300">
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-yellow-500/10 rounded-full flex items-center justify-center shrink-0 mt-0.5">
                        <span className="text-xs font-bold text-yellow-500">
                          1
                        </span>
                      </div>
                      <div>
                        <p className="font-medium text-white mb-1">
                          Get API Access
                        </p>
                        <p className="text-sm text-neutral-400">
                          Contact{" "}
                          <a
                            href="mailto:boussettah.dev@gmail.com"
                            className="text-yellow-500 hover:underline"
                          >
                            boussettah.dev@gmail.com
                          </a>{" "}
                          to request access
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-yellow-500/10 rounded-full flex items-center justify-center shrink-0 mt-0.5">
                        <span className="text-xs font-bold text-yellow-500">
                          2
                        </span>
                      </div>
                      <div>
                        <p className="font-medium text-white mb-1">
                          Create a Project
                        </p>
                        <p className="text-sm text-neutral-400">
                          Login to your dashboard and create a new project to
                          get your API key
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-yellow-500/10 rounded-full flex items-center justify-center shrink-0 mt-0.5">
                        <span className="text-xs font-bold text-yellow-500">
                          3
                        </span>
                      </div>
                      <div>
                        <p className="font-medium text-white mb-1">
                          Start Uploading
                        </p>
                        <p className="text-sm text-neutral-400">
                          Use your API key to upload files via our REST API
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-neutral-900/50 border border-neutral-800 rounded-2xl p-8">
                  <h3 className="text-xl font-semibold mb-4">Base URL</h3>
                  <div className="relative">
                    <code className="block bg-black/50 p-4 rounded-lg text-yellow-500 font-mono text-sm">
                      http://localhost:3000/api/v1
                    </code>
                  </div>
                </div>

                <div className="bg-neutral-900/50 border border-neutral-800 rounded-2xl p-8">
                  <h3 className="text-xl font-semibold mb-4">
                    Supported File Types
                  </h3>
                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="bg-black/30 p-4 rounded-lg">
                      <p className="font-medium mb-2">Images</p>
                      <p className="text-sm text-neutral-400">
                        JPG, PNG, GIF, WebP, SVG
                      </p>
                    </div>
                    <div className="bg-black/30 p-4 rounded-lg">
                      <p className="font-medium mb-2">Videos</p>
                      <p className="text-sm text-neutral-400">
                        MP4, WebM, MOV, AVI
                      </p>
                    </div>
                    <div className="bg-black/30 p-4 rounded-lg">
                      <p className="font-medium mb-2">Documents</p>
                      <p className="text-sm text-neutral-400">
                        PDF, DOC, TXT, MD
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Authentication */}
            {activeTab === "authentication" && (
              <div className="space-y-8">
                <div>
                  <h1 className="text-4xl font-bold mb-4">Authentication</h1>
                  <p className="text-lg text-neutral-400">
                    All API requests require authentication using your project's
                    API key.
                  </p>
                </div>

                <div className="bg-neutral-900/50 border border-neutral-800 rounded-2xl p-8">
                  <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                    <Key className="w-5 h-5 text-yellow-500" />
                    API Key Authentication
                  </h3>
                  <p className="text-neutral-300 mb-4">
                    Include your API key in the Authorization header of every
                    request:
                  </p>
                  <div className="relative">
                    <button
                      onClick={() =>
                        copyCode(
                          "Authorization: Bearer YOUR_API_KEY",
                          "auth-header"
                        )
                      }
                      className="absolute top-3 right-3 p-2 bg-neutral-800 hover:bg-neutral-700 rounded-lg transition-colors"
                    >
                      {copiedCode === "auth-header" ? (
                        <Check className="w-4 h-4 text-green-500" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </button>
                    <pre className="bg-black/50 p-4 rounded-lg overflow-x-auto">
                      <code className="text-sm text-neutral-300">
                        Authorization: Bearer YOUR_API_KEY
                      </code>
                    </pre>
                  </div>
                </div>

                <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-2xl p-6">
                  <p className="text-sm text-yellow-200">
                    <strong>Important:</strong> Keep your API key secure and
                    never expose it in client-side code. Rotate your keys
                    regularly for enhanced security.
                  </p>
                </div>
              </div>
            )}

            {/* Upload */}
            {activeTab === "upload" && (
              <div className="space-y-8">
                <div>
                  <h1 className="text-4xl font-bold mb-4">Upload Files</h1>
                  <Badge className="bg-green-500/10 text-green-500 border-green-500/20">
                    POST /api/v1/upload
                  </Badge>
                </div>

                <div className="bg-neutral-900/50 border border-neutral-800 rounded-2xl p-8">
                  <h3 className="text-xl font-semibold mb-4">Request</h3>
                  <div className="relative mb-4">
                    <button
                      onClick={() =>
                        copyCode(
                          `curl -X POST http://localhost:3000/api/v1/upload \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -F "file=@image.png"`,
                          "upload-curl"
                        )
                      }
                      className="absolute top-3 right-3 p-2 bg-neutral-800 hover:bg-neutral-700 rounded-lg transition-colors z-10"
                    >
                      {copiedCode === "upload-curl" ? (
                        <Check className="w-4 h-4 text-green-500" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </button>
                    <pre className="bg-black/50 p-4 rounded-lg overflow-x-auto">
                      <code className="text-sm text-neutral-300">
                        {`curl -X POST http://localhost:3000/api/v1/upload \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -F "file=@image.png"`}
                      </code>
                    </pre>
                  </div>

                  <h3 className="text-xl font-semibold mb-4 mt-8">Response</h3>
                  <div className="relative">
                    <pre className="bg-black/50 p-4 rounded-lg overflow-x-auto">
                      <code className="text-sm text-neutral-300">
                        {`{
  "success": true,
  "file": {
    "id": 1,
    "filename": "image_1234567890_abc123.png",
    "originalName": "image.png",
    "type": "image",
    "size": 102400,
    "url": "http://localhost:4000/files/project/images/...",
    "uploadedAt": "2025-10-21T03:00:00.000Z"
  }
}`}
                      </code>
                    </pre>
                  </div>
                </div>

                <div className="bg-neutral-900/50 border border-neutral-800 rounded-2xl p-8">
                  <h3 className="text-xl font-semibold mb-4">
                    JavaScript Example
                  </h3>
                  <div className="relative">
                    <button
                      onClick={() =>
                        copyCode(
                          `const formData = new FormData();
formData.append('file', fileInput.files[0]);

const response = await fetch('http://localhost:3000/api/v1/upload', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer YOUR_API_KEY'
  },
  body: formData
});

const data = await response.json();
console.log(data.file.url);`,
                          "upload-js"
                        )
                      }
                      className="absolute top-3 right-3 p-2 bg-neutral-800 hover:bg-neutral-700 rounded-lg transition-colors z-10"
                    >
                      {copiedCode === "upload-js" ? (
                        <Check className="w-4 h-4 text-green-500" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </button>
                    <pre className="bg-black/50 p-4 rounded-lg overflow-x-auto">
                      <code className="text-sm text-neutral-300">
                        {`const formData = new FormData();
formData.append('file', fileInput.files[0]);

const response = await fetch('http://localhost:3000/api/v1/upload', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer YOUR_API_KEY'
  },
  body: formData
});

const data = await response.json();
console.log(data.file.url);`}
                      </code>
                    </pre>
                  </div>
                </div>
              </div>
            )}

            {/* List Files */}
            {activeTab === "list" && (
              <div className="space-y-8">
                <div>
                  <h1 className="text-4xl font-bold mb-4">List Files</h1>
                  <Badge className="bg-blue-500/10 text-blue-500 border-blue-500/20">
                    GET /api/v1/files
                  </Badge>
                </div>

                <div className="bg-neutral-900/50 border border-neutral-800 rounded-2xl p-8">
                  <h3 className="text-xl font-semibold mb-4">Request</h3>
                  <div className="relative mb-4">
                    <button
                      onClick={() =>
                        copyCode(
                          `curl http://localhost:3000/api/v1/files \\
  -H "Authorization: Bearer YOUR_API_KEY"

# Filter by type
curl http://localhost:3000/api/v1/files?type=image \\
  -H "Authorization: Bearer YOUR_API_KEY"`,
                          "list-curl"
                        )
                      }
                      className="absolute top-3 right-3 p-2 bg-neutral-800 hover:bg-neutral-700 rounded-lg transition-colors z-10"
                    >
                      {copiedCode === "list-curl" ? (
                        <Check className="w-4 h-4 text-green-500" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </button>
                    <pre className="bg-black/50 p-4 rounded-lg overflow-x-auto">
                      <code className="text-sm text-neutral-300">
                        {`curl http://localhost:3000/api/v1/files \\
  -H "Authorization: Bearer YOUR_API_KEY"

# Filter by type
curl http://localhost:3000/api/v1/files?type=image \\
  -H "Authorization: Bearer YOUR_API_KEY"`}
                      </code>
                    </pre>
                  </div>

                  <h3 className="text-xl font-semibold mb-4 mt-8">
                    Query Parameters
                  </h3>
                  <div className="space-y-3">
                    <div className="bg-black/30 p-4 rounded-lg">
                      <code className="text-yellow-500">type</code>
                      <span className="text-neutral-400 ml-2">
                        (optional) - Filter by file type: image, video, or
                        document
                      </span>
                    </div>
                  </div>

                  <h3 className="text-xl font-semibold mb-4 mt-8">Response</h3>
                  <div className="relative">
                    <pre className="bg-black/50 p-4 rounded-lg overflow-x-auto">
                      <code className="text-sm text-neutral-300">
                        {`{
  "success": true,
  "count": 2,
  "files": [
    {
      "id": 1,
      "filename": "image_1234567890_abc123.png",
      "originalName": "image.png",
      "type": "image",
      "size": 102400,
      "url": "http://localhost:4000/files/project/images/...",
      "uploadedAt": "2025-10-21T03:00:00.000Z"
    }
  ]
}`}
                      </code>
                    </pre>
                  </div>
                </div>
              </div>
            )}

            {/* Delete */}
            {activeTab === "delete" && (
              <div className="space-y-8">
                <div>
                  <h1 className="text-4xl font-bold mb-4">Delete Files</h1>
                  <Badge className="bg-red-500/10 text-red-500 border-red-500/20">
                    DELETE /api/v1/files/:id
                  </Badge>
                </div>

                <div className="bg-neutral-900/50 border border-neutral-800 rounded-2xl p-8">
                  <h3 className="text-xl font-semibold mb-4">Request</h3>
                  <div className="relative mb-4">
                    <button
                      onClick={() =>
                        copyCode(
                          `curl -X DELETE http://localhost:3000/api/v1/files/1 \\
  -H "Authorization: Bearer YOUR_API_KEY"`,
                          "delete-curl"
                        )
                      }
                      className="absolute top-3 right-3 p-2 bg-neutral-800 hover:bg-neutral-700 rounded-lg transition-colors z-10"
                    >
                      {copiedCode === "delete-curl" ? (
                        <Check className="w-4 h-4 text-green-500" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </button>
                    <pre className="bg-black/50 p-4 rounded-lg overflow-x-auto">
                      <code className="text-sm text-neutral-300">
                        {`curl -X DELETE http://localhost:3000/api/v1/files/1 \\
  -H "Authorization: Bearer YOUR_API_KEY"`}
                      </code>
                    </pre>
                  </div>

                  <h3 className="text-xl font-semibold mb-4 mt-8">Response</h3>
                  <div className="relative">
                    <pre className="bg-black/50 p-4 rounded-lg overflow-x-auto">
                      <code className="text-sm text-neutral-300">
                        {`{
  "success": true,
  "message": "File deleted successfully"
}`}
                      </code>
                    </pre>
                  </div>
                </div>

                <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-6">
                  <p className="text-sm text-red-200">
                    <strong>Warning:</strong> Deleting a file is permanent and
                    cannot be undone. The file will be removed from both the
                    database and storage.
                  </p>
                </div>
              </div>
            )}

            {/* Playground */}
            {activeTab === "playground" && (
              <div className="space-y-8">
                <div>
                  <h1 className="text-4xl font-bold mb-4">API Playground</h1>
                  <p className="text-lg text-neutral-400">
                    Test your API endpoints directly from the browser
                  </p>
                </div>

                <div className="bg-neutral-900/50 border border-neutral-800 rounded-2xl p-8">
                  <h3 className="text-xl font-semibold mb-4">API Key</h3>
                  <input
                    type="text"
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    placeholder="Enter your API key"
                    className="w-full px-4 py-3 bg-black/50 border border-neutral-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent text-white placeholder-neutral-500"
                  />
                </div>

                <div className="bg-neutral-900/50 border border-neutral-800 rounded-2xl p-8">
                  <h3 className="text-xl font-semibold mb-4">Test Upload</h3>
                  <form onSubmit={handleTestUpload} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-neutral-300 mb-2">
                        Select File
                      </label>
                      <input
                        type="file"
                        name="file"
                        required
                        className="w-full px-4 py-3 bg-black/50 border border-neutral-700 rounded-lg text-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-yellow-500 file:text-black file:font-semibold hover:file:bg-yellow-600"
                      />
                    </div>
                    <Button
                      type="submit"
                      disabled={!apiKey}
                      className="bg-yellow-500 hover:bg-yellow-600 text-black font-semibold"
                    >
                      Upload File
                    </Button>
                  </form>

                  {uploadResult && (
                    <div className="mt-6">
                      <h4 className="font-semibold mb-2 text-neutral-300">
                        Response:
                      </h4>
                      <pre className="bg-black/50 p-4 rounded-lg overflow-x-auto">
                        <code className="text-sm text-neutral-300">
                          {JSON.stringify(uploadResult, null, 2)}
                        </code>
                      </pre>
                    </div>
                  )}
                </div>

                <div className="bg-neutral-900/50 border border-neutral-800 rounded-2xl p-8">
                  <h3 className="text-xl font-semibold mb-4">
                    Test List Files
                  </h3>
                  <Button
                    onClick={handleListFiles}
                    disabled={!apiKey}
                    className="bg-yellow-500 hover:bg-yellow-600 text-black font-semibold"
                  >
                    List Files
                  </Button>

                  {filesResult && (
                    <div className="mt-6">
                      <h4 className="font-semibold mb-2 text-neutral-300">
                        Response:
                      </h4>
                      <pre className="bg-black/50 p-4 rounded-lg overflow-x-auto">
                        <code className="text-sm text-neutral-300">
                          {JSON.stringify(filesResult, null, 2)}
                        </code>
                      </pre>
                    </div>
                  )}
                </div>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
