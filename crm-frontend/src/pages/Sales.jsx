import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import GlassCard from "../components/GlassCard.jsx";
import API from "../services/api.js";
import {
  Plus,
  DollarSign,
  ChevronsUpDown,
  ArrowUp,
  ArrowDown,
} from "lucide-react";

export default function Sales() {
  const [sales, setSales] = useState([]);
  const [sortState, setSortState] = useState({ key: null, direction: null });

  const fetchSales = async () => {
    try {
      const { data } = await API.get("/sales");
      setSales(data);
    } catch (err) {
      console.error("Error fetching sales", err);
    }
  };

  useEffect(() => {
    fetchSales();
  }, []);

  const handleSort = (key) => {
    if (sortState.key !== key) {
      setSortState({ key, direction: "asc" });
    } else if (sortState.direction === "asc") {
      setSortState({ key, direction: "desc" });
    } else if (sortState.direction === "desc") {
      setSortState({ key: null, direction: null });
    } else {
      setSortState({ key, direction: "asc" });
    }
  };

  const getSortedSales = () => {
    if (!sortState.key || !sortState.direction) {
      return sales;
    }

    const sorted = [...sales].sort((a, b) => {
      const aValue = a[sortState.key];
      const bValue = b[sortState.key];

      if (aValue === bValue) return 0;

      if (typeof aValue === "string") {
        const compareResult = aValue.localeCompare(bValue);
        return sortState.direction === "asc" ? compareResult : -compareResult;
      }

      if (sortState.direction === "asc") {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue > bValue ? -1 : 1;
      }
    });

    return sorted;
  };

  const sortedSales = getSortedSales();

  const tableHeaders = [
    { label: "Customer Name", key: "customerName" }, // 👈 New
    { label: "Customer ID", key: "customerId" },
    { label: "Amount", key: "amount", responsive: "md:table-cell" },
    { label: "Status", key: "status", responsive: "lg:table-cell" },
    { label: "Date", key: "date", responsive: "lg:table-cell" },
    { label: "Assigned Rep", key: "assignedRep", responsive: "lg:table-cell" },
  ];

  const getSortIcon = (key) => {
    if (sortState.key !== key) {
      return <ChevronsUpDown size={16} />;
    }
    if (sortState.direction === "asc") {
      return <ArrowUp size={16} />;
    }
    if (sortState.direction === "desc") {
      return <ArrowDown size={16} />;
    }
    return <ChevronsUpDown size={16} />;
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Closed-Won":
        return "text-green-600 font-semibold";
      case "Closed-Lost":
        return "text-red-600 font-semibold";
      case "Negotiation":
        return "text-blue-600 font-semibold";
      default:
        return "text-yellow-600 font-semibold";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 p-20 pt-14">
      {/* Header with Add Button */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
          <DollarSign size={28} className="text-blue-600" />
          Sales
        </h1>
        <Link
          to="/sales/new"
          className="flex items-center gap-2 bg-blue-600 text-white font-semibold px-4 py-2 rounded-full hover:bg-blue-700 transition-colors duration-200"
        >
          <Plus size={18} /> Record Sale
        </Link>
      </div>

      {/* Sales List Table */}
      <GlassCard className="p-0">
        {sales.length === 0 ? (
          <p className="p-8 text-center text-gray-600 italic">
            No sales found. Click "Record Sale" to get started.
          </p>
        ) : (
          <div className="overflow-x-auto rounded-3xl">
            <table className="w-full text-left table-auto">
              <thead className="bg-gray-100 text-gray-700 uppercase text-sm font-semibold tracking-wide">
                <tr>
                  {tableHeaders.map((header) => (
                    <th
                      key={header.key}
                      className={`p-4 ${header.responsive || ""}`}
                    >
                      <button
                        onClick={() => handleSort(header.key)}
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
                </tr>
              </thead>
              <tbody>
                {sortedSales.map((s, index) => (
                  <tr
                    key={s._id}
                    className={`border-b border-gray-200 text-gray-700 hover:bg-gray-100 transition-colors duration-200 ${
                      index % 2 === 0 ? "bg-white/50" : "bg-white/80"
                    }`}
                  >
                    <td className="p-4 font-medium">
                      {s.customerId?.name || "N/A"}
                    </td>
                    <td className="p-4">{s.customerId?._id || "-"}</td>
                    <td className="p-4 hidden md:table-cell">₹{s.amount}</td>
                    <td
                      className={`p-4 hidden lg:table-cell ${getStatusColor(
                        s.status
                      )}`}
                    >
                      {s.status}
                    </td>
                    <td className="p-4 hidden lg:table-cell">
                      {s.date ? new Date(s.date).toLocaleDateString() : "-"}
                    </td>
                    <td className="p-4 hidden lg:table-cell">
                      {s.assignedRep}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </GlassCard>
    </div>
  );
}
