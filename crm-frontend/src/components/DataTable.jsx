import React from "react";
import { ChevronsUpDown, ArrowUp, ArrowDown } from "lucide-react";

export default function DataTable({
  headers,
  data,
  sortState,
  onSort,
  renderRow,
}) {
  const getSortIcon = (key) => {
    if (sortState.key !== key) return <ChevronsUpDown size={16} />;
    if (sortState.direction === "asc") return <ArrowUp size={16} />;
    if (sortState.direction === "desc") return <ArrowDown size={16} />;
    return <ChevronsUpDown size={16} />;
  };

  return (
    <div className="overflow-x-auto rounded-3xl">
      <table className="w-full text-left table-auto">
        <thead className="bg-gray-100 text-gray-700 uppercase text-sm font-semibold tracking-wide">
          <tr>
            {headers.map((header) => (
              <th key={header.key} className={`p-4 ${header.responsive || ""}`}>
                <button
                  onClick={() => onSort(header.key)}
                  className={`flex items-center gap-2 font-semibold text-gray-700 hover:text-blue-600 transition-colors duration-200 ${
                    sortState.key === header.key ? "text-blue-600" : ""
                  }`}
                >
                  <span>{header.label}</span>
                  <div className="transition-all duration-300">
                    {getSortIcon(header.key)}
                  </div>
                </button>
              </th>
            ))}
            <th className="p-4 text-center">Actions</th>
          </tr>
        </thead>
        <tbody>{data.map((item, idx) => renderRow(item, idx))}</tbody>
      </table>
    </div>
  );
}
