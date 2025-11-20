"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { fetchAllFAQList } from "@/lib/faq";
import { deleteFaqItemAction } from "./edit/actions";
import type { FAQ } from "@/lib/types/database.types";

export default function FAQDashboard() {
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);
  const [faqData, setFaqData] = useState<FAQ[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    loadFAQ();
  }, []);

  const loadFAQ = async () => {
    try {
      setLoading(true);
      const data = await fetchAllFAQList();
      setFaqData(data);
      setError(null);
    } catch (err: unknown) {
      setError((err as Error).message || "Failed to load FAQ");
      console.error("Error loading FAQ:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = (id: string) => {
    setDeleteId(id);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    if (!deleteId) return;

    setError(null);
    setSuccess(null);
    setDeleting(true);

    try {
      const result = await deleteFaqItemAction(deleteId);
      
      if (result.error) {
        setError(result.error);
        setDeleting(false);
        setShowDeleteModal(false);
        setDeleteId(null);
        return;
      }

      // Success
      setSuccess("FAQ deleted successfully!");
      setDeleting(false);
      setShowDeleteModal(false);
      setDeleteId(null);
      
      // Reload data
      await loadFAQ();
      
      // Auto hide success message after 3 seconds
      setTimeout(() => {
        setSuccess(null);
      }, 3000);
    } catch (err: unknown) {
      console.error("Error deleting FAQ:", err);
      setError((err as Error).message || "Failed to delete FAQ");
      setDeleting(false);
      setShowDeleteModal(false);
      setDeleteId(null);
    }
  };

  const handleDeleteCancel = () => {
    setShowDeleteModal(false);
    setDeleteId(null);
  };

  const truncateText = (text: string, maxLength: number = 50) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + "...";
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const renderPagination = () => {
    const totalPages = Math.ceil(faqData.length / itemsPerPage);

    const getPageNumbers = () => {
      const pages = [];
      const maxVisible = 5;

      if (totalPages <= maxVisible) {
        for (let i = 1; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        pages.push(1);

        if (currentPage > 3) {
          pages.push("...");
        }

        const start = Math.max(2, currentPage - 1);
        const end = Math.min(totalPages - 1, currentPage + 1);

        for (let i = start; i <= end; i++) {
          if (!pages.includes(i)) {
            pages.push(i);
          }
        }

        if (currentPage < totalPages - 2) {
          pages.push("...");
        }

        if (!pages.includes(totalPages)) {
          pages.push(totalPages);
        }
      }

      return pages;
    };

    return (
      <div className="flex items-center gap-2 mt-6">
        {/* Previous Button */}
        <button
          onClick={() => currentPage > 1 && handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className={`flex items-center justify-center border rounded ${
            currentPage === 1
              ? "bg-[#EAEAEA] border-[#EAEAEA] text-gray-400 cursor-not-allowed"
              : "bg-white border-[#EAEAEA] text-[#1D1A1A] hover:bg-gray-50"
          }`}
          style={{
            fontFamily: "Helvetica Neue, sans-serif",
            fontSize: "18px",
            width: "40px",
            height: "40px",
          }}
        >
          &lt;
        </button>

        {/* Page Numbers */}
        {getPageNumbers().map((page, idx) => {
          if (page === "...") {
            return (
              <span
                key={`ellipsis-${idx}`}
                className="flex items-center justify-center text-[#1D1A1A]"
                style={{
                  fontFamily: "Helvetica Neue, sans-serif",
                  fontSize: "18px",
                  width: "40px",
                  height: "40px",
                }}
              >
                ...
              </span>
            );
          }

          return (
            <button
              key={page}
              onClick={() => handlePageChange(page as number)}
              className={`flex items-center justify-center border rounded ${
                currentPage === page
                  ? "bg-[#EAEAEA] border-[#EAEAEA] text-[#1D1A1A] font-medium"
                  : "bg-white border-[#EAEAEA] text-[#1D1A1A] hover:bg-gray-50"
              }`}
              style={{
                fontFamily: "Helvetica Neue, sans-serif",
                fontSize: "18px",
                width: "40px",
                height: "40px",
              }}
            >
              {page}
            </button>
          );
        })}

        {/* Next Button */}
        <button
          onClick={() =>
            currentPage < totalPages && handlePageChange(currentPage + 1)
          }
          disabled={currentPage === totalPages}
          className={`flex items-center justify-center border rounded ${
            currentPage === totalPages
              ? "bg-[#EAEAEA] border-[#EAEAEA] text-gray-400 cursor-not-allowed"
              : "bg-white border-[#EAEAEA] text-[#1D1A1A] hover:bg-gray-50"
          }`}
          style={{
            fontFamily: "Helvetica Neue, sans-serif",
            fontSize: "18px",
            width: "40px",
            height: "40px",
          }}
        >
          &gt;
        </button>

        {/* Items per page selector */}
        <select
          value={itemsPerPage}
          onChange={(e) => setItemsPerPage(Number(e.target.value))}
          className="ml-4 border border-[#EAEAEA] rounded text-[#1D1A1A] bg-transparent appearance-none"
          style={{
            fontFamily: "Helvetica Neue, sans-serif",
            fontSize: "18px",
            width: "100px",
            height: "40px",
            paddingLeft: "12px",
            paddingRight: "32px",
            backgroundImage: `url('/dashboard/dropdown.svg')`,
            backgroundRepeat: "no-repeat",
            backgroundPosition: "right 15px center",
            backgroundSize: "10px",
          }}
        >
          <option value={5}>5</option>
          <option value={10}>10</option>
          <option value={15}>15</option>
          <option value={20}>20</option>
        </select>
        <span
          className="text-[#1D1A1A]"
          style={{ fontFamily: "Helvetica Neue, sans-serif", fontSize: "18px" }}
        >
          / Page
        </span>
      </div>
    );
  };

  const getPaginatedItems = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return faqData.slice(startIndex, endIndex);
  };

  return (
    <div
      className="min-h-screen lg:ml-64 ml-0"
      style={{ backgroundColor: "#FFFDF7" }}
    >
      {/* Delete Confirmation Modal */}
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
          <Link href="/dashboard-faq" className="hover:underline">
            FAQ
          </Link>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="px-4 md:px-[45px] pb-10">

        {/* Section Header with Title and Add Button */}
        <div className="flex items-center justify-between gap-3 mb-6 md:mb-[35px]">
          <h2
            className="text-xl md:text-2xl"
            style={{
              fontFamily: "Poppins, sans-serif",
              fontWeight: "500",
              color: "#1D1A1A",
            }}
          >
            Frequently Asked Questions (FAQ)
          </h2>
          <Link href="/dashboard-faq/add">
            {/* Desktop Button */}
            <button
              className="hidden md:block px-6 bg-[#4A90E2] text-white rounded hover:bg-[#357ABD] transition-colors"
              style={{
                fontFamily: "Helvetica Neue, sans-serif",
                fontSize: "18px",
                width: "200px",
                height: "40px",
              }}
            >
              Add FAQ
            </button>
            {/* Mobile Button - Plus Icon Only */}
            <button
              className="md:hidden flex items-center justify-center bg-[#4A90E2] text-white rounded-full hover:bg-[#357ABD] transition-colors"
              style={{
                width: "40px",
                height: "40px",
                fontSize: "24px",
              }}
            >
              +
            </button>
          </Link>
        </div>

        {/* Loading/Error States */}
        {loading && (
          <div className="text-center py-8" style={{ color: "#1D1A1A" }}>
            <p style={{ fontFamily: "Helvetica Neue, sans-serif", fontSize: "18px" }}>
              Loading FAQ...
            </p>
          </div>
        )}

        {/* Desktop Table - Hidden on mobile */}
        {!loading && (
          <div className="hidden md:block rounded-lg overflow-hidden shadow-sm">
            <table className="w-full border-collapse">
              <thead style={{ backgroundColor: "#E4E4E4" }}>
                <tr>
                  <th
                    className="text-left font-medium py-3"
                    style={{
                      fontFamily: "Helvetica Neue, sans-serif",
                      fontSize: "18px",
                      color: "#1D1A1A",
                      width: "80px",
                      paddingLeft: "25px",
                    }}
                  >
                    No
                  </th>
                  <th
                    className="text-left font-medium py-3"
                    style={{
                      fontFamily: "Helvetica Neue, sans-serif",
                      fontSize: "18px",
                      color: "#1D1A1A",
                      width: "450px",
                      paddingLeft: "40px",
                    }}
                  >
                    Question
                  </th>
                  <th
                    className="text-left font-medium py-3"
                    style={{
                      fontFamily: "Helvetica Neue, sans-serif",
                      fontSize: "18px",
                      color: "#1D1A1A",
                      paddingLeft: "40px",
                    }}
                  >
                    Answers
                  </th>
                  <th
                    className="text-center font-medium py-3"
                    style={{
                      fontFamily: "Helvetica Neue, sans-serif",
                      fontSize: "18px",
                      color: "#1D1A1A",
                      width: "120px",
                      paddingLeft: "20px",
                    }}
                  >
                    Status
                  </th>
                  <th
                    className="text-center font-medium py-3"
                    style={{
                      fontFamily: "Helvetica Neue, sans-serif",
                      fontSize: "18px",
                      color: "#1D1A1A",
                      width: "150px",
                      paddingRight: "25px",
                    }}
                  >
                    Action
                  </th>
                </tr>
              </thead>
              <tbody style={{ backgroundColor: "transparent" }}>
                {faqData.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="text-center py-8" style={{ fontFamily: "Helvetica Neue, sans-serif", fontSize: "18px" }}>
                      No FAQ found. Click &ldquo;Add FAQ&rdquo; to create one.
                    </td>
                  </tr>
                ) : (
                  getPaginatedItems().map((item, idx) => (
                    <tr
                      key={item.id}
                      style={{
                        backgroundColor: "transparent",
                        borderBottom:
                          idx < getPaginatedItems().length - 1
                            ? "1px solid #EAEAEA"
                            : "none",
                      }}
                    >
                      <td
                        className="py-4"
                        style={{
                          fontFamily: "Helvetica Neue, sans-serif",
                          fontSize: "18px",
                          color: "#1D1A1A",
                          paddingLeft: "25px",
                        }}
                      >
                        {(currentPage - 1) * itemsPerPage + idx + 1}
                      </td>
                      <td
                        className="py-4"
                        style={{
                          fontFamily: "Helvetica Neue, sans-serif",
                          fontSize: "18px",
                          color: "#1D1A1A",
                          paddingLeft: "40px",
                        }}
                      >
                        {item.question}
                      </td>
                      <td
                        className="py-4"
                        style={{
                          fontFamily: "Helvetica Neue, sans-serif",
                          fontSize: "18px",
                          color: "#1D1A1A",
                          paddingLeft: "40px",
                        }}
                      >
                        {truncateText(item.answer)}
                      </td>
                      <td className="py-4" style={{ paddingLeft: "20px" }}>
                        <div className="flex justify-center">
                          <span
                            className="px-3 py-1 rounded-full text-sm font-medium"
                            style={{
                              fontFamily: "Helvetica Neue, sans-serif",
                              fontSize: "14px",
                              backgroundColor: item.is_active ? "#D4EDDA" : "#F8D7DA",
                              color: item.is_active ? "#155724" : "#721C24",
                            }}
                          >
                            {item.is_active ? "Active" : "Inactive"}
                          </span>
                        </div>
                      </td>
                      <td className="py-4" style={{ paddingRight: "25px" }}>
                        <div
                          className="flex items-center justify-center gap-3"
                          style={{ width: "150px", margin: "0 auto" }}
                        >
                          <Link href={`/dashboard-faq/edit/${item.id}`}>
                            <button className="p-2 hover:bg-[#FFECCD] rounded transition-colors">
                              <Image
                                src="/dashboard/edit.svg"
                                alt="Edit"
                                width={28}
                                height={28}
                              />
                            </button>
                          </Link>
                          <button 
                            onClick={() => handleDeleteClick(item.id)}
                            className="p-2 hover:bg-[#FFCDCD] rounded transition-colors"
                            disabled={deleting}
                          >
                            <Image
                              src="/dashboard/delete.svg"
                              alt="Delete"
                              width={26}
                              height={26}
                            />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* Mobile Card Layout */}
        {!loading && (
          <div className="md:hidden space-y-4">
            {faqData.length === 0 ? (
              <div className="text-center py-8 bg-white rounded-lg border border-[#EAEAEA]">
                <p style={{ fontFamily: "Helvetica Neue, sans-serif", fontSize: "16px", color: "#666" }}>
                  No FAQ found. Click &ldquo;+&rdquo; to create one.
                </p>
              </div>
            ) : (
              getPaginatedItems().map((item) => (
                <div key={item.id} className="bg-white rounded-lg shadow-sm p-4 border border-[#EAEAEA]">
                  <div className="mb-3">
                    <h3 className="font-semibold text-[#1D1A1A] text-base mb-2" style={{ fontFamily: "Helvetica Neue, sans-serif" }}>
                      {item.question}
                    </h3>
                    <p className="text-[#1D1A1A] text-sm mb-2 line-clamp-2" style={{ fontFamily: "Helvetica Neue, sans-serif" }}>
                      {truncateText(item.answer, 80)}
                    </p>
                    <div className="flex items-center gap-2">
                      <span 
                        className="px-2 py-1 rounded-full text-xs font-medium" 
                        style={{ 
                          fontFamily: "Helvetica Neue, sans-serif", 
                          backgroundColor: item.is_active ? "#D4EDDA" : "#F8D7DA", 
                          color: item.is_active ? "#155724" : "#721C24" 
                        }}
                      >
                        {item.is_active ? "Active" : "Inactive"}
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Link 
                      href={`/dashboard-faq/edit/${item.id}`} 
                      className="flex-1 px-3 py-2 bg-[#F59E0B] text-white rounded hover:bg-[#D97706] text-center text-sm" 
                      style={{ fontFamily: "Helvetica Neue, sans-serif" }}
                    >
                      Edit
                    </Link>
                    <button 
                      onClick={() => handleDeleteClick(item.id)} 
                      disabled={deleting}
                      className="flex-1 px-3 py-2 bg-red-500 text-white rounded hover:bg-red-600 text-sm disabled:opacity-50" 
                      style={{ fontFamily: "Helvetica Neue, sans-serif" }}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Pagination */}
        {!loading && faqData.length > 0 && renderPagination()}
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