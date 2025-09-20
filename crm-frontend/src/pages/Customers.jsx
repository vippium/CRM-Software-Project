import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import GlassCard from "../components/GlassCard.jsx";
import API from "../services/api.js";
import { Trash2, UserPlus, ClipboardList, Edit } from "lucide-react";
import DataTable from "../components/DataTable.jsx";
import { isAdmin, isSales } from "../services/auth.js";

export default function Customers() {
  const [customers, setCustomers] = useState([]);
  const [sortState, setSortState] = useState({ key: null, direction: null });
  const [loading, setLoading] = useState(true);

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      const { data } = await API.get("/customers");
      setCustomers(data);
    } catch (err) {
      console.error("Error fetching customers", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const handleDelete = async (id) => {
    try {
      await API.delete(`/customers/${id}`);
      fetchCustomers();
    } catch (err) {
      console.error("Error deleting customer", err);
    }
  };

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

  const getSortedCustomers = () => {
    if (!sortState.key || !sortState.direction) return customers;

    const sorted = [...customers].sort((a, b) => {
      // Support nested keys like "assignedRep.name" gracefully if needed
      const getValue = (obj, key) => {
        if (!key) return "";
        if (key.includes(".")) {
          return key.split(".").reduce((o, k) => (o ? o[k] : undefined), obj);
        }
        return obj ? obj[key] : undefined;
      };

      const aValue = getValue(a, sortState.key) || "";
      const bValue = getValue(b, sortState.key) || "";

      if (aValue === bValue) return 0;
      const compareResult = aValue.toString().localeCompare(bValue.toString());
      return sortState.direction === "asc" ? compareResult : -compareResult;
    });

    return sorted;
  };

  const sortedCustomers = getSortedCustomers();

  const tableHeaders = [
    { label: "Name", key: "name" },
    { label: "Email", key: "email" },
    { label: "Phone", key: "phone", responsive: "md:table-cell" },
    { label: "Company", key: "company", responsive: "lg:table-cell" },
    {
      label: "Assigned Rep",
      key: "assignedRep.name",
      responsive: "lg:table-cell",
    },
  ];

  const renderRow = (c, index) => (
    <tr
      key={c._id}
      className={`border-b border-gray-200 text-gray-700 hover:bg-gray-100 transition-colors duration-200 ${
        index % 2 === 0 ? "bg-white/50" : "bg-white/80"
      }`}
    >
      <td className="p-4 font-medium">{c.name}</td>
      <td className="p-4">{c.email}</td>
      <td className="p-4 hidden md:table-cell">{c.phone || "-"}</td>
      <td className="p-4 hidden lg:table-cell">{c.company || "-"}</td>
      <td className="p-4 hidden lg:table-cell">
        {c.assignedRep ? c.assignedRep.name : "Unassigned"}
      </td>

      {(isAdmin() || isSales()) && (
        <td className="p-4 text-center">
          <div className="flex justify-center gap-3">
            <Link
              to={`/customers/${c._id}/edit`}
              className="text-blue-500 hover:text-blue-700 transition-colors duration-200"
              title="Edit Customer"
            >
              <Edit size={18} />
            </Link>
            {isAdmin() && (
              <button
                onClick={() => handleDelete(c._id)}
                className="text-red-500 hover:text-red-700 transition-colors duration-200"
                title="Delete Customer"
              >
                <Trash2 size={18} />
              </button>
            )}
          </div>
        </td>
      )}
    </tr>
  );

  // ---------- Skeleton UI pieces ----------
  const HeaderSkeleton = () => (
    <div className="flex justify-between items-center mb-8">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 bg-gray-200 rounded animate-pulse" />
        <div className="h-6 w-48 bg-gray-200 rounded animate-pulse" />
      </div>
      <div className="h-10 w-36 bg-gray-200 rounded-full animate-pulse" />
    </div>
  );

  const TableSkeleton = ({ rows = 6 }) => (
    <GlassCard className="p-0">
      <div className="p-6">
        <div className="overflow-x-auto">
          <table className="w-full">
            <tbody>
              {[...Array(rows)].map((_, i) => (
                <tr key={i} className="border-b border-gray-200">
                  <td className="p-4">
                    <div className="h-4 bg-gray-200 rounded w-40 animate-pulse" />
                  </td>
                  <td className="p-4">
                    <div className="h-4 bg-gray-200 rounded w-56 animate-pulse" />
                  </td>
                  <td className="p-4 hidden md:table-cell">
                    <div className="h-4 bg-gray-200 rounded w-32 animate-pulse" />
                  </td>
                  <td className="p-4 hidden lg:table-cell">
                    <div className="h-4 bg-gray-200 rounded w-32 animate-pulse" />
                  </td>
                  <td className="p-4 hidden lg:table-cell">
                    <div className="h-4 bg-gray-200 rounded w-40 animate-pulse" />
                  </td>
                  {(isAdmin() || isSales()) && (
                    <td className="p-4">
                      <div className="h-6 w-20 bg-gray-200 rounded animate-pulse mx-auto" />
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </GlassCard>
  );

  // ---------- Render ----------
  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 p-20 pt-14">
      {/* Header */}
      {loading ? (
        <HeaderSkeleton />
      ) : (
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
            <ClipboardList size={28} className="text-blue-600" />
            Customers
          </h1>
          {isAdmin() ? (
            <Link
              to="/customers/new"
              className="flex items-center gap-2 bg-blue-600 text-white font-semibold px-4 py-2 rounded-full hover:bg-blue-700 transition-colors duration-200"
            >
              <UserPlus size={18} /> Add Customer
            </Link>
          ) : (
            // keep layout stable for non-admin users
            <div className="w-36" />
          )}
        </div>
      )}

      {/* List / Table area */}
      {loading ? (
        <TableSkeleton rows={6} />
      ) : customers.length === 0 ? (
        <GlassCard className="p-0">
          <p className="p-8 text-center text-gray-600 italic">
            No customers found.{" "}
            {isAdmin() && 'Click "Add Customer" to get started.'}
          </p>
        </GlassCard>
      ) : (
        <GlassCard className="p-0">
          <DataTable
            headers={tableHeaders}
            data={sortedCustomers}
            sortState={sortState}
            onSort={handleSort}
            renderRow={renderRow}
            hasActions={isAdmin() || isSales()}
          />
        </GlassCard>
      )}
    </div>
  );
}
