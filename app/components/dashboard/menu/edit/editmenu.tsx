"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { getMenuItemAction, updateMenuItemAction } from "./actions";

interface EditMenuProps {
  category: "ramen" | "topping" | "nyemil" | "minuman";
}

export default function EditMenu({ category }: EditMenuProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get("id");

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [currentImageUrl, setCurrentImageUrl] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isAvailable, setIsAvailable] = useState(true);
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      loadMenuData();
    } else {
      setError("No menu ID provided");
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
        setName(result.data.name || "");
        setDescription(result.data.description || "");
        setPrice(result.data.price?.toString() || "");
        setCurrentImageUrl(result.data.image_url || "");
        setImagePreview(result.data.image_url || null);
        setIsAvailable(result.data.is_available ?? true);
      }

      setLoadingData(false);
    } catch (err: any) {
      console.error("Error loading menu:", err);
      setError(err.message || "Failed to load menu");
      setLoadingData(false);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async () => {
    if (!id) {
      setError("No menu ID provided");
      return;
    }

    setError(null);
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("description", description);
      formData.append("price", price);
      formData.append("currentImageUrl", currentImageUrl);
      formData.append("isAvailable", isAvailable.toString());
      
      if (imageFile) {
        formData.append("image", imageFile);
      }

      const result = await updateMenuItemAction(id, formData);

      if (result.error) {
        setError(result.error);
        setLoading(false);
        return;
      }

      router.push("/dashboard-menu");
    } catch (err: any) {
      console.error("Error updating menu:", err);
      setError(err.message || "Failed to update menu");
      setLoading(false);
    }
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

  const categoryTitle = category.charAt(0).toUpperCase() + category.slice(1);

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
          <span>Edit {categoryTitle}</span>
        </div>
      </div>

      {/* Edit Form */}
      <div
        style={{
          paddingLeft: "45px",
          paddingRight: "45px",
          paddingBottom: "40px",
        }}
      >
        <h2
          style={{
            fontFamily: "Poppins, sans-serif",
            fontWeight: "500",
            fontSize: "24px",
            color: "#1D1A1A",
            marginBottom: "35px",
          }}
        >
          Edit {categoryTitle}
        </h2>

        <div className="max-w-4xl">
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
              placeholder="Insert menu name"
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
              placeholder="Insert description"
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
              Price <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="Insert price"
              className="w-full border border-[#EAEAEA] rounded px-4 py-3 bg-white"
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
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="w-full border border-[#EAEAEA] rounded px-4 py-3 bg-white"
              style={{
                fontFamily: "Helvetica Neue, sans-serif",
                fontSize: "18px",
                color: "#1D1A1A",
              }}
            />
            {imagePreview && (
              <div className="mt-4">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="rounded border border-[#EAEAEA]"
                  style={{ maxWidth: "300px", maxHeight: "300px", objectFit: "contain" }}
                />
              </div>
            )}
          </div>

          {/* Available Status Toggle */}
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
              Status
            </label>
            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  checked={isAvailable}
                  onChange={() => setIsAvailable(true)}
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
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded max-w-4xl">
            {error}
          </div>
        )}

        {/* Submit Button */}
        <div className="flex justify-end mt-8 gap-4 max-w-4xl">
          <Link href="/dashboard-menu">
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
            {loading ? "Updating..." : "Update"}
          </button>
        </div>
      </div>
    </div>
  );
}
