import React from "react";

export default function GlassNavbar({ children }) {
  return (
    <nav className="sticky top-0 z-50 w-full">
      <div className="backdrop-blur-lg bg-white/80 border-b border-gray-200 shadow-md">
        <div className="h-16 flex items-center justify-between px-6 sm:px-8">
          {children}
        </div>
      </div>
    </nav>
  );
}
