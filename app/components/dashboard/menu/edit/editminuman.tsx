"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getMenuItemAction, updateMenuItemAction, deleteMenuItemAction } from "./actions";

export default function EditMinumanDashboard({ id }: { id: string }) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [isAvailable, setIsAvailable] = useState(true);
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [currentImageUrl, setCurrentImageUrl] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    if (id) {
      loadMenuData();
    } else {
      setError('No menu ID provided');
      setLoadingData(false);
    }
  }, [id]);

  const loadMenuData = async () => {
    if (!id) return;

    try {
      const result = await getMenuItemAction(id);

      if (result.error) {
        setError(result.error);
        setLoadingData(false);
        return;
      }

      if (result.data) {
        setName(result.data.name || '');
        setDescription(result.data.description || '');
        setPrice(result.data.price?.toString() || '');
        setIsAvailable(result.data.is_available ?? true);
        setCurrentImageUrl(result.data.image_url || null);
        if (result.data.image_url) {
          setImagePreview(result.data.image_url);
        }
      }

      setLoadingData(false);
    } catch (err: any) {
      console.error("Error loading menu:", err);
      setError(err.message || "Failed to load menu");
      setLoadingData(false);
    }
  };

  const handleImageChange = (file: File) => {
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
    setImage(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleImageChange(file);
    }
  };

  const handleEditImageClick = () => {
    // Trigger file input when edit button clicked
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
      handleImageChange(file);
    }
  };

  const handleSubmit = async () => {
    if (!id) {
      setError('No menu ID provided');
      return;
    }

    // Validation
    if (!name.trim()) {
      setError("Please enter minuman name");
      setSuccess(null);
      return;
    }
    if (!description.trim()) {
      setError("Please enter description");
      setSuccess(null);
      return;
    }
    if (!price || parseFloat(price) <= 0) {
      setError("Please enter valid price");
      setSuccess(null);
      return;
    }

    setError(null);
    setSuccess(null);
    setLoading(true);

    try {
      // Create FormData
      const formData = new FormData();
      formData.append('name', name.trim());
      formData.append('description', description.trim());
      formData.append('price', price);
      formData.append('category', 'minuman'); // Auto category minuman
      formData.append('isAvailable', isAvailable.toString());
      if (image) {
        formData.append('image', image);
      }

      // Call server action
      const result = await updateMenuItemAction(id, formData);

      if (result.error) {
        setError(result.error);
        setLoading(false);
        return;
      }

      // Success
      setSuccess("Minuman updated successfully!");
      setLoading(false);
      
      // Redirect after 1.5 seconds
      setTimeout(() => {
        router.push('/dashboard-menu');
      }, 1500);
    } catch (err: any) {
      console.error("Error updating minuman:", err);
      setError(err.message || "Failed to update minuman");
      setLoading(false);
    }
  };

  const handleDeleteClick = () => {
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    if (!id) {
      setError('No menu ID provided');
      setShowDeleteModal(false);
      return;
    }

    setError(null);
    setSuccess(null);
    setDeleting(true);

    try {
      const result = await deleteMenuItemAction(id);

      if (result.error) {
        setError(result.error);
        setDeleting(false);
        setShowDeleteModal(false);
        return;
      }

      // Success
      setSuccess("Minuman deleted successfully!");
      setDeleting(false);
      setShowDeleteModal(false);
      
      // Redirect after 1.5 seconds
      setTimeout(() => {
        router.push('/dashboard-menu');
      }, 1500);
    } catch (err: any) {
      console.error("Error deleting minuman:", err);
      setError(err.message || "Failed to delete minuman");
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
        <div className="text-xl">Loading menu data...</div>
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
              Delete Minuman?
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
              Are you sure you want to delete this minuman? This action cannot be undone.
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
          <Link href="/dashboard-menu" className="hover:underline">
            Menu
          </Link>
          <span className="text-[#1D1A1A]">/</span>
          <span>Edit Minuman</span>
        </div>
      </div>

      {/* Edit Minuman Form - Centered */}
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
          Edit Minuman
        </h2>
        
        {/* Form Container - Centered with max-width */}
        <div className="mx-auto" style={{ maxWidth: "800px" }}>
          {/* Name Field */}
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
              Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Insert minuman name"
              disabled={loading || deleting}
              className="w-full border border-[#EAEAEA] rounded px-4 py-3 bg-white disabled:opacity-50"
              style={{
                fontFamily: "Helvetica Neue, sans-serif",
                fontSize: "18px",
                color: "#1D1A1A",
              }}
            />
          </div>

          {/* Image Upload */}
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
              Image
            </label>
            
            {/* Hidden File Input - Always in DOM */}
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
              {imagePreview ? (
                <div className="relative w-full h-full">
                  <img
                    src={imagePreview}
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

          {/* Description Field */}
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
              placeholder="Insert minuman description"
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

          {/* Price Field */}
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
              Price (Rp) <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="Insert price"
              disabled={loading || deleting}
              min="0"
              step="1000"
              className="w-full border border-[#EAEAEA] rounded px-4 py-3 bg-white disabled:opacity-50"
              style={{
                fontFamily: "Helvetica Neue, sans-serif",
                fontSize: "18px",
                color: "#1D1A1A",
              }}
            />
          </div>

          {/* Availability Status Toggle */}
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
              Availability Status
            </label>
            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  checked={isAvailable}
                  onChange={() => setIsAvailable(true)}
                  disabled={loading || deleting}
                  className="w-4 h-4"
                />
                <span
                  style={{
                    fontFamily: "Helvetica Neue, sans-serif",
                    fontSize: "18px",
                    color: "#1D1A1A",
                  }}
                >
                  Available
                </span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  checked={!isAvailable}
                  onChange={() => setIsAvailable(false)}
                  disabled={loading || deleting}
                  className="w-4 h-4"
                />
                <span
                  style={{
                    fontFamily: "Helvetica Neue, sans-serif",
                    fontSize: "18px",
                    color: "#1D1A1A",
                  }}
                >
                  Unavailable
                </span>
              </label>
            </div>
            <p
              style={{
                fontFamily: "Helvetica Neue, sans-serif",
                fontSize: "14px",
                color: "#999",
                marginTop: "8px",
              }}
            >
              Unavailable items will not be displayed on the menu
            </p>
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
              <Link href="/dashboard-menu">
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