"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getNewsItemAction, updateNewsItemAction, deleteNewsItemAction } from "./actions";

interface EditNewsProps {
  id: string;
}

export default function EditNewsDashboard({ id }: EditNewsProps) {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [body, setBody] = useState("");
  const [category, setCategory] = useState("general");
  const [isPublished, setIsPublished] = useState(true);
  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const [currentThumbnail, setCurrentThumbnail] = useState("");
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    if (id) {
      loadNewsData();
    } else {
      setError("No news ID provided");
      setLoadingData(false);
    }
  }, [id]);

  const loadNewsData = async () => {
    if (!id) return;

    try {
      const result = await getNewsItemAction(id);

      if (result.error) {
        setError(result.error);
        setLoadingData(false);
        return;
      }

      if (result.data) {
        setTitle(result.data.title || "");
        setDescription(result.data.description || "");
        setBody(result.data.content || "");
        setCategory(result.data.category || "general");
        setIsPublished(result.data.is_published || false);
        setCurrentThumbnail(result.data.image_url || "");
        setThumbnailPreview(result.data.image_url || null);
      }

      setLoadingData(false);
    } catch (err: any) {
      console.error("Error loading news:", err);
      setError(err.message || "Failed to load news");
      setLoadingData(false);
    }
  };

  const handleThumbnailChange = (file: File) => {
    // Validate file type
    if (!file.type.match(/^image\/(jpeg|jpg|png)$/)) {
      setError("Please upload JPEG, JPG, or PNG image only");
      setSuccess(null);
      return;
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      setError("Image size must be less than 10MB");
      setSuccess(null);
      return;
    }

    setError(null);
    setThumbnail(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setThumbnailPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleThumbnailChange(file);
    }
  };

  const handleEditImageClick = () => {
    document.getElementById('fileInput')?.click();
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleThumbnailChange(file);
    }
  };

  const handleSubmit = async () => {
    if (!id) {
      setError('No news ID provided');
      return;
    }

    // Validation
    if (!title.trim()) {
      setError("Please enter news title");
      setSuccess(null);
      return;
    }
    if (!description.trim()) {
      setError("Please enter description");
      setSuccess(null);
      return;
    }
    if (!body.trim()) {
      setError("Please enter news content");
      setSuccess(null);
      return;
    }

    setError(null);
    setSuccess(null);
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("id", id);
      formData.append("title", title.trim());
      formData.append("description", description.trim());
      formData.append("body", body.trim());
      formData.append("category", category.trim());
      formData.append("isPublished", isPublished.toString());
      if (thumbnail) {
        formData.append("thumbnail", thumbnail);
      }
      formData.append("currentThumbnail", currentThumbnail);

      const result = await updateNewsItemAction(formData);

      if (result.error) {
        setError(result.error);
        setLoading(false);
        return;
      }

      // Success
      setSuccess("News updated successfully!");
      setLoading(false);
      
      // Redirect after 1.5 seconds
      setTimeout(() => {
        router.push('/dashboard-news');
      }, 1500);
    } catch (err: any) {
      console.error("Error updating news:", err);
      setError(err.message || "Failed to update news");
      setLoading(false);
    }
  };

  const handleDeleteClick = () => {
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    if (!id) {
      setError('No news ID provided');
      setShowDeleteModal(false);
      return;
    }

    setError(null);
    setSuccess(null);
    setDeleting(true);

    try {
      const result = await deleteNewsItemAction(id);

      if (result.error) {
        setError(result.error);
        setDeleting(false);
        setShowDeleteModal(false);
        return;
      }

      // Success
      setSuccess("News deleted successfully!");
      setDeleting(false);
      setShowDeleteModal(false);
      
      // Redirect after 1.5 seconds
      setTimeout(() => {
        router.push('/dashboard-news');
      }, 1500);
    } catch (err: any) {
      console.error("Error deleting news:", err);
      setError(err.message || "Failed to delete news");
      setDeleting(false);
      setShowDeleteModal(false);
    }
  };

  const handleDeleteCancel = () => {
    setShowDeleteModal(false);
  };

  if (loadingData) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ backgroundColor: "#FFFDF7", marginLeft: "256px" }}
      >
        <div className="text-xl">Loading news data...</div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen"
      style={{ backgroundColor: "#FFFDF7", marginLeft: "256px" }}
    >
      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center"
          style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
          onClick={handleDeleteCancel}
        >
          <div
            className="bg-white rounded-lg shadow-xl animate-scale-in"
            style={{
              width: "500px",
              maxWidth: "90vw",
              padding: "32px",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Icon */}
            <div className="flex justify-center mb-4">
              <div
                className="rounded-full bg-red-100 flex items-center justify-center"
                style={{ width: "64px", height: "64px" }}
              >
                <svg
                  className="w-8 h-8 text-red-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
              </div>
            </div>

            {/* Title */}
            <h3
              className="text-center mb-3"
              style={{
                fontFamily: "Poppins, sans-serif",
                fontSize: "24px",
                fontWeight: "600",
                color: "#1D1A1A",
              }}
            >
              Delete News?
            </h3>

            {/* Message */}
            <p
              className="text-center mb-6"
              style={{
                fontFamily: "Helvetica Neue, sans-serif",
                fontSize: "16px",
                color: "#666",
                lineHeight: "1.5",
              }}
            >
              Are you sure you want to delete this news? This action cannot be undone.
            </p>

            {/* Buttons */}
            <div className="flex gap-3 justify-center">
              <button
                onClick={handleDeleteCancel}
                disabled={deleting}
                className="px-6 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition-colors disabled:opacity-50"
                style={{
                  fontFamily: "Helvetica Neue, sans-serif",
                  fontSize: "16px",
                  minWidth: "120px",
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirm}
                disabled={deleting}
                className="px-6 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors disabled:opacity-50"
                style={{
                  fontFamily: "Helvetica Neue, sans-serif",
                  fontSize: "16px",
                  minWidth: "120px",
                }}
              >
                {deleting ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast Error Notification */}
      {error && (
        <div
          className="fixed z-50 animate-slide-in"
          style={{
            top: "24px",
            right: "24px",
            width: "400px",
            maxWidth: "calc(100vw - 48px)",
          }}
        >
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded shadow-lg flex items-start justify-between gap-3">
            <div className="flex items-start gap-3 flex-1">
              <svg
                className="w-6 h-6 text-red-500 shrink-0"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
              <p
                style={{
                  fontFamily: "Helvetica Neue, sans-serif",
                  fontSize: "15px",
                  lineHeight: "1.5",
                }}
              >
                {error}
              </p>
            </div>
            <button
              onClick={() => setError(null)}
              className="shrink-0 text-red-500 hover:text-red-700 transition-colors"
              style={{
                fontSize: "20px",
                fontWeight: "bold",
                width: "24px",
                height: "24px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
              aria-label="Close"
            >
              ×
            </button>
          </div>
        </div>
      )}

      {/* Toast Success Notification */}
      {success && (
        <div
          className="fixed z-50 animate-slide-in"
          style={{
            top: "24px",
            right: "24px",
            width: "400px",
            maxWidth: "calc(100vw - 48px)",
          }}
        >
          <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 rounded shadow-lg flex items-start justify-between gap-3">
            <div className="flex items-start gap-3 flex-1">
              <svg
                className="w-6 h-6 text-green-500 shrink-0"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              <p
                style={{
                  fontFamily: "Helvetica Neue, sans-serif",
                  fontSize: "15px",
                  lineHeight: "1.5",
                }}
              >
                {success}
              </p>
            </div>
            <button
              onClick={() => setSuccess(null)}
              className="shrink-0 text-green-500 hover:text-green-700 transition-colors"
              style={{
                fontSize: "20px",
                fontWeight: "bold",
                width: "24px",
                height: "24px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
              aria-label="Close"
            >
              ×
            </button>
          </div>
        </div>
      )}

      {/* Navigator */}
      <div
        style={{
          fontFamily: "Poppins, sans-serif",
          fontWeight: "700",
          fontSize: "24px",
          paddingLeft: "45px",
          paddingRight: "45px",
          paddingTop: "60px",
          marginBottom: "75px",
        }}
      >
        <div className="flex items-center gap-2 text-[#1D1A1A]">
          <span>Website Adjustment</span>
          <span className="text-[#1D1A1A]">/</span>
          <Link href="/dashboard-news" className="hover:underline">
            News
          </Link>
          <span className="text-[#1D1A1A]">/</span>
          <span>Edit News</span>
        </div>
      </div>

      {/* Edit News Form - Centered */}
      <div
        style={{
          paddingLeft: "45px",
          paddingRight: "45px",
          paddingBottom: "40px",
        }}
      >
        {/* Section Title - Centered */}
        <h2
          className="text-center"
          style={{
            fontFamily: "Poppins, sans-serif",
            fontWeight: "500",
            fontSize: "24px",
            color: "#1D1A1A",
            marginBottom: "35px",
          }}
        >
          Edit News
        </h2>
        
        {/* Form Container - Centered with max-width */}
        <div className="mx-auto" style={{ maxWidth: "800px" }}>
          {/* 1. Thumbnail Upload */}
          <div className="mb-6">
            <label
              style={{
                fontFamily: "Helvetica Neue, sans-serif",
                fontSize: "18px",
                color: "#1D1A1A",
                display: "block",
                marginBottom: "12px",
              }}
            >
              Thumbnail
            </label>
            
            {/* Hidden File Input */}
            <input
              type="file"
              id="fileInput"
              accept="image/jpeg,image/jpg,image/png"
              onChange={handleFileInput}
              disabled={loading || deleting}
              className="hidden"
            />

            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`border-2 border-dashed rounded-lg flex flex-col items-center justify-center ${
                isDragging
                  ? "border-[#4A90E2] bg-blue-50"
                  : "border-[#EAEAEA] bg-white"
              } ${loading || deleting ? "opacity-50 pointer-events-none" : ""}`}
              style={{
                height: "330px",
                transition: "all 0.3s ease",
              }}
            >
              {thumbnailPreview ? (
                <div className="relative w-full h-full">
                  <img
                    src={thumbnailPreview}
                    alt="Preview"
                    className="w-full h-full object-contain p-4"
                  />
                  {!loading && !deleting && (
                    <button
                      onClick={handleEditImageClick}
                      className="absolute top-2 right-2 bg-[#FFC700] text-white rounded-lg px-3 py-2 flex items-center gap-2 hover:bg-[#E6B300] transition-colors shadow-md"
                      title="Change image"
                    >
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                      </svg>
                      <span style={{ fontFamily: "Helvetica Neue, sans-serif", fontSize: "14px", fontWeight: "500" }}>
                        Edit
                      </span>
                    </button>
                  )}
                </div>
              ) : (
                <>
                  <Image
                    src="/dashboard/upload.svg"
                    alt="Upload"
                    width={60}
                    height={60}
                    className="mb-4"
                  />
                  <p
                    style={{
                      fontFamily: "Helvetica Neue, sans-serif",
                      fontSize: "18px",
                      color: "#1D1A1A",
                      fontWeight: "500",
                      marginBottom: "8px",
                    }}
                  >
                    Choose a file or drag & drop it here
                  </p>
                  <p
                    style={{
                      fontFamily: "Helvetica Neue, sans-serif",
                      fontSize: "14px",
                      color: "#999",
                      marginBottom: "20px",
                    }}
                  >
                    JPEG, JPG, and PNG formats, up to 10MB
                  </p>
                  <label
                    htmlFor="fileInput"
                    className={`px-6 py-2 border border-[#EAEAEA] rounded transition-colors ${
                      loading || deleting
                        ? "cursor-not-allowed opacity-50"
                        : "cursor-pointer hover:bg-gray-50"
                    }`}
                    style={{
                      fontFamily: "Helvetica Neue, sans-serif",
                      fontSize: "16px",
                      color: "#1D1A1A",
                    }}
                  >
                    Browse File
                  </label>
                </>
              )}
            </div>
          </div>

          {/* 2. Title Field */}
          <div className="mb-6">
            <label
              style={{
                fontFamily: "Helvetica Neue, sans-serif",
                fontSize: "18px",
                color: "#1D1A1A",
                display: "block",
                marginBottom: "12px",
              }}
            >
              Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Insert news title"
              disabled={loading || deleting}
              className="w-full border border-[#EAEAEA] rounded px-4 py-3 bg-white disabled:opacity-50"
              style={{
                fontFamily: "Helvetica Neue, sans-serif",
                fontSize: "18px",
                color: "#1D1A1A",
              }}
            />
          </div>

          {/* 3. Description Field */}
          <div className="mb-6">
            <label
              style={{
                fontFamily: "Helvetica Neue, sans-serif",
                fontSize: "18px",
                color: "#1D1A1A",
                display: "block",
                marginBottom: "12px",
              }}
            >
              Description <span className="text-red-500">*</span>
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Insert news description (summary)"
              rows={2}
              disabled={loading || deleting}
              className="w-full border border-[#EAEAEA] rounded px-4 py-3 bg-white resize-y disabled:opacity-50"
              style={{
                fontFamily: "Helvetica Neue, sans-serif",
                fontSize: "18px",
                color: "#1D1A1A",
                minHeight: "80px",
              }}
            />
          </div>

          {/* 4. Content Field */}
          <div className="mb-6">
            <label
              style={{
                fontFamily: "Helvetica Neue, sans-serif",
                fontSize: "18px",
                color: "#1D1A1A",
                display: "block",
                marginBottom: "12px",
              }}
            >
              Content <span className="text-red-500">*</span>
            </label>
            <textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder="Insert full news content"
              rows={6}
              disabled={loading || deleting}
              className="w-full border border-[#EAEAEA] rounded px-4 py-3 bg-white resize-y disabled:opacity-50"
              style={{
                fontFamily: "Helvetica Neue, sans-serif",
                fontSize: "18px",
                color: "#1D1A1A",
                minHeight: "150px",
              }}
            />
          </div>

          {/* 5. Category Field */}
          <div className="mb-6">
            <label
              style={{
                fontFamily: "Helvetica Neue, sans-serif",
                fontSize: "18px",
                color: "#1D1A1A",
                display: "block",
                marginBottom: "12px",
              }}
            >
              Category <span className="text-red-500">*</span>
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              disabled={loading || deleting}
              className="w-full border border-[#EAEAEA] rounded px-4 py-3 bg-white disabled:opacity-50"
              style={{
                fontFamily: "Helvetica Neue, sans-serif",
                fontSize: "18px",
                color: "#1D1A1A",
              }}
            >
              <option value="general">General</option>
              <option value="event">Event</option>
            </select>
          </div>

          {/* 6. Publish Status Checkbox */}
          <div className="mb-6">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={isPublished}
                onChange={(e) => setIsPublished(e.target.checked)}
                disabled={loading || deleting}
                className="w-5 h-5 rounded border-[#EAEAEA] text-[#4A90E2] focus:ring-[#4A90E2]"
              />
              <span
                style={{
                  fontFamily: "Helvetica Neue, sans-serif",
                  fontSize: "18px",
                  color: "#1D1A1A",
                }}
              >
                Publish this news immediately
              </span>
            </label>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-between mt-8 gap-4">
            <button
              onClick={handleDeleteClick}
              disabled={loading || deleting}
              className="px-8 bg-red-500 text-white rounded hover:bg-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                fontFamily: "Helvetica Neue, sans-serif",
                fontSize: "18px",
                height: "45px",
                minWidth: "150px",
              }}
            >
              Delete
            </button>
            <div className="flex gap-4">
              <Link href="/dashboard-news">
                <button
                  disabled={loading || deleting}
                  className="px-8 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{
                    fontFamily: "Helvetica Neue, sans-serif",
                    fontSize: "18px",
                    height: "45px",
                    minWidth: "150px",
                  }}
                >
                  Cancel
                </button>
              </Link>
              <button
                onClick={handleSubmit}
                disabled={loading || deleting}
                className="px-8 bg-[#4A90E2] text-white rounded hover:bg-[#357ABD] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                style={{
                  fontFamily: "Helvetica Neue, sans-serif",
                  fontSize: "18px",
                  height: "45px",
                  minWidth: "150px",
                }}
              >
                {loading ? "Updating..." : "Update"}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Add CSS for animations */}
      <style jsx>{`
        @keyframes slide-in {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        @keyframes scale-in {
          from {
            transform: scale(0.9);
            opacity: 0;
          }
          to {
            transform: scale(1);
            opacity: 1;
          }
        }
        .animate-slide-in {
          animation: slide-in 0.3s ease-out;
        }
        .animate-scale-in {
          animation: scale-in 0.2s ease-out;
        }
      `}</style>
    </div>
  );
}