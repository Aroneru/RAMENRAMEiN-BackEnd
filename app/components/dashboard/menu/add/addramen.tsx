"use client";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { addMenuItemAction } from "./actions";

export default function AddRamenDashboard() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  
  // New special ramen fields
  const [isSpecialRamen, setIsSpecialRamen] = useState(false);
  const [priceForMaxPrice, setPriceForMaxPrice] = useState("");
  const [imageForMaxPrice, setImageForMaxPrice] = useState<File | null>(null);
  const [imageForMaxPricePreview, setImageForMaxPricePreview] = useState<string | null>(null);
  const [isDraggingMaxPrice, setIsDraggingMaxPrice] = useState(false);

  const handleImageChange = (file: File, isMaxPrice: boolean = false) => {
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
    
    if (isMaxPrice) {
      setImageForMaxPrice(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageForMaxPricePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>, isMaxPrice: boolean = false) => {
    const file = e.target.files?.[0];
    if (file) {
      handleImageChange(file, isMaxPrice);
    }
  };

  const handleDragOver = (e: React.DragEvent, isMaxPrice: boolean = false) => {
    e.preventDefault();
    if (isMaxPrice) {
      setIsDraggingMaxPrice(true);
    } else {
      setIsDragging(true);
    }
  };

  const handleDragLeave = (e: React.DragEvent, isMaxPrice: boolean = false) => {
    e.preventDefault();
    if (isMaxPrice) {
      setIsDraggingMaxPrice(false);
    } else {
      setIsDragging(false);
    }
  };

  const handleDrop = (e: React.DragEvent, isMaxPrice: boolean = false) => {
    e.preventDefault();
    if (isMaxPrice) {
      setIsDraggingMaxPrice(false);
    } else {
      setIsDragging(false);
    }
    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleImageChange(file, isMaxPrice);
    }
  };

  const handleSubmit = async () => {
    // Validation
    if (!name.trim()) {
      setError("Please enter ramen name");
      setSuccess(null);
      return;
    }
    if (!image) {
      setError("Please upload an image");
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
    
    // Validate max price fields if provided
    if (priceForMaxPrice && parseFloat(priceForMaxPrice) < parseFloat(price)) {
      setError("Maximum price must be greater than or equal to base price");
      setSuccess(null);
      return;
    }
    
    if (priceForMaxPrice && !imageForMaxPrice) {
      setError("Please upload image for maximum price variant");
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
      formData.append('category', 'ramen');
      formData.append('image', image);
      
      // Add special ramen fields
      formData.append('isSpecialRamen', isSpecialRamen.toString());
      if (priceForMaxPrice) {
        formData.append('priceForMaxPrice', priceForMaxPrice);
      }
      if (imageForMaxPrice) {
        formData.append('imageForMaxPrice', imageForMaxPrice);
      }

      // Call server action
      const result = await addMenuItemAction(formData);

      if (result.error) {
        setError(result.error);
        setLoading(false);
        return;
      }

      // Success
      setSuccess("Ramen added successfully!");
      setLoading(false);
      
      // Redirect after 1.5 seconds
      setTimeout(() => {
        router.push('/dashboard-menu');
      }, 1500);
    } catch (err: unknown) {
      console.error("Error adding ramen:", err);
      setError((err as Error).message || "Failed to add ramen");
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen lg:ml-64 ml-0"
      style={{ backgroundColor: "#FFFDF7" }}
    >
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
        className="px-4 md:px-[45px] pt-20 md:pt-[60px] mb-8 md:mb-[75px]"
        style={{
          fontFamily: "Poppins, sans-serif",
          fontWeight: "700",
          fontSize: "clamp(18px, 4vw, 24px)",
        }}
      >
        <div className="flex items-center gap-2 text-[#1D1A1A]">
          <span>Website Adjustment</span>
          <span className="text-[#1D1A1A]">/</span>
          <Link href="/dashboard-menu" className="hover:underline">
            Menu
          </Link>
          <span className="text-[#1D1A1A]">/</span>
          <span>Add Ramen</span>
        </div>
      </div>

      {/* Add Ramen Form - Centered */}
      <div className="px-4 md:px-[45px] pb-10">
        {/* Section Title - Centered */}
        <h2
          className="text-center text-xl md:text-2xl mb-6 md:mb-[35px]"
          style={{
            fontFamily: "Poppins, sans-serif",
            fontWeight: "500",
            color: "#1D1A1A",
          }}
        >
          Add Ramen Menu
        </h2>
        
        {/* Form Container - Centered with max-width */}
        <div className="mx-auto" style={{ maxWidth: "800px" }}>
          {/* Name Field */}
          <div className="mb-6">
            <label
              style={{
                fontFamily: "Helvetica Neue, sans-serif",
                fontSize: "clamp(16px, 3vw, 18px)",
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
              placeholder="Insert ramen name"
              disabled={loading}
              className="w-full border border-[#EAEAEA] rounded px-4 py-3 bg-white disabled:opacity-50"
              style={{
                fontFamily: "Helvetica Neue, sans-serif",
                fontSize: "clamp(16px, 3vw, 18px)",
                color: "#1D1A1A",
              }}
            />
          </div>

          {/* Image Upload */}
          <div className="mb-6">
            <label
              style={{
                fontFamily: "Helvetica Neue, sans-serif",
                fontSize: "clamp(16px, 3vw, 18px)",
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
              } ${loading ? "opacity-50 pointer-events-none" : ""}`}
              style={{
                height: "clamp(250px, 50vw, 330px)",
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
                  {!loading && (
                    <button
                      onClick={() => {
                        setImage(null);
                        setImagePreview(null);
                      }}
                      className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-red-600 transition-colors"
                    >
                      ×
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
                    className="text-center px-4"
                    style={{
                      fontFamily: "Helvetica Neue, sans-serif",
                      fontSize: "clamp(14px, 3vw, 18px)",
                      color: "#1D1A1A",
                      fontWeight: "500",
                      marginBottom: "8px",
                    }}
                  >
                    Choose a file or drag & drop it here
                  </p>
                  <p
                    className="text-center px-4"
                    style={{
                      fontFamily: "Helvetica Neue, sans-serif",
                      fontSize: "clamp(12px, 2.5vw, 14px)",
                      color: "#999",
                      marginBottom: "20px",
                    }}
                  >
                    JPEG, JPG, and PNG formats, up to 10MB
                  </p>
                  <input
                    type="file"
                    id="fileInput"
                    accept="image/jpeg,image/jpg,image/png"
                    onChange={handleFileInput}
                    disabled={loading}
                    className="hidden"
                  />
                  <label
                    htmlFor="fileInput"
                    className={`px-6 py-2 border border-[#EAEAEA] rounded transition-colors ${
                      loading
                        ? "cursor-not-allowed opacity-50"
                        : "cursor-pointer hover:bg-gray-50"
                    }`}
                    style={{
                      fontFamily: "Helvetica Neue, sans-serif",
                      fontSize: "clamp(14px, 2.5vw, 16px)",
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
                fontSize: "clamp(16px, 3vw, 18px)",
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
              placeholder="Insert ramen description"
              rows={6}
              disabled={loading}
              className="w-full border border-[#EAEAEA] rounded px-4 py-3 bg-white resize-y disabled:opacity-50"
              style={{
                fontFamily: "Helvetica Neue, sans-serif",
                fontSize: "clamp(16px, 3vw, 18px)",
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
                fontSize: "clamp(16px, 3vw, 18px)",
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
              disabled={loading}
              min="0"
              step="1000"
              className="w-full border border-[#EAEAEA] rounded px-4 py-3 bg-white disabled:opacity-50"
              style={{
                fontFamily: "Helvetica Neue, sans-serif",
                fontSize: "clamp(16px, 3vw, 18px)",
                color: "#1D1A1A",
              }}
            />
          </div>

          {/* Special Ramen Toggle */}
          <div className="mb-6">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={isSpecialRamen}
                onChange={(e) => setIsSpecialRamen(e.target.checked)}
                disabled={loading}
                className="w-5 h-5 cursor-pointer"
              />
              <span
                style={{
                  fontFamily: "Helvetica Neue, sans-serif",
                  fontSize: "clamp(16px, 3vw, 18px)",
                  color: "#1D1A1A",
                }}
              >
                Mark as Special Ramen (Featured)
              </span>
            </label>
            <p
              style={{
                fontFamily: "Helvetica Neue, sans-serif",
                fontSize: "clamp(12px, 2.5vw, 14px)",
                color: "#999",
                marginTop: "8px",
                marginLeft: "32px",
              }}
            >
              Special ramen will be highlighted on the menu
            </p>
          </div>

          {/* Maximum Price Variant Section */}
          <div className="mb-6 p-6 border-2 border-dashed border-[#EAEAEA] rounded-lg">
            <h3
              className="mb-4"
              style={{
                fontFamily: "Poppins, sans-serif",
                fontSize: "clamp(16px, 3vw, 18px)",
                fontWeight: "600",
                color: "#1D1A1A",
              }}
            >
              Maximum Price Variant (Optional)
            </h3>
            <p
              className="mb-4"
              style={{
                fontFamily: "Helvetica Neue, sans-serif",
                fontSize: "clamp(12px, 2.5vw, 14px)",
                color: "#666",
              }}
            >
              Add details for a larger size or premium variant with a higher price
            </p>

            {/* Max Price */}
            <div className="mb-4">
              <label
                style={{
                  fontFamily: "Helvetica Neue, sans-serif",
                  fontSize: "clamp(16px, 3vw, 18px)",
                  color: "#1D1A1A",
                  display: "block",
                  marginBottom: "12px",
                }}
              >
                Maximum Price (Rp)
              </label>
              <input
                type="number"
                value={priceForMaxPrice}
                onChange={(e) => setPriceForMaxPrice(e.target.value)}
                placeholder="Insert maximum price (optional)"
                disabled={loading}
                min="0"
                step="1000"
                className="w-full border border-[#EAEAEA] rounded px-4 py-3 bg-white disabled:opacity-50"
                style={{
                  fontFamily: "Helvetica Neue, sans-serif",
                  fontSize: "clamp(16px, 3vw, 18px)",
                  color: "#1D1A1A",
                }}
              />
            </div>

            {/* Max Price Image Upload */}
            {priceForMaxPrice && (
              <div>
                <label
                  style={{
                    fontFamily: "Helvetica Neue, sans-serif",
                    fontSize: "clamp(16px, 3vw, 18px)",
                    color: "#1D1A1A",
                    display: "block",
                    marginBottom: "12px",
                  }}
                >
                  Image for Maximum Price <span className="text-red-500">*</span>
                </label>
                <div
                  onDragOver={(e) => handleDragOver(e, true)}
                  onDragLeave={(e) => handleDragLeave(e, true)}
                  onDrop={(e) => handleDrop(e, true)}
                  className={`border-2 border-dashed rounded-lg flex flex-col items-center justify-center ${
                    isDraggingMaxPrice
                      ? "border-[#4A90E2] bg-blue-50"
                      : "border-[#EAEAEA] bg-white"
                  } ${loading ? "opacity-50 pointer-events-none" : ""}`}
                  style={{
                    height: "clamp(200px, 40vw, 280px)",
                    transition: "all 0.3s ease",
                  }}
                >
                  {imageForMaxPricePreview ? (
                    <div className="relative w-full h-full">
                      <img
                        src={imageForMaxPricePreview}
                        alt="Max Price Preview"
                        className="w-full h-full object-contain p-4"
                      />
                      {!loading && (
                        <button
                          onClick={() => {
                            setImageForMaxPrice(null);
                            setImageForMaxPricePreview(null);
                          }}
                          className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-red-600 transition-colors"
                        >
                          ×
                        </button>
                      )}
                    </div>
                  ) : (
                    <>
                      <Image
                        src="/dashboard/upload.svg"
                        alt="Upload"
                        width={50}
                        height={50}
                        className="mb-3"
                      />
                      <p
                        className="text-center px-4"
                        style={{
                          fontFamily: "Helvetica Neue, sans-serif",
                          fontSize: "clamp(14px, 3vw, 16px)",
                          color: "#1D1A1A",
                          fontWeight: "500",
                          marginBottom: "8px",
                        }}
                      >
                        Choose a file or drag & drop it here
                      </p>
                      <p
                        className="text-center px-4"
                        style={{
                          fontFamily: "Helvetica Neue, sans-serif",
                          fontSize: "clamp(12px, 2.5vw, 14px)",
                          color: "#999",
                          marginBottom: "16px",
                        }}
                      >
                        JPEG, JPG, and PNG formats, up to 10MB
                      </p>
                      <input
                        type="file"
                        id="fileInputMaxPrice"
                        accept="image/jpeg,image/jpg,image/png"
                        onChange={(e) => handleFileInput(e, true)}
                        disabled={loading}
                        className="hidden"
                      />
                      <label
                        htmlFor="fileInputMaxPrice"
                        className={`px-6 py-2 border border-[#EAEAEA] rounded transition-colors ${
                          loading
                            ? "cursor-not-allowed opacity-50"
                            : "cursor-pointer hover:bg-gray-50"
                        }`}
                        style={{
                          fontFamily: "Helvetica Neue, sans-serif",
                          fontSize: "clamp(14px, 2.5vw, 16px)",
                          color: "#1D1A1A",
                        }}
                      >
                        Browse File
                      </label>
                    </>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Submit Button */}
          <div className="flex flex-col sm:flex-row justify-end mt-8 gap-3 sm:gap-4">
            <Link href="/dashboard-menu" className="w-full sm:w-auto">
              <button
                disabled={loading}
                className="w-full sm:w-auto px-8 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                style={{
                  fontFamily: "Helvetica Neue, sans-serif",
                  fontSize: "clamp(16px, 3vw, 18px)",
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
              className="w-full sm:w-auto px-8 bg-[#4A90E2] text-white rounded hover:bg-[#357ABD] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                fontFamily: "Helvetica Neue, sans-serif",
                fontSize: "clamp(16px, 3vw, 18px)",
                height: "45px",
                minWidth: "150px",
              }}
            >
              {loading ? "Submitting..." : "Submit"}
            </button>
          </div>
        </div>
      </div>

      {/* Add CSS for animation */}
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
        .animate-slide-in {
          animation: slide-in 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}