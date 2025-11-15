"use client";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

interface RouteAccessItem {
  id: number;
  accessPoint: string;
  description: string;
  estimation: string;
}

export default function HomeDashboard() {
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);
  const [heroImage, setHeroImage] = useState<File | null>(null);
  const [heroImagePreview, setHeroImagePreview] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const routeAccessData: RouteAccessItem[] = [
    {
      id: 1,
      accessPoint: "Keluar Tol Jagorawi",
      description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
      estimation: "15 menit",
    },
    {
      id: 2,
      accessPoint: "Stasiun Bogor",
      description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.",
      estimation: "20 menit",
    },
    {
      id: 3,
      accessPoint: "Terminal Baranangsiang",
      description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum.",
      estimation: "25 menit",
    },
    {
      id: 4,
      accessPoint: "Bandara Halim Perdanakusuma",
      description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia.",
      estimation: "45 menit",
    },
    {
      id: 5,
      accessPoint: "Keluar Tol Sentul",
      description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium.",
      estimation: "10 menit",
    },
  ];

  const handleHeroImageChange = (file: File) => {
    if (file && file.type.match(/^image\//)) {
      setHeroImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setHeroImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleHeroImageChange(file);
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
      handleHeroImageChange(file);
    }
  };

  const handleUpload = () => {
    // Handle upload
    console.log({ heroImage });
  };

  const truncateText = (text: string, maxLength: number = 50) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + "...";
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const renderPagination = () => {
    const totalPages = Math.ceil(routeAccessData.length / itemsPerPage);

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
    return routeAccessData.slice(startIndex, endIndex);
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
          <Link href="/dashboard-home" className="hover:underline">
            Home
          </Link>
        </div>
      </div>

      {/* Hero Section */}
      <div
        style={{
          paddingLeft: "45px",
          paddingRight: "45px",
          marginBottom: "100px",
        }}
      >
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
            Hero Section
          </h2>
          <button
            onClick={handleUpload}
            className="px-6 bg-[#4A90E2] text-white rounded hover:bg-[#357ABD] transition-colors"
            style={{
              fontFamily: "Helvetica Neue, sans-serif",
              fontSize: "18px",
              width: "200px",
              height: "40px",
            }}
          >
            Upload
          </button>
        </div>

        {/* Hero Image Upload*/}
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
            width: "100%",
            height: "50vh",
            transition: "all 0.3s ease",
            position: "relative",
          }}
        >
          {heroImagePreview ? (
            <>
              <img
                src={heroImagePreview}
                alt="Hero Preview"
                className="w-full h-full object-contain p-4"
              />
              <button
                onClick={() => {
                  setHeroImage(null);
                  setHeroImagePreview(null);
                }}
                className="absolute bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
                style={{
                  top: "10px",
                  right: "10px",
                  width: "35px",
                  height: "35px",
                  fontSize: "24px",
                  fontWeight: "bold",
                  zIndex: 10,
                }}
              >
                ×
              </button>
            </>
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
                JPEG, PNG, and JPG formats, up to 10MB
              </p>
              <input
                type="file"
                id="heroFileInput"
                accept="image/*"
                onChange={handleFileInput}
                className="hidden"
              />
              <label
                htmlFor="heroFileInput"
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

      {/* Route Access Section */}
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
            Route Access
          </h2>
          <Link href="/dashboard-home/add-route">
          <button
            className="px-6 bg-[#4A90E2] text-white rounded hover:bg-[#357ABD] transition-colors"
            style={{
              fontFamily: "Helvetica Neue, sans-serif",
              fontSize: "18px",
              width: "200px",
              height: "40px",
            }}
          >
            Add Route
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
                    width: "250px",
                    paddingLeft: "25px",
                  }}
                >
                  Access Point
                </th>
                <th
                  className="text-left font-medium py-3"
                  style={{
                    fontFamily: "Helvetica Neue, sans-serif",
                    fontSize: "18px",
                    width: "500px",
                    color: "#1D1A1A",
                    paddingLeft: "10px",
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
                    width: "700px",
                    paddingLeft: "70px",
                  }}
                >
                  Estimation
                </th>
                <th
                  className="text-center font-medium py-3"
                  style={{
                    fontFamily: "Helvetica Neue, sans-serif",
                    fontSize: "18px",
                    color: "#1D1A1A",
                    width: "200px",
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
                  <td
                    className="py-4"
                    style={{
                      fontFamily: "Helvetica Neue, sans-serif",
                      fontSize: "18px",
                      color: "#1D1A1A",
                      paddingLeft: "25px",
                    }}
                  >
                    {item.accessPoint}
                  </td>
                  <td
                    className="py-4"
                    style={{
                      fontFamily: "Helvetica Neue, sans-serif",
                      fontSize: "18px",
                      color: "#1D1A1A",
                      paddingLeft: "10px",
                    }}
                  >
                    {truncateText(item.description)}
                  </td>
                  <td
                    className="py-4"
                    style={{
                      fontFamily: "Helvetica Neue, sans-serif",
                      fontSize: "18px",
                      color: "#1D1A1A",
                      paddingLeft: "70px",
                    }}
                  >
                    {item.estimation}
                  </td>
                  <td className="py-4" style={{}}>
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