"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { fetchAllMenuItems } from "@/lib/menu";
import { deleteMenuItemAction } from "./edit/actions";
import type { Menu } from "@/lib/types/database.types";

interface MenuSection {
  title: string;
  items: Menu[];
}

export default function MenuDashboard() {
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [currentPages, setCurrentPages] = useState<Record<string, number>>({
    ramen: 1,
    topping: 1,
    nyemil: 1,
    minuman: 1,
  });
  const [menuData, setMenuData] = useState<MenuSection[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadMenu();
  }, []);

  const loadMenu = async () => {
    try {
      setLoading(true);
      const data = await fetchAllMenuItems();
      
      // Group menu by category
      const grouped: Record<string, Menu[]> = {
        ramen: [],
        topping: [],
        nyemil: [],
        minuman: [],
      };

      data.forEach((item) => {
        if (grouped[item.category]) {
          grouped[item.category].push(item);
        }
      });

      // Convert to MenuSection format
      const sections: MenuSection[] = [
        { title: "Ramen", items: grouped.ramen },
        { title: "Topping", items: grouped.topping },
        { title: "Nyemil", items: grouped.nyemil },
        { title: "Minuman", items: grouped.minuman },
      ];

      setMenuData(sections);
      setError(null);
    } catch (err: any) {
      setError(err.message || "Failed to load menu");
      console.error("Error loading menu:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete "${name}"? This action cannot be undone.`)) return;
    
    try {
      const result = await deleteMenuItemAction(id);
      if (result.error) {
        alert("Failed to delete menu: " + result.error);
      } else {
        await loadMenu(); // Reload data
      }
    } catch (err: any) {
      alert("Failed to delete menu: " + err.message);
    }
  };

  const truncateDescription = (text: string, maxLength: number = 50) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + "...";
  };

  const handlePageChange = (section: string, page: number) => {
    setCurrentPages((prev) => ({ ...prev, [section]: page }));
  };

  const renderPagination = (section: MenuSection, sectionKey: string) => {
    const totalPages = Math.ceil(section.items.length / itemsPerPage);
    const currentPage = currentPages[sectionKey] || 1;

    // Generate page numbers to display
    const getPageNumbers = () => {
      const pages = [];
      const maxVisible = 5;

      if (totalPages <= maxVisible) {
        // Show all pages if total is less than max visible
        for (let i = 1; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        // Always show first page
        pages.push(1);

        if (currentPage > 3) {
          pages.push("...");
        }

        // Show pages around current page
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

        // Always show last page
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
          onClick={() =>
            currentPage > 1 && handlePageChange(sectionKey, currentPage - 1)
          }
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
              onClick={() => handlePageChange(sectionKey, page as number)}
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
            currentPage < totalPages &&
            handlePageChange(sectionKey, currentPage + 1)
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

  const getPaginatedItems = (items: Menu[], sectionKey: string) => {
    const currentPage = currentPages[sectionKey] || 1;
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return items.slice(startIndex, endIndex);
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#FFFDF7", marginLeft: "256px" }}>
      {/* ...existing code... */}
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
        </div>
      </div>

      {/* Menu Sections */}
      <div style={{ paddingLeft: "45px", paddingRight: "45px", paddingBottom: "40px" }}>
        {loading && (
          <div className="text-center py-8">
            <p style={{ fontFamily: "Helvetica Neue, sans-serif", fontSize: "18px" }}>
              Loading menu...
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

        {!loading && !error && menuData.map((section, index) => (
          <div key={index} style={{ marginBottom: index < menuData.length - 1 ? "125px" : "0" }}>
            {/* Section Header with Title and Add Button */}
            <div className="flex items-center justify-between" style={{ marginBottom: "35px" }}>
              <h2
                style={{
                  fontFamily: "Poppins, sans-serif",
                  fontWeight: "500",
                  fontSize: "24px",
                  color: "#1D1A1A",
                }}
              >
                {section.title}
              </h2>
              <Link 
                href={
                  section.title === "Ramen" 
                    ? "/dashboard-menu/add-ramen"
                    : section.title === "Topping"
                    ? "/dashboard-menu/add-topping"
                    : section.title === "Nyemil"
                    ? "/dashboard-menu/add-nyemil"
                    : "/dashboard-menu/add-minuman"
                }
              >
                <button
                  className="px-6 bg-[#4A90E2] text-white rounded hover:bg-[#357ABD] transition-colors"
                  style={{
                    fontFamily: "Helvetica Neue, sans-serif",
                    fontSize: "18px",
                    width: "200px",
                    height: "40px",
                  }}
                >
                  Add {section.title}
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
                      Image
                    </th>
                    <th
                      className="text-left font-medium py-3"
                      style={{
                        fontFamily: "Helvetica Neue, sans-serif",
                        fontSize: "18px",
                        color: "#1D1A1A",
                        width: "200px",
                        paddingLeft: "65px",
                      }}
                    >
                      Name
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
                      Description
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
                  {getPaginatedItems(
                    section.items,
                    section.title.toLowerCase()
                  ).map((item, idx) => (
                    <tr
                      key={item.id}
                      style={{
                        backgroundColor: "transparent",
                        borderBottom:
                          idx <
                          getPaginatedItems(section.items, section.title.toLowerCase())
                            .length -
                            1
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
                        {(currentPages[section.title.toLowerCase()] - 1) *
                          itemsPerPage +
                          idx +
                          1}
                      </td>
                      <td className="py-4" style={{ paddingLeft: "40px" }}>
                        <div
                          className="bg-gray-200 rounded overflow-hidden"
                          style={{ width: "100px", height: "100px" }}
                        >
                          {item.image_url ? (
                            <img
                              src={item.image_url}
                              alt={item.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-400">
                              No Image
                            </div>
                          )}
                        </div>
                      </td>
                      <td
                        className="py-4"
                        style={{
                          fontFamily: "Helvetica Neue, sans-serif",
                          fontSize: "18px",
                          color: "#1D1A1A",
                          paddingLeft: "65px",
                        }}
                      >
                        {item.name}
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
                        {truncateDescription(item.description)}
                      </td>
                      <td className="py-4" style={{ paddingLeft: "20px" }}>
                        <div className="flex justify-center">
                          <span
                            className="px-3 py-1 rounded-full text-sm font-medium"
                            style={{
                              fontFamily: "Helvetica Neue, sans-serif",
                              fontSize: "14px",
                              backgroundColor: item.is_available ? "#D4EDDA" : "#F8D7DA",
                              color: item.is_available ? "#155724" : "#721C24",
                            }}
                          >
                            {item.is_available ? "Available" : "Unavailable"}
                          </span>
                        </div>
                      </td>
                      <td className="py-4" style={{ paddingRight: "25px" }}>
                        <div
                          className="flex items-center justify-center gap-3"
                          style={{ width: "150px", margin: "0 auto" }}
                        >
                          <Link href={`/dashboard-menu/edit-${section.title.toLowerCase()}?id=${item.id}`}>
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
                            onClick={() => handleDelete(item.id, item.name)}
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
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {renderPagination(section, section.title.toLowerCase())}
          </div>
        ))}
      </div>
    </div>
  );
}