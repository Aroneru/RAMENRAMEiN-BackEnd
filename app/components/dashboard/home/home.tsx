"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { getHeroSectionAction, updateHeroSectionAction, deleteHeroSectionAction } from "./actions";

export default function HomeDashboard() {
  const [heroImage, setHeroImage] = useState<File | null>(null);
  const [currentHeroUrl, setCurrentHeroUrl] = useState<string>("");
  const [heroImagePreview, setHeroImagePreview] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    loadHeroSection();
  }, []);

  const loadHeroSection = async () => {
    try {
      const result = await getHeroSectionAction();
      
      if (result.error) {
        setError(result.error);
        setLoadingData(false);
        return;
      }

      if (result.data?.image_url) {
        setCurrentHeroUrl(result.data.image_url);
        setHeroImagePreview(result.data.image_url);
      }

      setLoadingData(false);
    } catch (err: any) {
      console.error("Error loading hero section:", err);
      setError(err.message || "Failed to load hero section");
      setLoadingData(false);
    }
  };

  const handleHeroImageChange = (file: File) => {
    if (!file.type.match(/^image\/(jpeg|jpg|png)$/)) {
      setError("Please upload JPEG, JPG, or PNG image only");
      setSuccess(null);
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setError("Image size must be less than 10MB");
      setSuccess(null);
      return;
    }

    setError(null);
    setHeroImage(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setHeroImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleHeroImageChange(file);
    }
  };

  const handleEditImageClick = () => {
    // Trigger file input when edit button clicked
    document.getElementById('heroFileInput')?.click();
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
      handleHeroImageChange(file);
    }
  };

  const handleUpload = async () => {
    if (!heroImage) {
      setError("Please select an image to upload");
      setSuccess(null);
      return;
    }

    setError(null);
    setSuccess(null);
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("heroImage", heroImage);
      formData.append("currentHeroUrl", currentHeroUrl);

      const result = await updateHeroSectionAction(formData);

      if (result.error) {
        setError(result.error);
        setLoading(false);
        return;
      }

      setSuccess("Hero section updated successfully!");
      setHeroImage(null);
      setLoading(false);
      
      await loadHeroSection();
      
      setTimeout(() => {
        setSuccess(null);
      }, 3000);
    } catch (err: any) {
      console.error("Error uploading hero section:", err);
      setError(err.message || "Failed to upload hero section");
      setLoading(false);
    }
  };

  const handleDeleteClick = () => {
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    setError(null);
    setSuccess(null);
    setDeleting(true);

    try {
      const result = await deleteHeroSectionAction(currentHeroUrl);

      if (result.error) {
        setError(result.error);
        setDeleting(false);
        setShowDeleteModal(false);
        return;
      }

      setSuccess("Hero section deleted successfully! Default video will be used.");
      setDeleting(false);
      setShowDeleteModal(false);
      setHeroImage(null);
      setCurrentHeroUrl("");
      setHeroImagePreview(null);
      
      setTimeout(() => {
        setSuccess(null);
      }, 3000);
    } catch (err: any) {
      console.error("Error deleting hero section:", err);
      setError(err.message || "Failed to delete hero section");
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
        <div className="text-xl">Loading hero section...</div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen"
      style={{ backgroundColor: "#FFFDF7", marginLeft: "256px" }}
    >
      {/* Delete Modal */}
      {showDeleteModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center"
          style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
          onClick={handleDeleteCancel}
        >
          <div
            className="bg-white rounded-lg shadow-xl animate-scale-in"
            style={{ width: "500px", maxWidth: "90vw", padding: "32px" }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-center mb-4">
              <div
                className="rounded-full bg-red-100 flex items-center justify-center"
                style={{ width: "64px", height: "64px" }}
              >
                <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
            </div>
            <h3 className="text-center mb-3" style={{ fontFamily: "Poppins, sans-serif", fontSize: "24px", fontWeight: "600", color: "#1D1A1A" }}>
              Delete Hero Image?
            </h3>
            <p className="text-center mb-6" style={{ fontFamily: "Helvetica Neue, sans-serif", fontSize: "16px", color: "#666", lineHeight: "1.5" }}>
              Are you sure you want to delete the hero image? The default video will be used instead.
            </p>
            <div className="flex gap-3 justify-center">
              <button onClick={handleDeleteCancel} disabled={deleting} className="px-6 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition-colors disabled:opacity-50" style={{ fontFamily: "Helvetica Neue, sans-serif", fontSize: "16px", minWidth: "120px" }}>
                Cancel
              </button>
              <button onClick={handleDeleteConfirm} disabled={deleting} className="px-6 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors disabled:opacity-50" style={{ fontFamily: "Helvetica Neue, sans-serif", fontSize: "16px", minWidth: "120px" }}>
                {deleting ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast Notifications */}
      {error && (
        <div className="fixed z-50 animate-slide-in" style={{ top: "24px", right: "24px", width: "400px", maxWidth: "calc(100vw - 48px)" }}>
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded shadow-lg flex items-start justify-between gap-3">
            <div className="flex items-start gap-3 flex-1">
              <svg className="w-6 h-6 text-red-500 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              <p style={{ fontFamily: "Helvetica Neue, sans-serif", fontSize: "15px", lineHeight: "1.5" }}>{error}</p>
            </div>
            <button onClick={() => setError(null)} className="shrink-0 text-red-500 hover:text-red-700 transition-colors" style={{ fontSize: "20px", fontWeight: "bold", width: "24px", height: "24px", display: "flex", alignItems: "center", justifyContent: "center" }} aria-label="Close">×</button>
          </div>
        </div>
      )}

      {success && (
        <div className="fixed z-50 animate-slide-in" style={{ top: "24px", right: "24px", width: "400px", maxWidth: "calc(100vw - 48px)" }}>
          <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 rounded shadow-lg flex items-start justify-between gap-3">
            <div className="flex items-start gap-3 flex-1">
              <svg className="w-6 h-6 text-green-500 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <p style={{ fontFamily: "Helvetica Neue, sans-serif", fontSize: "15px", lineHeight: "1.5" }}>{success}</p>
            </div>
            <button onClick={() => setSuccess(null)} className="shrink-0 text-green-500 hover:text-green-700 transition-colors" style={{ fontSize: "20px", fontWeight: "bold", width: "24px", height: "24px", display: "flex", alignItems: "center", justifyContent: "center" }} aria-label="Close">×</button>
          </div>
        </div>
      )}

      {/* Navigator */}
      <div style={{ fontFamily: "Poppins, sans-serif", fontWeight: "700", fontSize: "24px", paddingLeft: "45px", paddingRight: "45px", paddingTop: "60px", marginBottom: "75px" }}>
        <div className="flex items-center gap-2 text-[#1D1A1A]">
          <span>Website Adjustment</span>
          <span className="text-[#1D1A1A]">/</span>
          <Link href="/dashboard-home" className="hover:underline">Home</Link>
        </div>
      </div>

      {/* Hero Section */}
      <div style={{ paddingLeft: "45px", paddingRight: "45px", paddingBottom: "60px" }}>
        <div className="flex items-center justify-between" style={{ marginBottom: "35px" }}>
          <h2 style={{ fontFamily: "Poppins, sans-serif", fontWeight: "500", fontSize: "24px", color: "#1D1A1A" }}>Hero Section</h2>
          <div className="flex gap-4">
            {currentHeroUrl && (
              <button onClick={handleDeleteClick} disabled={loading || deleting} className="px-6 bg-red-500 text-white rounded hover:bg-red-600 transition-colors disabled:opacity-50" style={{ fontFamily: "Helvetica Neue, sans-serif", fontSize: "18px", width: "200px", height: "40px" }}>
                Delete
              </button>
            )}
            <button onClick={handleUpload} disabled={loading || deleting || !heroImage} className="px-6 bg-[#4A90E2] text-white rounded hover:bg-[#357ABD] transition-colors disabled:opacity-50 disabled:cursor-not-allowed" style={{ fontFamily: "Helvetica Neue, sans-serif", fontSize: "18px", width: "200px", height: "40px" }}>
              {loading ? "Uploading..." : "Upload"}
            </button>
          </div>
        </div>

        <p className="mb-4" style={{ fontFamily: "Helvetica Neue, sans-serif", fontSize: "16px", color: "#666" }}>
          {currentHeroUrl ? "Current Hero Section is displayed. Delete it to use the default video." : "No custom hero image. Default video will be used on the homepage."}
        </p>

        {/* Hidden File Input - Always in DOM */}
        <input type="file" id="heroFileInput" accept="image/jpeg,image/jpg,image/png" onChange={handleFileInput} disabled={loading || deleting} className="hidden" />
        
        <div onDragOver={handleDragOver} onDragLeave={handleDragLeave} onDrop={handleDrop} className={`border-2 border-dashed rounded-lg flex flex-col items-center justify-center ${isDragging ? "border-[#4A90E2] bg-blue-50" : "border-[#EAEAEA] bg-white"} ${loading || deleting ? "opacity-50 pointer-events-none" : ""}`} style={{ width: "100%", height: "50vh", transition: "all 0.3s ease", position: "relative" }}>
          {heroImagePreview ? (
            <div className="relative w-full h-full">
              <img src={heroImagePreview} alt="Hero Preview" className="w-full h-full object-contain p-4" />
              {!loading && !deleting && (
                <button
                  onClick={handleEditImageClick}
                  className="absolute bg-[#FFC700] text-white rounded-lg px-3 py-2 flex items-center gap-2 hover:bg-[#E6B300] transition-colors shadow-md"
                  style={{ top: "10px", right: "10px", zIndex: 10 }}
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
              <Image src="/dashboard/upload.svg" alt="Upload" width={60} height={60} className="mb-4" />
              <p style={{ fontFamily: "Helvetica Neue, sans-serif", fontSize: "18px", color: "#1D1A1A", fontWeight: "500", marginBottom: "8px" }}>Choose a file or drag & drop it here</p>
              <p style={{ fontFamily: "Helvetica Neue, sans-serif", fontSize: "14px", color: "#999", marginBottom: "20px" }}>JPEG, JPG, and PNG formats, up to 10MB</p>
              <label htmlFor="heroFileInput" className={`px-6 py-2 border border-[#EAEAEA] rounded transition-colors ${loading || deleting ? "cursor-not-allowed opacity-50" : "cursor-pointer hover:bg-gray-50"}`} style={{ fontFamily: "Helvetica Neue, sans-serif", fontSize: "16px", color: "#1D1A1A" }}>Browse File</label>
            </>
          )}
        </div>
      </div>

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

// I love Vibe Coding <3