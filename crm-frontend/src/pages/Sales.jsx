import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import GlassCard from "../components/GlassCard.jsx";
import DataTable from "../components/DataTable.jsx";
import API from "../services/api.js";
import {
  Plus,
  DollarSign,
  Edit,
  CheckCircle,
  XCircle,
  Handshake,
  Search,
} from "lucide-react";
import { isAdmin, isSales } from "../services/auth.js";

// 🔹 Simple Skeleton
const Skeleton = ({ className }) => (
  <div className={`animate-pulse bg-gray-200 rounded ${className}`} />
);

export default function Sales() {
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortState, setSortState] = useState({ key: null, direction: null });

  const fetchSales = async () => {
    try {
      const { data } = await API.get("/sales");
      setSales(data);
    } catch (err) {
      console.error("Error fetching sales", err);
    } finally {
      setLoading(false);
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

  const getValueByKey = (obj, key) => {
    if (!key) return undefined;
    if (key.includes(".")) {
      return key.split(".").reduce((o, k) => (o ? o[k] : undefined), obj);
    }
    return obj ? obj[key] : undefined;
  };

  const getSortedSales = () => {
    if (!sortState.key || !sortState.direction) return sales;

    const key = sortState.key;
    const dir = sortState.direction;

    const sorted = [...sales].sort((a, b) => {
      let aVal = getValueByKey(a, key);
      let bVal = getValueByKey(b, key);

      if (aVal === undefined || aVal === null) aVal = "";
      if (bVal === undefined || bVal === null) bVal = "";

      const aDate = Date.parse(aVal);
      const bDate = Date.parse(bVal);
      if (!isNaN(aDate) && !isNaN(bDate)) {
        return dir === "asc" ? aDate - bDate : bDate - aDate;
      }

      if (typeof aVal === "number" && typeof bVal === "number") {
        return dir === "asc" ? aVal - bVal : bVal - aVal;
      }

      const aStr = String(aVal);
      const bStr = String(bVal);
      const cmp = aStr.localeCompare(bStr);
      return dir === "asc" ? cmp : -cmp;
    });

    return sorted;
  };

  const sortedSales = getSortedSales();

  const tableHeaders = [
    { label: "Customer Name", key: "customerId.name" },
    { label: "Amount", key: "amount", responsive: "md:table-cell" },
    { label: "Status", key: "status", responsive: "lg:table-cell" },
    { label: "Date", key: "date", responsive: "lg:table-cell" },
    {
      label: "Assigned Rep",
      key: "assignedRep.name",
      responsive: "lg:table-cell",
    },
  ];

  // Status pill badges
  const renderStatusPill = (status) => {
    const pill =
      "inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium";
    switch (status) {
      case "Closed-Won":
        return (
          <span className={`${pill} bg-green-100 text-green-700`}>
            <CheckCircle size={14} /> {status}
          </span>
        );
      case "Closed-Lost":
        return (
          <span className={`${pill} bg-red-100 text-red-700`}>
            <XCircle size={14} /> {status}
          </span>
        );
      case "Negotiation":
        return (
          <span className={`${pill} bg-blue-100 text-blue-700`}>
            <Handshake size={14} /> {status}
          </span>
        );
      default:
        return (
          <span className={`${pill} bg-yellow-100 text-yellow-700`}>
            <Search size={14} /> {status || "Prospecting"}
          </span>
        );
    }
  };

  const renderRow = (s, index) => (
    <tr
      key={s._id}
      className={`border-b border-gray-200 text-gray-700 hover:bg-gray-100 transition-colors duration-200 ${
        index % 2 === 0 ? "bg-white/50" : "bg-white/80"
      }`}
    >
      <td className="p-4 font-medium">{s.customerId?.name || "N/A"}</td>
      <td className="p-4 hidden md:table-cell">₹{s.amount}</td>
      <td className="p-4 hidden lg:table-cell">{renderStatusPill(s.status)}</td>
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
        {s.assignedRep ? s.assignedRep.name : "Unassigned"}
      </td>
      <td className="p-4">
        <div className="flex justify-center items-center h-full">
          {(isAdmin() || isSales()) && (
            <Link
              to={`/sales/${s._id}/edit`}
              className="text-blue-500 hover:text-blue-700 transition-colors duration-200"
              title="Edit Sale"
            >
              <Edit size={18} />
            </Link>
          )}
        </div>
      </td>
    </tr>
  );

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 p-20 pt-14">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        {loading ? (
          <div className="flex items-center gap-2">
            <Skeleton className="w-8 h-8 rounded-full" />
            <Skeleton className="h-6 w-32" />
          </div>
        ) : (
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
            <DollarSign size={28} className="text-blue-600" />
            Sales
          </h1>
        )}
        {loading ? (
          <Skeleton className="h-10 w-32 rounded-full" />
        ) : (
          isAdmin() && (
            <Link
              to="/sales/new"
              className="flex items-center gap-2 bg-blue-600 text-white font-semibold px-4 py-2 rounded-full hover:bg-blue-700 transition-colors duration-200"
            >
              <Plus size={18} /> Record Sale
            </Link>
          )
        )}
      </div>

      {/* Sales List */}
      <GlassCard className="p-0">
        {loading ? (
          <div className="p-6">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="flex items-center gap-4 mb-4 last:mb-0 animate-pulse"
              >
                <Skeleton className="h-5 w-32" />
                <Skeleton className="h-5 w-24 hidden md:block" />
                <Skeleton className="h-5 w-20 hidden lg:block" />
                <Skeleton className="h-5 w-28 hidden lg:block" />
              </div>
            ))}
          </div>
        ) : sales.length === 0 ? (
          <p className="p-8 text-center text-gray-600 italic">
            No sales found. {isAdmin() && 'Click "Record Sale" to get started.'}
          </p>
        ) : (
          <DataTable
            headers={tableHeaders}
            data={sortedSales}
            sortState={sortState}
            onSort={handleSort}
            renderRow={renderRow}
            hasActions={isAdmin() || isSales()}
          />
        )}
      </GlassCard>
    </div>
  );
}
