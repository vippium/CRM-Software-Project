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
  Search,
  Handshake,
  CheckCircle,
  XCircle,
  Edit,
} from "lucide-react";
import { isAdmin, isSales } from "../services/auth.js";

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
    if (!sortState.key || !sortState.direction) return sales;

    const sorted = [...sales].sort((a, b) => {
      const aValue = a[sortState.key] || "";
      const bValue = b[sortState.key] || "";

      if (aValue === bValue) return 0;
      const compareResult = aValue.toString().localeCompare(bValue.toString());
      return sortState.direction === "asc" ? compareResult : -compareResult;
    });

    return sorted;
  };

  const sortedSales = getSortedSales();

  const tableHeaders = [
    { label: "Customer Name", key: "customerId.name" },
    { label: "Customer ID", key: "customerId" },
    { label: "Amount", key: "amount", responsive: "md:table-cell" },
    { label: "Status", key: "status", responsive: "lg:table-cell" },
    { label: "Date", key: "date", responsive: "lg:table-cell" },
    { label: "Assigned Rep", key: "assignedRep", responsive: "lg:table-cell" },
    { label: "Actions", key: "actions" },
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

  const renderStatusPill = (status) => {
    let pillStyle =
      "inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium";
    switch (status) {
      case "Closed-Won":
        return (
          <span className={`${pillStyle} bg-green-100 text-green-700`}>
            <CheckCircle size={16} /> {status}
          </span>
        );
      case "Closed-Lost":
        return (
          <span className={`${pillStyle} bg-red-100 text-red-700`}>
            <XCircle size={16} /> {status}
          </span>
        );
      case "Negotiation":
        return (
          <span className={`${pillStyle} bg-blue-100 text-blue-700`}>
            <Handshake size={16} /> {status}
          </span>
        );
      default:
        return (
          <span className={`${pillStyle} bg-yellow-100 text-yellow-700`}>
            <Search size={16} /> {status}
          </span>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 p-20 pt-14">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
          <DollarSign size={28} className="text-blue-600" />
          Sales
        </h1>
        {isAdmin() && (
          <Link
            to="/sales/new"
            className="flex items-center gap-2 bg-blue-600 text-white font-semibold px-4 py-2 rounded-full hover:bg-blue-700 transition-colors duration-200"
          >
            <Plus size={18} /> Record Sale
          </Link>
        )}
      </div>

      {/* Sales List */}
      <GlassCard className="p-0">
        {sales.length === 0 ? (
          <p className="p-8 text-center text-gray-600 italic">
            No sales found. {isAdmin() && 'Click "Record Sale" to get started.'}
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
                      {header.key !== "actions" ? (
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
                      ) : (
                        <span>{header.label}</span>
                      )}
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
                    <td className="p-4 hidden lg:table-cell">
                      {renderStatusPill(s.status)}
                    </td>
                    <td className="p-4 hidden lg:table-cell">
                      {s.date
                        ? new Date(s.date)
                            .toLocaleDateString("en-GB", {
                              day: "2-digit",
                              month: "short",
                              year: "numeric",
                            })
                            .replace(/ /g, "-")
                        : "-"}
                    </td>

                    <td className="p-4 hidden lg:table-cell">
                      {s.assignedRep ? `${s.assignedRep.name}` : "Unassigned"}
                    </td>
                    <td className="p-4 text-center">
                      {(isAdmin() || isSales()) && (
                        <Link
                          to={`/sales/${s._id}/edit`}
                          className="text-blue-500 hover:text-blue-700 transition-colors duration-200"
                          title="Edit Sale"
                        >
                          <Edit size={18} />
                        </Link>
                      )}
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
