"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { fetchAllNews } from "@/lib/news";
import { deleteNewsItemAction } from "./actions";
import type { News } from "@/lib/types/database.types";

export default function NewsDashboard() {
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);
  const [newsData, setNewsData] = useState<News[]>([]);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadNews();
  }, []);

  const loadNews = async () => {
    try {
      setLoading(true);
      const data = await fetchAllNews();
      setNewsData(data);
      setError(null);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "Failed to load news";
      setError(errorMessage);
      console.error("Error loading news:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Are you sure you want to delete "${title}"? This action cannot be undone.`)) return;
    
    try {
      const result = await deleteNewsItemAction(id);
      if (result.error) {
        alert("Failed to delete news: " + result.error);
      } else {
        await loadNews();
      }
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "Failed to delete news";
      alert("Failed to delete news: " + errorMessage);
    }
  };

  const truncateText = (text: string, maxLength: number = 50) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + "...";
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const renderPagination = () => {
    const totalPages = Math.ceil(newsData.length / itemsPerPage);

    const getPageNumbers = () => {
      const pages: (number | string)[] = [];
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
          onChange={(e) => {
            setItemsPerPage(Number(e.target.value));
            setCurrentPage(1);
          }}
          className="ml-4 border border-[#EAEAEA] rounded text-[#1D1A1A] bg-white"
          style={{
            fontFamily: "Helvetica Neue, sans-serif",
            fontSize: "18px",
            width: "100px",
            height: "40px",
            paddingLeft: "12px",
            paddingRight: "32px",
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

  const getSortedNews = () => {
    const sorted = [...newsData].sort((a, b) => {
      const dateA = new Date(a.created_at).getTime();
      const dateB = new Date(b.created_at).getTime();
      return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
    });
    return sorted;
  };

  const getPaginatedItems = () => {
    const sorted = getSortedNews();
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return sorted.slice(startIndex, endIndex);
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
        </div>
      </div>

      {/* News Section */}
      <div
        style={{
          paddingLeft: "45px",
          paddingRight: "45px",
          paddingBottom: "40px",
        }}
      >
        {/* Section Header with Title and Add Button */}
        <div
          className="flex items-center justify-between"
          style={{ marginBottom: "35px" }}
        >
          <h2
            style={{
              fontFamily: "Poppins, sans-serif",
              fontWeight: "500",
              fontSize: "24px",
              color: "#1D1A1A",
            }}
          >
            News
          </h2>
          <div className="flex items-center gap-4">
            {/* Sort Dropdown */}
            <select
              value={sortOrder}
              onChange={(e) => {
                setSortOrder(e.target.value as "asc" | "desc");
                setCurrentPage(1);
              }}
              className="border border-[#EAEAEA] rounded text-[#1D1A1A] bg-white px-4"
              style={{
                fontFamily: "Helvetica Neue, sans-serif",
                fontSize: "16px",
                height: "40px",
                minWidth: "180px",
              }}
            >
              <option value="desc">Newest First</option>
              <option value="asc">Oldest First</option>
            </select>
            
            <Link href="/dashboard-news/add">
              <button
                className="px-6 bg-[#4A90E2] text-white rounded hover:bg-[#357ABD] transition-colors"
                style={{
                  fontFamily: "Helvetica Neue, sans-serif",
                  fontSize: "18px",
                  width: "200px",
                  height: "40px",
                }}
              >
                Add News
              </button>
            </Link>
          </div>
        </div>

        {/* Loading/Error States */}
        {loading && (
          <div className="text-center py-8">
            <p style={{ fontFamily: "Helvetica Neue, sans-serif", fontSize: "18px" }}>
              Loading news...
            </p>
          </div>
        )}
        
        {error && (
          <div className="text-center py-8">
            <p style={{ fontFamily: "Helvetica Neue, sans-serif", fontSize: "18px", color: "#E53E3E" }}>
              Error: {error}
            </p>
          </div>
        )}

        {/* Table */}
        {!loading && !error && (
          <div className="rounded-lg overflow-hidden shadow-sm">
            <table className="w-full border-collapse">
              <thead style={{ backgroundColor: "#E4E4E4" }}>
                <tr>
                  <th
                    className="text-left font-medium py-3"
                    style={{
                      fontFamily: "Helvetica Neue, sans-serif",
                      fontSize: "18px",
                      color: "#1D1A1A",
                      width: "50px",
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
                      width: "135px",
                      paddingLeft: "40px",
                    }}
                  >
                    Thumbnail
                  </th>
                  <th
                    className="text-left font-medium py-3"
                    style={{
                      fontFamily: "Helvetica Neue, sans-serif",
                      fontSize: "18px",
                      color: "#1D1A1A",
                      width: "250px",
                      paddingLeft: "40px",
                    }}
                  >
                    Title
                  </th>
                  <th
                    className="text-left font-medium py-3"
                    style={{
                      fontFamily: "Helvetica Neue, sans-serif",
                      fontSize: "18px",
                      width: "400px",
                      color: "#1D1A1A",
                      paddingLeft: "40px",
                    }}
                  >
                    Description
                  </th>
                  <th
                    className="text-left font-medium py-3"
                    style={{
                      fontFamily: "Helvetica Neue, sans-serif",
                      fontSize: "18px",
                      color: "#1D1A1A",
                      width: "200px",
                      paddingLeft: "40px",
                    }}
                  >
                    Created At
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
                      width: "200px",
                      paddingLeft: "125px",
                    }}
                  >
                    Action
                  </th>
                </tr>
              </thead>
              <tbody style={{ backgroundColor: "transparent" }}>
                {newsData.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="text-center py-8" style={{ fontFamily: "Helvetica Neue, sans-serif", fontSize: "18px", color: "#1D1A1A" }}>
                      No news found. Click &quot;Add News&quot; to create one.
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
                      <td className="py-4" style={{ paddingLeft: "40px" }}>
                        <div
                          className="bg-gray-200 rounded overflow-hidden"
                          style={{ width: "100px", height: "100px" }}
                        >
                          {item.image_url ? (
                            <img
                              src={item.image_url}
                              alt={item.title}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-400">No image</div>
                          )}
                        </div>
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
                        {item.title}
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
                        {truncateText(item.description || item.content)}
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
                        {new Date(item.created_at).toLocaleDateString()}
                      </td>
                      <td className="py-4 text-center">
                        <span
                          className="px-3 py-1 rounded-full text-sm font-medium"
                          style={{
                            backgroundColor: item.is_published ? "#D4EDDA" : "#F8D7DA",
                            color: item.is_published ? "#155724" : "#721C24",
                            fontFamily: "Helvetica Neue, sans-serif",
                            fontSize: "14px",
                          }}
                        >
                          {item.is_published ? "Published" : "Draft"}
                        </span>
                      </td>
                      <td className="py-4" style={{ paddingLeft: "125px" }}>
                        <div
                          className="flex items-center justify-center gap-3"
                          style={{ width: "200px", margin: "0 auto" }}
                        >
                          <Link href={`/dashboard-news/edit/${item.id}`}>
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
                            onClick={() => handleDelete(item.id, item.title)}
                            className="p-2 hover:bg-[#FFCDCD] rounded transition-colors"
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

        {/* Pagination */}
        {!loading && !error && newsData.length > 0 && renderPagination()}
      </div>
    </div>
  );
}