"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { addFaqItemAction } from "./actions";

export default function AddFaqDashboard() {
  const router = useRouter();
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [category, setCategory] = useState("");
  const [displayOrder, setDisplayOrder] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSubmit = async () => {
    // Validation
    if (!question.trim()) {
      setError("Please enter question");
      setSuccess(null);
      return;
    }
    if (!answer.trim()) {
      setError("Please enter answer");
      setSuccess(null);
      return;
    }

    setError(null);
    setSuccess(null);
    setLoading(true);

    try {
      // Create FormData
      const formData = new FormData();
      formData.append('question', question.trim());
      formData.append('answer', answer.trim());
      formData.append('category', category);
      formData.append('displayOrder', displayOrder || '0');

      // Call server action
      const result = await addFaqItemAction(formData);

      if (result.error) {
        setError(result.error);
        setLoading(false);
        return;
      }

      // Success
      setSuccess("FAQ added successfully!");
      setLoading(false);
      
      // Redirect after 1.5 seconds
      setTimeout(() => {
        router.push('/dashboard-faq');
      }, 1500);
    } catch (err: unknown) {
      console.error("Error adding FAQ:", err);
      setError((err as Error).message || "Failed to add FAQ");
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
        <div className="flex flex-wrap items-center gap-2 text-[#1D1A1A]">
          <span className="whitespace-nowrap">Website Adjustment</span>
          <span className="text-[#1D1A1A]">/</span>
          <Link href="/dashboard-faq" className="hover:underline whitespace-nowrap">
            FAQ
          </Link>
          <span className="text-[#1D1A1A]">/</span>
          <span className="whitespace-nowrap">Add FAQ</span>
        </div>
      </div>

      {/* Add FAQ Form - Centered */}
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
          Add Frequently Asked Questions (FAQ)
        </h2>
        
        {/* Form Container - Centered with max-width */}
        <div className="mx-auto" style={{ maxWidth: "800px" }}>
          {/* Question Field */}
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
              Question <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="Insert question"
              disabled={loading}
              className="w-full border border-[#EAEAEA] rounded px-4 py-3 bg-white disabled:opacity-50"
              style={{
                fontFamily: "Helvetica Neue, sans-serif",
                fontSize: "clamp(16px, 3vw, 18px)",
                color: "#1D1A1A",
              }}
            />
          </div>

          {/* Answer Field */}
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
              Answer <span className="text-red-500">*</span>
            </label>
            <textarea
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              placeholder="Insert answer"
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

          {/* Category Field */}
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
              Category (Optional)
            </label>
            <input
              type="text"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              placeholder="Insert category (e.g., General, Ordering, Payment)"
              disabled={loading}
              className="w-full border border-[#EAEAEA] rounded px-4 py-3 bg-white disabled:opacity-50"
              style={{
                fontFamily: "Helvetica Neue, sans-serif",
                fontSize: "clamp(16px, 3vw, 18px)",
                color: "#1D1A1A",
              }}
            />
          </div>

          {/* Display Order Field */}
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
              Display Order (Optional)
            </label>
            <input
              type="number"
              value={displayOrder}
              onChange={(e) => setDisplayOrder(e.target.value)}
              placeholder="0"
              disabled={loading}
              className="w-full border border-[#EAEAEA] rounded px-4 py-3 bg-white disabled:opacity-50"
              style={{
                fontFamily: "Helvetica Neue, sans-serif",
                fontSize: "clamp(16px, 3vw, 18px)",
                color: "#1D1A1A",
              }}
            />
            <p
              style={{
                fontFamily: "Helvetica Neue, sans-serif",
                fontSize: "clamp(12px, 2.5vw, 14px)",
                color: "#999",
                marginTop: "8px",
              }}
            >
              Lower numbers appear first (0 = highest priority)
            </p>
          </div>

          {/* Submit Button */}
          <div className="flex flex-col sm:flex-row justify-end mt-8 gap-3 sm:gap-4">
            <Link href="/dashboard-faq" className="w-full sm:w-auto">
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