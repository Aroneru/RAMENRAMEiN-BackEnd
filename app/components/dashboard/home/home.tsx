"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { getHeroSectionAction, updateHeroSectionAction, deleteHeroSectionAction } from "./actions";
import { getSettingAction, updateSettingAction } from "./settings-actions";

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
  const [menuPopupEnabled, setMenuPopupEnabled] = useState(true);
  const [loadingPopupSetting, setLoadingPopupSetting] = useState(false);
  const [showPrice, setShowPrice] = useState(true);
  const [loadingPriceSetting, setLoadingPriceSetting] = useState(false);
  const [instagramEnabled, setInstagramEnabled] = useState(true);
  const [loadingInstagramSetting, setLoadingInstagramSetting] = useState(false);
  const [instagramPostCount, setInstagramPostCount] = useState(5);
  const [loadingInstagramCount, setLoadingInstagramCount] = useState(false);

  useEffect(() => {
    loadHeroSection();
    loadMenuPopupSetting();
    loadShowPriceSetting();
    loadInstagramSettings();
  }, []);

  const loadMenuPopupSetting = async () => {
    try {
      const result = await getSettingAction('menu_popup_enabled');
      if (result.data) {
        setMenuPopupEnabled(result.data.value === 'true');
      }
    } catch (err: unknown) {
      console.error("Error loading menu popup setting:", err);
    }
  };

  const loadShowPriceSetting = async () => {
    try {
      const result = await getSettingAction('menu_show_price');
      if (result.data) {
        setShowPrice(result.data.value === 'true');
      }
    } catch (err: unknown) {
      console.error("Error loading show price setting:", err);
    }
  };

  const loadInstagramSettings = async () => {
    try {
      const enabledResult = await getSettingAction('instagram_gallery_enabled');
      if (enabledResult.data) {
        setInstagramEnabled(enabledResult.data.value === 'true');
      }

      const countResult = await getSettingAction('instagram_post_count');
      if (countResult.data) {
        setInstagramPostCount(parseInt(countResult.data.value) || 5);
      }
    } catch (err: unknown) {
      console.error("Error loading Instagram settings:", err);
    }
  };

  const handleMenuPopupToggle = async () => {
    setLoadingPopupSetting(true);
    setError(null);
    setSuccess(null);

    try {
      const newValue = !menuPopupEnabled;
      const result = await updateSettingAction('menu_popup_enabled', newValue.toString());

      if (result.error) {
        setError(result.error);
        setLoadingPopupSetting(false);
        return;
      }

      setMenuPopupEnabled(newValue);
      setSuccess(`Menu popup ${newValue ? 'enabled' : 'disabled'} successfully!`);
      setLoadingPopupSetting(false);
      
      setTimeout(() => {
        setSuccess(null);
      }, 3000);
    } catch (err: unknown) {
      console.error("Error updating menu popup setting:", err);
      setError((err as Error).message || "Failed to update menu popup setting");
      setLoadingPopupSetting(false);
    }
  };

  const handleShowPriceToggle = async () => {
    setLoadingPriceSetting(true);
    setError(null);
    setSuccess(null);

    try {
      const newValue = !showPrice;
      const result = await updateSettingAction('menu_show_price', newValue.toString());

      if (result.error) {
        setError(result.error);
        setLoadingPriceSetting(false);
        return;
      }

      setShowPrice(newValue);
      setSuccess(`Menu prices ${newValue ? 'shown' : 'hidden'} successfully!`);
      setLoadingPriceSetting(false);
      
      setTimeout(() => {
        setSuccess(null);
      }, 3000);
    } catch (err: unknown) {
      console.error("Error updating show price setting:", err);
      setError((err as Error).message || "Failed to update show price setting");
      setLoadingPriceSetting(false);
    }
  };

  const handleInstagramToggle = async () => {
    setLoadingInstagramSetting(true);
    setError(null);
    setSuccess(null);

    try {
      const newValue = !instagramEnabled;
      const result = await updateSettingAction('instagram_gallery_enabled', newValue.toString());

      if (result.error) {
        setError(result.error);
        setLoadingInstagramSetting(false);
        return;
      }

      setInstagramEnabled(newValue);
      setSuccess(`Instagram gallery ${newValue ? 'enabled' : 'disabled'} successfully!`);
      setLoadingInstagramSetting(false);
      
      setTimeout(() => {
        setSuccess(null);
      }, 3000);
    } catch (err: unknown) {
      console.error("Error updating Instagram setting:", err);
      setError((err as Error).message || "Failed to update Instagram setting");
      setLoadingInstagramSetting(false);
    }
  };

  const handleInstagramCountChange = async (count: number) => {
    if (count < 1 || count > 10) return;
    
    setLoadingInstagramCount(true);
    setError(null);
    setSuccess(null);

    try {
      const result = await updateSettingAction('instagram_post_count', count.toString());

      if (result.error) {
        setError(result.error);
        setLoadingInstagramCount(false);
        return;
      }

      setInstagramPostCount(count);
      setSuccess(`Instagram post count updated to ${count}!`);
      setLoadingInstagramCount(false);
      
      setTimeout(() => {
        setSuccess(null);
      }, 3000);
    } catch (err: unknown) {
      console.error("Error updating Instagram count:", err);
      setError((err as Error).message || "Failed to update Instagram count");
      setLoadingInstagramCount(false);
    }
  };
  
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
    } catch (err: unknown) {
      console.error("Error loading hero section:", err);
      setError((err as Error).message || "Failed to load hero section");
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
    } catch (err: unknown) {
      console.error("Error uploading hero section:", err);
      setError((err as Error).message || "Failed to upload hero section");
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
    } catch (err: unknown) {
      console.error("Error deleting hero section:", err);
      setError((err as Error).message || "Failed to delete hero section");
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
        className="min-h-screen flex items-center justify-center lg:ml-64 ml-0"
        style={{ backgroundColor: "#FFFDF7" }}
      >
        <div className="text-xl" style={{ color: "#1D1A1A" }}>Loading hero section...</div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen lg:ml-64 ml-0"
      style={{ backgroundColor: "#FFFDF7" }}
    >
      {/* Delete Modal */}
      {showDeleteModal && (
        <div
          className="fixed inset-0 z-60 flex items-center justify-center p-4"
          style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
          onClick={handleDeleteCancel}
        >
          <div
            className="bg-white rounded-lg shadow-xl animate-scale-in overflow-hidden w-full max-w-[400px] p-6"
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
      <div className="px-4 md:px-[45px] pt-20 md:pt-[60px] mb-8 md:mb-[75px]" style={{ fontFamily: "Poppins, sans-serif", fontWeight: "700", fontSize: "clamp(18px, 4vw, 24px)" }}>
        <div className="flex items-center gap-2 text-[#1D1A1A]">
          <span>Website Adjustment</span>
          <span className="text-[#1D1A1A]">/</span>
          <Link href="/dashboard-home" className="hover:underline">Home</Link>
        </div>
      </div>

      {/* Menu Settings Toggles */}
      <div className="px-4 md:px-[45px] pb-8">
        <div className="bg-white rounded-lg shadow-sm border border-[#EAEAEA] divide-y divide-gray-200">
          {/* Menu Popup Toggle */}
          <div className="p-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-lg font-semibold mb-1" style={{ fontFamily: "Poppins, sans-serif", color: "#1D1A1A" }}>
                  Menu Popup
                </h3>
                <p className="text-sm" style={{ fontFamily: "Helvetica Neue, sans-serif", color: "#666" }}>
                  Enable or disable popup details when clicking menu items on the company profile menu page
                </p>
              </div>
              <button
                onClick={handleMenuPopupToggle}
                disabled={loadingPopupSetting}
                className={`relative inline-flex h-10 w-20 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-[#4A90E2] focus:ring-offset-2 ${
                  menuPopupEnabled ? 'bg-[#4A90E2]' : 'bg-gray-300'
                } ${loadingPopupSetting ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
              >
                <span
                  className={`inline-block h-8 w-8 transform rounded-full bg-white shadow-lg transition-transform ${
                    menuPopupEnabled ? 'translate-x-11' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
            <div className="mt-3 flex items-center gap-2">
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                menuPopupEnabled ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
              }`} style={{ fontFamily: "Helvetica Neue, sans-serif" }}>
                {menuPopupEnabled ? 'Enabled' : 'Disabled'}
              </span>
            </div>
          </div>

          {/* Show Price Toggle */}
          <div className="p-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-lg font-semibold mb-1" style={{ fontFamily: "Poppins, sans-serif", color: "#1D1A1A" }}>
                  Show Menu Prices
                </h3>
                <p className="text-sm" style={{ fontFamily: "Helvetica Neue, sans-serif", color: "#666" }}>
                  Display or hide prices for menu items on the company profile menu page
                </p>
              </div>
              <button
                onClick={handleShowPriceToggle}
                disabled={loadingPriceSetting}
                className={`relative inline-flex h-10 w-20 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-[#4A90E2] focus:ring-offset-2 ${
                  showPrice ? 'bg-[#4A90E2]' : 'bg-gray-300'
                } ${loadingPriceSetting ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
              >
                <span
                  className={`inline-block h-8 w-8 transform rounded-full bg-white shadow-lg transition-transform ${
                    showPrice ? 'translate-x-11' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
            <div className="mt-3 flex items-center gap-2">
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                showPrice ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
              }`} style={{ fontFamily: "Helvetica Neue, sans-serif" }}>
                {showPrice ? 'Visible' : 'Hidden'}
              </span>
            </div>
          </div>

          {/* Instagram Gallery Settings */}
          <div className="p-6 border-t border-gray-200">
            <h3 className="text-lg font-semibold mb-4" style={{ fontFamily: "Poppins, sans-serif", color: "#1D1A1A" }}>
              Instagram Gallery
            </h3>
            <p className="text-sm mb-6" style={{ fontFamily: "Helvetica Neue, sans-serif", color: "#666" }}>
              Control how Instagram posts appear in the gallery section on your homepage.
            </p>
            
            {/* Enable/Disable Toggle */}
            <div className="bg-gray-50 rounded-lg p-4 mb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                    instagramEnabled ? 'bg-blue-100' : 'bg-gray-200'
                  }`}>
                    <svg xmlns="http://www.w3.org/2000/svg" className={`w-6 h-6 ${
                      instagramEnabled ? 'text-[#4A90E2]' : 'text-gray-400'
                    }`} fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                    </svg>
                  </div>
                  <div>
                    <p className="font-medium text-sm" style={{ fontFamily: "Helvetica Neue, sans-serif", color: "#1D1A1A" }}>
                      Instagram Feed
                    </p>
                    <p className="text-xs text-gray-500" style={{ fontFamily: "Helvetica Neue, sans-serif" }}>
                      {instagramEnabled ? 'Showing live Instagram posts' : 'Using default images'}
                    </p>
                  </div>
                </div>
                <button
                  onClick={handleInstagramToggle}
                  disabled={loadingInstagramSetting}
                  className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-[#4A90E2] focus:ring-offset-2 ${
                    instagramEnabled ? 'bg-[#4A90E2]' : 'bg-gray-300'
                  } ${loadingInstagramSetting ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                >
                  <span
                    className={`inline-block h-6 w-6 transform rounded-full bg-white shadow-lg transition-transform ${
                      instagramEnabled ? 'translate-x-7' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            </div>
            
            {/* Post Count Slider */}
            {instagramEnabled && (
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <label className="text-sm font-medium" style={{ fontFamily: "Helvetica Neue, sans-serif", color: "#1D1A1A" }}>
                    Number of Posts
                  </label>
                  <div className="flex items-center gap-2">
                    <span className="text-2xl font-bold text-[#4A90E2]" style={{ fontFamily: "Poppins, sans-serif" }}>
                      {instagramPostCount}
                    </span>
                    <span className="text-xs text-gray-500" style={{ fontFamily: "Helvetica Neue, sans-serif" }}>
                      posts
                    </span>
                  </div>
                </div>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={instagramPostCount}
                  onChange={(e) => handleInstagramCountChange(parseInt(e.target.value))}
                  disabled={loadingInstagramCount}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  style={{ 
                    accentColor: '#4A90E2',
                    background: `linear-gradient(to right, #4A90E2 0%, #4A90E2 ${((instagramPostCount - 1) / 9) * 100}%, #E5E7EB ${((instagramPostCount - 1) / 9) * 100}%, #E5E7EB 100%)`
                  }}
                />
                <div className="flex justify-between text-xs text-gray-400 mt-2" style={{ fontFamily: "Helvetica Neue, sans-serif" }}>
                  <span>1</span>
                  <span>10</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <div className="px-4 md:px-[45px] pb-10">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-6 md:mb-[35px]">
          <h2 className="text-xl md:text-2xl" style={{ fontFamily: "Poppins, sans-serif", fontWeight: "500", color: "#1D1A1A" }}>Hero Section</h2>
          <div className="flex gap-2 w-full sm:w-auto">
            {currentHeroUrl && (
              <button onClick={handleDeleteClick} disabled={loading || deleting} className="flex-1 sm:flex-none px-4 sm:px-6 bg-red-500 text-white rounded hover:bg-red-600 transition-colors disabled:opacity-50" style={{ fontFamily: "Helvetica Neue, sans-serif", fontSize: "16px", height: "40px", minWidth: "100px" }}>
                Delete
              </button>
            )}
            <button onClick={handleUpload} disabled={loading || deleting || !heroImage} className="flex-1 sm:flex-none px-4 sm:px-6 bg-[#4A90E2] text-white rounded hover:bg-[#357ABD] transition-colors disabled:opacity-50 disabled:cursor-not-allowed" style={{ fontFamily: "Helvetica Neue, sans-serif", fontSize: "16px", height: "40px", minWidth: "100px" }}>
              {loading ? "Uploading..." : "Upload"}
            </button>
          </div>
        </div>

        <p className="mb-4 text-sm md:text-base" style={{ fontFamily: "Helvetica Neue, sans-serif", color: "#666" }}>
          {currentHeroUrl ? "Current Hero Section is displayed. Delete it to use the default video." : "No custom hero image. Default video will be used on the homepage."}
        </p>

        {/* Hidden File Input - Always in DOM */}
        <input type="file" id="heroFileInput" accept="image/jpeg,image/jpg,image/png" onChange={handleFileInput} disabled={loading || deleting} className="hidden" />
        
        <div onDragOver={handleDragOver} onDragLeave={handleDragLeave} onDrop={handleDrop} className={`border-2 border-dashed rounded-lg flex flex-col items-center justify-center ${isDragging ? "border-[#4A90E2] bg-blue-50" : "border-[#EAEAEA] bg-white"} ${loading || deleting ? "opacity-50 pointer-events-none" : ""}`} style={{ width: "100%", height: "50vh", minHeight: "300px", transition: "all 0.3s ease", position: "relative" }}>
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
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/dashboard/upload.svg" alt="Upload" width={60} height={60} className="mb-4" />
              <p className="text-center px-4" style={{ fontFamily: "Helvetica Neue, sans-serif", fontSize: "16px", color: "#1D1A1A", fontWeight: "500", marginBottom: "8px" }}>Choose a file or drag & drop it here</p>
              <p className="text-center px-4" style={{ fontFamily: "Helvetica Neue, sans-serif", fontSize: "14px", color: "#999", marginBottom: "20px" }}>JPEG, JPG, and PNG formats, up to 10MB</p>
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