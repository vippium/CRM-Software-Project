import React from "react";

export default function FormTextarea({
  label,
  name,
  value,
  onChange,
  rows = 3,
}) {
  return (
    <div className="md:col-span-2">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
      )}
      <textarea
        name={name}
        value={value}
        onChange={onChange}
        rows={rows}
        className="w-full p-2 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200"
      />
    </div>
  );
}
