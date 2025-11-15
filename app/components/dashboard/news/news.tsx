"use client";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

interface NewsItem {
  id: number;
  thumbnail: string;
  title: string;
  body: string;
  createdAt: string;
}

export default function NewsDashboard() {
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);

  const newsData: NewsItem[] = [
    {
      id: 1,
      thumbnail: "dashboard/Ramen.png",
      title: "Grand Opening Ramen RAMEiN",
      body: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
      createdAt: "2024-01-15",
    },
    {
      id: 2,
      thumbnail: "dashboard/Ramen.png",
      title: "Menu Baru: Ramen Spicy Tonkotsu",
      body: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.",
      createdAt: "2024-02-20",
    },
    {
      id: 3,
      thumbnail: "dashboard/Ramen.png",
      title: "Promo Akhir Tahun",
      body: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum.",
      createdAt: "2024-03-10",
    },
    {
      id: 4,
      thumbnail: "dashboard/Ramen.png",
      title: "Kolaborasi dengan Chef Terkenal",
      body: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia.",
      createdAt: "2024-04-05",
    },
    {
      id: 5,
      thumbnail: "dashboard/Ramen.png",
      title: "Event Japanese Culture Week",
      body: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium.",
      createdAt: "2024-05-12",
    },
  ];

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
    return newsData.slice(startIndex, endIndex);
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

        {/* Table */}
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
                  Body
                </th>
                <th
                  className="text-left font-medium py-3"
                  style={{
                    fontFamily: "Helvetica Neue, sans-serif",
                    fontSize: "18px",
                    color: "#1D1A1A",
                    width: "300px",
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
                    width: "200px",
                    paddingLeft: "125px",
                  }}
                >
                  Action
                </th>
              </tr>
            </thead>
            <tbody style={{ backgroundColor: "transparent" }}>
              {getPaginatedItems().map((item, idx) => (
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
                      <img
                        src={item.thumbnail}
                        alt={item.title}
                        className="w-full h-full object-cover"
                      />
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
                    {truncateText(item.body)}
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
                    {item.createdAt}
                  </td>
                  <td className="py-4" style={{ paddingLeft: "125px" }}>
                    <div
                      className="flex items-center justify-center gap-3"
                      style={{ width: "200px", margin: "0 auto" }}
                    >
                      <button className="p-2 hover:bg-[#FFECCD] rounded transition-colors">
                        <Image
                          src="/dashboard/edit.svg"
                          alt="Edit"
                          width={28}
                          height={28}
                        />
                      </button>
                      <button className="p-2 hover:bg-[#FFCDCD] rounded transition-colors">
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
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {renderPagination()}
      </div>
    </div>
  );
}