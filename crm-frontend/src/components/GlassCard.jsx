import React from "react";

const GlassCard = ({ children, className = "" }) => {
  return (
    <div
      className={`relative p-6 rounded-3xl bg-white/60 backdrop-filter backdrop-blur-md border border-gray-200 hover:border-blue-300 transition-all duration-300 shadow-lg ${className}`}
    >
      {children}
    </div>
  );
};

export default GlassCard;
