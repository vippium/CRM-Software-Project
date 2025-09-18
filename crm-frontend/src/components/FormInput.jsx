import React from "react";

export default function FormInput({
  label,
  name,
  type = "text",
  value,
  onChange,
  required = false,
}) {
  return (
    <div className="md:col-span-1">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label} {required && "*"}
        </label>
      )}
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        className="w-full p-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200"
      />
    </div>
  );
}
