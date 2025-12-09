"use client";

import { useEffect, useRef } from "react";
import "leaflet/dist/leaflet.css";

export default function CafeMap() {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<any>(null);

  useEffect(() => {
    const L = require("leaflet");
    if (!mapContainerRef.current) return;

    // Инициализируем карту ТОЛЬКО один раз
    if (!mapRef.current) {
      mapRef.current = L.map(mapContainerRef.current).setView(
        [43.238949, 76.889709],
        12
      );

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      }).addTo(mapRef.current);

      const customIcon = L.icon({
        iconUrl: "/marker.png",
        iconSize: [40, 40],
        iconAnchor: [20, 40],
        popupAnchor: [0, -40],
      });

      const points = [
        { name: "ТРЦ Атакент", coords: [43.203537, 76.885197] },
        { name: "Мега Центр (Макатаева)", coords: [43.263743, 76.928687] },
        { name: "Мега Розыбакиева", coords: [43.225277, 76.908619] },
      ];

      points.forEach((p) => {
        L.marker(p.coords, { icon: customIcon })
          .addTo(mapRef.current)
          .bindPopup(p.name);
      });
    }
  }, []);

  return (
    <div
      ref={mapContainerRef}
      className="w-full h-[400px] rounded-xl overflow-hidden"
    />
  );
}