"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import L from "leaflet";

// Custom red marker icon
const redIcon = L.icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

// Import Leaflet dynamically to avoid SSR issues
const MapContainer = dynamic(
  () => import("react-leaflet").then((mod) => mod.MapContainer),
  { ssr: false }
);
const TileLayer = dynamic(
  () => import("react-leaflet").then((mod) => mod.TileLayer),
  { ssr: false }
);

// Import MapClickHandler component
const MapClickHandler = dynamic(() => import("./MapClickHandler"), {
  ssr: false,
});

export default function AddRouteDashboard() {
  const [title, setTitle] = useState("");
  const [accessPoint, setAccessPoint] = useState<[number, number] | null>(null);
  const [description, setDescription] = useState("");
  const [estimation, setEstimation] = useState("");
  const [isClient, setIsClient] = useState(false);

  // Center of Bogor, Indonesia
  const bogorCenter: [number, number] = [-6.5971, 106.806];

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleSubmit = () => {
    if (!title) {
      alert("Please enter a title");
      return;
    }
    if (!accessPoint) {
      alert("Please select a location on the map");
      return;
    }
    if (!description) {
      alert("Please enter a description");
      return;
    }
    if (!estimation) {
      alert("Please enter an estimation");
      return;
    }

    // Handle form submission
    console.log({
      title,
      coordinates: {
        latitude: accessPoint[0],
        longitude: accessPoint[1],
      },
      description,
      estimation,
    });
  };

  const handleDeleteMarker = () => {
    setAccessPoint(null);
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
          {/* Title Field */}
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
              Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Insert route title (e.g., Dari Stasiun Bogor)"
              className="w-full border border-[#EAEAEA] rounded px-4 py-3 bg-white"
              style={{
                fontFamily: "Helvetica Neue, sans-serif",
                fontSize: "18px",
                color: "#1D1A1A",
              }}
            />
          </div>

          {/* Access Point Field - Map */}
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
            <p
              style={{
                fontFamily: "Helvetica Neue, sans-serif",
                fontSize: "18px",
                color: "#999",
                marginBottom: "12px",
              }}
            >
              Click on the map to select location
            </p>

            {/* Map Container */}
            {isClient && (
              <div
                style={{
                  height: "400px",
                  width: "100%",
                  border: "1px solid #EAEAEA",
                  borderRadius: "8px",
                  overflow: "hidden",
                  position: "relative",
                }}
              >
                {/* Delete Button */}
                {accessPoint && (
                  <button
                    onClick={handleDeleteMarker}
                    className="absolute bg-red-500 text-white rounded flex items-center justify-center hover:bg-red-600 transition-colors shadow-lg"
                    style={{
                      top: "10px",
                      right: "10px",
                      width: "120px",
                      height: "35px",
                      fontSize: "14px",
                      fontFamily: "Helvetica Neue, sans-serif",
                      fontWeight: "500",
                      zIndex: 1000,
                    }}
                  >
                    Delete Point
                  </button>
                )}

                <MapContainer
                  center={bogorCenter}
                  zoom={13}
                  style={{ height: "100%", width: "100%" }}
                >
                  <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />
                  <MapClickHandler
                    position={accessPoint}
                    setPosition={setAccessPoint}
                    icon={redIcon}
                  />
                </MapContainer>
              </div>
            )}
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
              placeholder="Insert time estimation (e.g., (15-20 menit))"
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