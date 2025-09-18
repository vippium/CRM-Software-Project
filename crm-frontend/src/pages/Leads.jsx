import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import GlassCard from "../components/GlassCard.jsx";
import API from "../services/api.js";
import { Trash2, Plus, Target, Edit } from "lucide-react";
import DataTable from "../components/DataTable.jsx";
import { isAdmin, isSales } from "../services/auth.js";

export default function Leads() {
  const [leads, setLeads] = useState([]);
  const [sortState, setSortState] = useState({ key: null, direction: null });

  const fetchLeads = async () => {
    try {
      const { data } = await API.get("/leads");
      setLeads(data);
    } catch (err) {
      console.error("Error fetching leads", err);
    }
  };

  useEffect(() => {
    fetchLeads();
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

  const getSortedLeads = () => {
    if (!sortState.key || !sortState.direction) {
      return leads;
    }

    const sorted = [...leads].sort((a, b) => {
      const aValue = a[sortState.key] || "";
      const bValue = b[sortState.key] || "";

      if (aValue === bValue) return 0;
      const compareResult = aValue.toString().localeCompare(bValue.toString());
      return sortState.direction === "asc" ? compareResult : -compareResult;
    });

    return sorted;
  };

  const sortedLeads = getSortedLeads();

  const handleDelete = async (id) => {
    try {
      await API.delete(`/leads/${id}`);
      fetchLeads();
    } catch (err) {
      console.error("Error deleting lead", err);
    }
  };

  const tableHeaders = [
    { label: "Name", key: "name" },
    { label: "Email", key: "contactInfo.email", responsive: "md:table-cell" },
    { label: "Phone", key: "contactInfo.phone", responsive: "md:table-cell" },
    { label: "Source", key: "source", responsive: "lg:table-cell" },
    { label: "Status", key: "status", responsive: "lg:table-cell" },
    { label: "Assigned Rep", key: "assignedRep", responsive: "lg:table-cell" },
  ];

  const renderRow = (l, index) => (
    <tr
      key={l._id}
      className={`border-b border-gray-200 text-gray-700 hover:bg-gray-100 transition-colors duration-200 ${
        index % 2 === 0 ? "bg-white/50" : "bg-white/80"
      }`}
    >
      <td className="p-4 font-medium">{l.name}</td>
      <td className="p-4 hidden md:table-cell">{l.contactInfo?.email}</td>
      <td className="p-4 hidden md:table-cell">{l.contactInfo?.phone}</td>
      <td className="p-4 hidden lg:table-cell">{l.source}</td>
      <td className="p-4 hidden lg:table-cell">{l.status}</td>
      <td className="p-4 hidden lg:table-cell">
        {l.assignedRep ? l.assignedRep.name : "Unassigned"}
      </td>
      {(isAdmin() || isSales()) && (
        <td className="p-4 text-center">
          <div className="flex justify-center gap-3">
            <Link
              to={`/leads/${l._id}/edit`}
              className="text-blue-500 hover:text-blue-700 transition-colors duration-200"
              title="Edit Lead"
            >
              <Edit size={18} />
            </Link>
            {isAdmin() && (
              <button
                onClick={() => handleDelete(l._id)}
                className="text-red-500 hover:text-red-700 transition-colors duration-200"
                title="Delete Lead"
              >
                <Trash2 size={18} />
              </button>
            )}
          </div>
        </td>
      )}
    </tr>
  );

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 p-20 pt-14">
      {/* Header with Add Button */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
          <Target size={28} className="text-blue-600" />
          Leads
        </h1>
        {isAdmin() && (
          <Link
            to="/leads/new"
            className="flex items-center gap-2 bg-blue-600 text-white font-semibold px-4 py-2 rounded-full hover:bg-blue-700 transition-colors duration-200"
          >
            <Plus size={18} /> Add Lead
          </Link>
        )}
      </div>

      {/* Leads List Table */}
      <GlassCard className="p-0">
        {leads.length === 0 ? (
          <p className="p-8 text-center text-gray-600 italic">
            No leads found.
            {isAdmin() && ' Click "Add Lead" to get started.'}
          </p>
        ) : (
          <DataTable
            headers={tableHeaders}
            data={sortedLeads}
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
