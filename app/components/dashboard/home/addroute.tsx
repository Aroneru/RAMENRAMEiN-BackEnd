"use client";
import { useState } from "react";
import Link from "next/link";

export default function AddRouteDashboard() {
  const [accessPoint, setAccessPoint] = useState("");
  const [description, setDescription] = useState("");
  const [estimation, setEstimation] = useState("");

  const handleSubmit = () => {
    // Handle form submission
    console.log({ accessPoint, description, estimation });
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
          <span className="text-[#1D1A1A]">/</span>
          <span>Add Route</span>
        </div>
      </div>

      {/* Add Route Form */}
      <div
        style={{
          paddingLeft: "45px",
          paddingRight: "45px",
          paddingBottom: "40px",
        }}
      >
        {/* Form Container - Center aligned with max width */}
        <div style={{ maxWidth: "900px", margin: "0 auto" }}>
          {/* Access Point Field */}
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
              Access Point <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={accessPoint}
              onChange={(e) => setAccessPoint(e.target.value)}
              placeholder="Insert access point name"
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
              placeholder="Insert route description"
              rows={8}
              className="w-full border border-[#EAEAEA] rounded px-4 py-3 bg-white resize-y"
              style={{
                fontFamily: "Helvetica Neue, sans-serif",
                fontSize: "18px",
                color: "#1D1A1A",
                minHeight: "200px",
              }}
            />
          </div>

          {/* Estimation Field */}
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
              Estimation <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={estimation}
              onChange={(e) => setEstimation(e.target.value)}
              placeholder="Insert time estimation (e.g., 15 menit)"
              className="w-full border border-[#EAEAEA] rounded px-4 py-3 bg-white"
              style={{
                fontFamily: "Helvetica Neue, sans-serif",
                fontSize: "18px",
                color: "#1D1A1A",
              }}
            />
          </div>

          {/* Submit Button */}
          <div className="flex justify-end mt-8">
            <button
              onClick={handleSubmit}
              className="px-8 bg-[#4A90E2] text-white rounded hover:bg-[#357ABD] transition-colors"
              style={{
                fontFamily: "Helvetica Neue, sans-serif",
                fontSize: "18px",
                height: "45px",
                minWidth: "150px",
              }}
            >
              Submit
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}