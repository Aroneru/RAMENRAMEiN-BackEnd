"use client";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { addNewsItemAction } from "./actions";

export default function AddNewsDashboard() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [body, setBody] = useState("");
  const [category, setCategory] = useState("general");
  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleThumbnailChange = (file: File) => {
    if (file && file.type.match(/^image\//)) {
      setThumbnail(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setThumbnailPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleThumbnailChange(file);
    }
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
    // Validation
    if (!title.trim()) {
      setError("Please enter news title");
      return;
    }
    if (!body.trim()) {
      setError("Please enter news content");
      return;
    }
    if (!thumbnail) {
      setError("Please upload a thumbnail");
      return;
    }

    setError(null);
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("title", title.trim());
      formData.append("description", description.trim());
      formData.append("body", body.trim());
      formData.append("category", category.trim());
      formData.append("thumbnail", thumbnail);
      formData.append('isPublished', 'true');

      const result = await addNewsItemAction(formData);

      if (result.error) {
        setError(result.error);
        setLoading(false);
        return;
      }

      router.push('/dashboard-news');
    } catch (err: any) {
      console.error("Error adding news:", err);
      setError(err.message || "Failed to add news");
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen"
      style={{ backgroundColor: "#FFFDF7", marginLeft: "256px" }}
    >
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
          <span>Add News</span>
        </div>
      </div>

      {/* Add News Form */}
      <div
        style={{
          paddingLeft: "45px",
          paddingRight: "45px",
          paddingBottom: "40px",
        }}
      >

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded max-w-4xl">
            {error}
          </div>
        )}

        {/* Form Container */}
        <div className="flex gap-6">
          {/* Left Side - Title and Body */}
          <div style={{ flex: "1" }}>
            {/* Title Field */}
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
                className="w-full border border-[#EAEAEA] rounded px-4 py-3 bg-white"
                style={{
                  fontFamily: "Helvetica Neue, sans-serif",
                  fontSize: "18px",
                  color: "#1D1A1A",
                }}
              />
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
                placeholder="Insert news description (summary)"
                rows={2}
                className="w-full border border-[#EAEAEA] rounded px-4 py-3 bg-white resize-y"
                style={{
                  fontFamily: "Helvetica Neue, sans-serif",
                  fontSize: "18px",
                  color: "#1D1A1A",
                  minHeight: "80px",
                }}
              />
            </div>

            {/* Content Field */}
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
                className="w-full border border-[#EAEAEA] rounded px-4 py-3 bg-white resize-y"
                style={{
                  fontFamily: "Helvetica Neue, sans-serif",
                  fontSize: "18px",
                  color: "#1D1A1A",
                  minHeight: "150px",
                }}
              />
            </div>
          </div>

          {/* Right Side - Thumbnail Upload */}
          <div style={{ flex: "1" }}>
            <label
              style={{
                fontFamily: "Helvetica Neue, sans-serif",
                fontSize: "18px",
                color: "#1D1A1A",
                display: "block",
                marginBottom: "12px",
              }}
            >
              Thumbnail <span className="text-red-500">*</span>
            </label>
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`border-2 border-dashed rounded-lg flex flex-col items-center justify-center ${
                isDragging
                  ? "border-[#4A90E2] bg-blue-50"
                  : "border-[#EAEAEA] bg-white"
              }`}
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
                  <button
                    onClick={() => {
                      setThumbnail(null);
                      setThumbnailPreview(null);
                    }}
                    className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-red-600"
                  >
                    ×
                  </button>
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
                    JPEG, PNG, PDG, and MP4 formats, up to 10MB
                  </p>
                  <input
                    type="file"
                    id="fileInput"
                    accept="image/*"
                    onChange={handleFileInput}
                    className="hidden"
                  />
                  <label
                    htmlFor="fileInput"
                    className="px-6 py-2 border border-[#EAEAEA] rounded cursor-pointer hover:bg-gray-50 transition-colors"
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
        </div>

        {/* Submit Button */}
        <div className="flex justify-end mt-8 gap-4">
          <Link href="/dashboard-news">
            <button
              disabled={loading}
              className="px-8 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 transition-colors disabled:opacity-50"
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
            disabled={loading}
            className="px-8 bg-[#4A90E2] text-white rounded hover:bg-[#357ABD] transition-colors disabled:opacity-50"
            style={{
              fontFamily: "Helvetica Neue, sans-serif",
              fontSize: "18px",
              height: "45px",
              minWidth: "150px",
            }}
          >
            {loading ? "Submitting..." : "Submit"}
          </button>
        </div>
      </div>
    </div>
  );
}