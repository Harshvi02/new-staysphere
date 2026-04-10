"use client";

import { useEffect, useState, useCallback } from "react";
import Image from "next/image";

type ImageViewerProps = {
  src: string;
  alt: string;
  onClose: () => void;
};

export default function ImageViewer({ src, alt, onClose }: ImageViewerProps) {
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    
    // Agar image zoomed hai toh pan karo, nahi toh zoom in/out
    if (scale > 1) {
      // Zoomed state - pan the image (both horizontal and vertical)
      setPosition((prev) => ({
        x: prev.x - e.deltaX,
        y: prev.y - e.deltaY,
      }));
    } else {
      // Normal state - zoom in/out
      const delta = e.deltaY > 0 ? -0.1 : 0.1;
      setScale((prev) => Math.min(3, Math.max(0.5, prev + delta)));
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setPosition({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y,
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleClose = useCallback(() => {
    setScale(1);
    setPosition({ x: 0, y: 0 });
    onClose();
  }, [onClose]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleClose();
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [handleClose]);

  return (
    <div
      className="fixed inset-0 z-[99999] bg-black/80 backdrop-blur-sm flex items-center justify-center"
      onClick={handleClose}
    >
      <div
        className="relative max-w-[95vw] max-h-[95vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={handleClose}
          className="absolute -top-12 right-0 text-white bg-black/50 rounded-full p-2 hover:bg-black/70 transition z-10"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Zoom controls */}
        <div className="absolute -top-12 left-0 flex gap-2 z-10">
          <button
            onClick={() => setScale((s) => Math.min(3, s + 0.2))}
            className="text-white bg-black/50 rounded-full p-2 hover:bg-black/70 transition"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          </button>
          <button
            onClick={() => setScale((s) => Math.max(0.5, s - 0.2))}
            className="text-white bg-black/50 rounded-full p-2 hover:bg-black/70 transition"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
            </svg>
          </button>
          <button
            onClick={() => {
              setScale(1);
              setPosition({ x: 0, y: 0 });
            }}
            className="text-white bg-black/50 rounded-full px-3 py-1 text-sm hover:bg-black/70 transition"
          >
            Reset
          </button>
        </div>

        {/* Scrollable Image Container - Horizontal + Vertical Scroll */}
        <div 
          className="overflow-auto max-h-[85vh] max-w-[90vw]"
          style={{
            scrollbarWidth: "thin",
            scrollbarColor: "#888 #333",
          }}
          onWheel={handleWheel}
        >
          <div
            className="cursor-grab active:cursor-grabbing"
            style={{
              minWidth: "100%",
              width: "fit-content",
              height: "fit-content",
            }}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
          >
            <Image
              src={src}
              alt={alt}
              width={1600}
              height={1200}
              style={{
                transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
                transition: isDragging ? "none" : "transform 0.1s ease",
                width: "auto",
                height: "auto",
                maxWidth: "none",
                maxHeight: "none",
              }}
              draggable={false}
              unoptimized
            />
          </div>
        </div>

        {/* Instructions */}
        <div className="absolute -bottom-8 left-0 right-0 text-center text-white/60 text-xs whitespace-nowrap">
          🖱️ Scroll to zoom • Drag to pan • ⬅️➡️ Horizontal scroll • ⬆️⬇️ Vertical scroll • ESC to close
        </div>
      </div>
    </div>
  );
}