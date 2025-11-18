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

      // Redirect back to FAQ dashboard
      router.push('/dashboard-faq');
    } catch (err: any) {
      console.error("Error updating FAQ:", err);
      setError(err.message || "Failed to update FAQ");
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!id) {
      setError('No FAQ ID provided');
      return;
    }

    if (!confirm('Are you sure you want to delete this FAQ? This action cannot be undone.')) {
      return;
    }

    setError(null);
    setDeleting(true);

    try {
      const result = await deleteFaqItemAction(id);

      if (result.error) {
        setError(result.error);
        setDeleting(false);
        return;
      }

      // Redirect back to FAQ dashboard
      router.push('/dashboard-faq');
    } catch (err: any) {
      console.error("Error deleting FAQ:", err);
      setError(err.message || "Failed to delete FAQ");
      setDeleting(false);
    }
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

      {/* Edit FAQ Form */}
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
          Edit Frequently Asked Question
        </h2>
        
        {/* Form Container */}
        <div className="max-w-4xl">
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
              className="w-full border border-[#EAEAEA] rounded px-4 py-3 bg-white"
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
              className="w-full border border-[#EAEAEA] rounded px-4 py-3 bg-white resize-y"
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
              className="w-full border border-[#EAEAEA] rounded px-4 py-3 bg-white"
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
              className="w-full border border-[#EAEAEA] rounded px-4 py-3 bg-white"
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
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded max-w-4xl">
            {error}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex justify-between mt-8 gap-4 max-w-4xl">
          <button
            onClick={handleDelete}
            disabled={loading || deleting}
            className="px-8 bg-red-500 text-white rounded hover:bg-red-600 transition-colors disabled:opacity-50"
            style={{
              fontFamily: "Helvetica Neue, sans-serif",
              fontSize: "18px",
              height: "45px",
              minWidth: "150px",
            }}
          >
            {deleting ? "Deleting..." : "Delete"}
          </button>
          <div className="flex gap-4">
            <Link href="/dashboard-faq">
              <button
                disabled={loading || deleting}
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
              disabled={loading || deleting}
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
    </div>
  );
}
