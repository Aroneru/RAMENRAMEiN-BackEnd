"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getNewsItemAction, updateNewsItemAction } from "./actions";

interface EditNewsProps {
  id: string;
}

export default function EditNewsDashboard({ id }: EditNewsProps) {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [body, setBody] = useState("");
  const [category, setCategory] = useState("general");
  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const [currentThumbnail, setCurrentThumbnail] = useState("");
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!title.trim() || !description.trim() || !body.trim()) {
      setError("Title, description, and content are required");
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("id", id);
      formData.append("title", title.trim());
      formData.append("description", description.trim());
      formData.append("body", body.trim());
      formData.append("category", category.trim());
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

      router.push("/dashboard-news");
    } catch (err: any) {
      console.error("Error updating news:", err);
      setError(err.message || "Failed to update news");
      setLoading(false);
    }
  };

  if (loadingData) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ backgroundColor: "#FFFDF7", marginLeft: "256px" }}
      >
        <p style={{ fontFamily: "Poppins, sans-serif" }}>Loading...</p>
      </div>
    );
  }

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
          <span>Edit News</span>
        </div>
      </div>

      {/* Edit News Form */}
      <div
        style={{
          paddingLeft: "45px",
          paddingRight: "45px",
          paddingBottom: "40px",
        }}
      >
        {error && (
          <div
            style={{
              backgroundColor: "#F8D7DA",
              color: "#721C24",
              padding: "12px 16px",
              borderRadius: "4px",
              marginBottom: "20px",
              fontFamily: "Poppins, sans-serif",
              fontSize: "14px",
            }}
          >
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
                placeholder="News title"
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
              Thumbnail
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

        {/* Edit Button */}
        <div className="flex justify-end gap-4 mt-8">
          <Link href="/dashboard-news">
            <button
              className="px-8 border border-[#EAEAEA] rounded transition-colors"
              style={{
                fontFamily: "Helvetica Neue, sans-serif",
                fontSize: "18px",
                height: "45px",
                minWidth: "150px",
                color: "#1D1A1A",
                backgroundColor: "white",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "#F5F5F5";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "white";
              }}
            >
              Cancel
            </button>
          </Link>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="px-8 text-white rounded transition-colors"
            style={{
              fontFamily: "Helvetica Neue, sans-serif",
              fontSize: "18px",
              height: "45px",
              minWidth: "150px",
              backgroundColor: loading ? "#D3D3D3" : "#FEB33C",
              cursor: loading ? "not-allowed" : "pointer",
            }}
            onMouseEnter={(e) => {
              if (!loading) {
                e.currentTarget.style.backgroundColor = "#E69F2E";
              }
            }}
            onMouseLeave={(e) => {
              if (!loading) {
                e.currentTarget.style.backgroundColor = "#FEB33C";
              }
            }}
          >
            {loading ? "Updating..." : "Update"}
          </button>
        </div>
      </div>
    </div>
  );
}