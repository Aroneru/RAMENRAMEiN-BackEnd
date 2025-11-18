"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getFaqItemAction, updateFaqItemAction, deleteFaqItemAction } from "./actions";

export default function EditFaqDashboard({ id }: { id: string }) {
  const router = useRouter();

  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [category, setCategory] = useState("");
  const [displayOrder, setDisplayOrder] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    if (id) {
      loadFaqData();
    } else {
      setError('No FAQ ID provided');
      setLoadingData(false);
    }
  }, [id]);

  const loadFaqData = async () => {
    if (!id) return;

    try {
      const result = await getFaqItemAction(id);

      if (result.error) {
        setError(result.error);
        setLoadingData(false);
        return;
      }

      if (result.data) {
        setQuestion(result.data.question || '');
        setAnswer(result.data.answer || '');
        setCategory(result.data.category || '');
        setDisplayOrder(result.data.display_order?.toString() || '0');
        setIsActive(result.data.is_active ?? true);
      }

      setLoadingData(false);
    } catch (err: any) {
      console.error("Error loading FAQ:", err);
      setError(err.message || "Failed to load FAQ");
      setLoadingData(false);
    }
  };

  const handleSubmit = async () => {
    if (!id) {
      setError('No FAQ ID provided');
      return;
    }

    setError(null);
    setSuccess(null);
    setLoading(true);

    try {
      // Create FormData
      const formData = new FormData();
      formData.append('question', question);
      formData.append('answer', answer);
      formData.append('category', category);
      formData.append('displayOrder', displayOrder || '0');
      formData.append('isActive', isActive.toString());

      // Call server action
      const result = await updateFaqItemAction(id, formData);

      if (result.error) {
        setError(result.error);
        setLoading(false);
        return;
      }

      // Success
      setSuccess("FAQ updated successfully!");
      setLoading(false);
      
      // Redirect after 1.5 seconds
      setTimeout(() => {
        router.push('/dashboard-faq');
      }, 1500);
    } catch (err: any) {
      console.error("Error updating FAQ:", err);
      setError(err.message || "Failed to update FAQ");
      setLoading(false);
    }
  };

  const handleDeleteClick = () => {
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    if (!id) {
      setError('No FAQ ID provided');
      setShowDeleteModal(false);
      return;
    }

    setError(null);
    setSuccess(null);
    setDeleting(true);

    try {
      const result = await deleteFaqItemAction(id);

      if (result.error) {
        setError(result.error);
        setDeleting(false);
        setShowDeleteModal(false);
        return;
      }

      // Success
      setSuccess("FAQ deleted successfully!");
      setDeleting(false);
      setShowDeleteModal(false);
      
      // Redirect after 1.5 seconds
      setTimeout(() => {
        router.push('/dashboard-faq');
      }, 1500);
    } catch (err: any) {
      console.error("Error deleting FAQ:", err);
      setError(err.message || "Failed to delete FAQ");
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
        <div className="text-xl">Loading FAQ data...</div>
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
              Delete FAQ?
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
              Are you sure you want to delete this FAQ? This action cannot be undone.
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
                className="w-6 h-6 text-red-500 flex-shrink-0"
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
              className="flex-shrink-0 text-red-500 hover:text-red-700 transition-colors"
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
                className="w-6 h-6 text-green-500 flex-shrink-0"
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
              className="flex-shrink-0 text-green-500 hover:text-green-700 transition-colors"
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
          <Link href="/dashboard-faq" className="hover:underline">
            FAQ
          </Link>
          <span className="text-[#1D1A1A]">/</span>
          <span>Edit FAQ</span>
        </div>
      </div>

      {/* Edit FAQ Form - Centered */}
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
          Edit Frequently Asked Question
        </h2>
        
        {/* Form Container - Centered with max-width */}
        <div className="mx-auto" style={{ maxWidth: "800px" }}>
          {/* Question Field */}
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
              Question <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="Insert question"
              disabled={loading || deleting}
              className="w-full border border-[#EAEAEA] rounded px-4 py-3 bg-white disabled:opacity-50"
              style={{
                fontFamily: "Helvetica Neue, sans-serif",
                fontSize: "18px",
                color: "#1D1A1A",
              }}
            />
          </div>

          {/* Answer Field */}
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
              Answer <span className="text-red-500">*</span>
            </label>
            <textarea
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              placeholder="Insert answer"
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

          {/* Category Field */}
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
              Category (Optional)
            </label>
            <input
              type="text"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              placeholder="Insert category (e.g., General, Ordering, Payment)"
              disabled={loading || deleting}
              className="w-full border border-[#EAEAEA] rounded px-4 py-3 bg-white disabled:opacity-50"
              style={{
                fontFamily: "Helvetica Neue, sans-serif",
                fontSize: "18px",
                color: "#1D1A1A",
              }}
            />
          </div>

          {/* Display Order Field */}
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
              Display Order (Optional)
            </label>
            <input
              type="number"
              value={displayOrder}
              onChange={(e) => setDisplayOrder(e.target.value)}
              placeholder="0"
              disabled={loading || deleting}
              className="w-full border border-[#EAEAEA] rounded px-4 py-3 bg-white disabled:opacity-50"
              style={{
                fontFamily: "Helvetica Neue, sans-serif",
                fontSize: "18px",
                color: "#1D1A1A",
              }}
            />
            <p
              style={{
                fontFamily: "Helvetica Neue, sans-serif",
                fontSize: "14px",
                color: "#999",
                marginTop: "8px",
              }}
            >
              Lower numbers appear first (0 = highest priority)
            </p>
          </div>

          {/* Active Status Toggle */}
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
                  checked={isActive}
                  onChange={() => setIsActive(true)}
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
                  Active
                </span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  checked={!isActive}
                  onChange={() => setIsActive(false)}
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
                  Inactive
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
              Inactive FAQs will not be displayed on the website
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
              <Link href="/dashboard-faq">
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