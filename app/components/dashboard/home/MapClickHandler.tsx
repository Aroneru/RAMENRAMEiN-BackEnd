"use client";
import { useMapEvents, Marker } from "react-leaflet";
import type { Icon } from "leaflet";

interface MapClickHandlerProps {
  position: [number, number] | null;
  setPosition: (pos: [number, number]) => void;
  icon: Icon;
}

export default function MapClickHandler({
  position,
  setPosition,
  icon,
}: MapClickHandlerProps) {
  useMapEvents({
    click(e) {
      setPosition([e.latlng.lat, e.latlng.lng]);
    },
  });

  return position ? <Marker position={position} icon={icon} /> : null;
}