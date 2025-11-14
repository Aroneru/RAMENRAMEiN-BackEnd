"use client";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

export default function EditToppingDashboard() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleImageChange = (file: File) => {
    if (file && file.type.match(/^image\//)) {
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleImageChange(file);
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
      handleImageChange(file);
    }
  };

  const handleSubmit = () => {
    // Handle form submission
    console.log({ name, description, image });
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
          <Link href="/dashboard-menu" className="hover:underline">
            Menu
          </Link>
          <span className="text-[#1D1A1A]">/</span>
          <span>Edit Topping</span>
        </div>
      </div>

      {/* Edit Topping Form */}
      <div
        style={{
          paddingLeft: "45px",
          paddingRight: "45px",
          paddingBottom: "40px",
        }}
      >
        {/* Section Title */}
        <h2
          style={{
            fontFamily: "Poppins, sans-serif",
            fontWeight: "500",
            fontSize: "24px",
            color: "#1D1A1A",
            marginBottom: "35px",
          }}
        >
          Topping
        </h2>

        {/* Form Container */}
        <div className="flex gap-6">
          {/* Left Side - Name and Description */}
          <div style={{ flex: "1" }}>
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
                placeholder="Insert topping name"
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
                placeholder="Insert topping description"
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

          {/* Right Side - Image Upload */}
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
              Image <span className="text-red-500">*</span>
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
              {imagePreview ? (
                <div className="relative w-full h-full">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-full h-full object-contain p-4"
                  />
                  <button
                    onClick={() => {
                      setImage(null);
                      setImagePreview(null);
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
                    JPEG, JPG, and PNG formats, up to 10MB
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
        <div className="flex justify-end mt-8">
          <button
            onClick={handleSubmit}
            className="px-8 text-white rounded transition-colors"
            style={{
              fontFamily: "Helvetica Neue, sans-serif",
              fontSize: "18px",
              height: "45px",
              minWidth: "150px",
              backgroundColor: "#FEB33C",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "#E69F2E";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "#FEB33C";
            }}
          >
            Edit
          </button>
        </div>
      </div>
    </div>
  );
}