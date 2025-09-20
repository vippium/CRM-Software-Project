import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import GlassCard from "../components/GlassCard.jsx";
import API from "../services/api.js";
import {
  Trash2,
  Plus,
  Target,
  Edit,
  Globe,
  Mail,
  Phone,
  Users,
  CircleHelp,
  Sparkles,
  PhoneCall,
  CheckCircle,
  TrendingUp,
  XCircle,
} from "lucide-react";
import DataTable from "../components/DataTable.jsx";
import { isAdmin, isSales } from "../services/auth.js";

// 🔹 Simple Skeleton Component
const Skeleton = ({ className }) => (
  <div className={`animate-pulse bg-gray-200 rounded ${className}`} />
);

export default function Leads() {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortState, setSortState] = useState({ key: null, direction: null });
  const [statusFilter, setStatusFilter] = useState("");
  const [sourceFilter, setSourceFilter] = useState("");
  const [reps, setReps] = useState([]);

  const fetchLeads = async () => {
    try {
      const { data } = await API.get("/leads");
      setLeads(data);
    } catch (err) {
      console.error("Error fetching leads", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchReps = async () => {
    try {
      const { data } = await API.get("/users");
      setReps(data.filter((u) => u.role === "sales"));
    } catch (err) {
      console.error("Error fetching reps", err);
    }
  };

  useEffect(() => {
    fetchLeads();
    if (isAdmin()) fetchReps();
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

  // ✅ Source pill badges
  const getSourceBadge = (source) => {
    switch (source) {
      case "Website":
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-700">
            <Globe size={14} /> Website
          </span>
        );
      case "Email":
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-700">
            <Mail size={14} /> Email
          </span>
        );
      case "Phone":
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-700">
            <Phone size={14} /> Phone
          </span>
        );
      case "Referral":
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-700">
            <Users size={14} /> Referral
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-700">
            <CircleHelp size={14} /> {source || "Other"}
          </span>
        );
    }
  };

  // ✅ Status pill badges
  const getStatusBadge = (status) => {
    switch (status) {
      case "New":
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium bg-indigo-100 text-indigo-700">
            <Sparkles size={14} /> New
          </span>
        );
      case "Contacted":
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium bg-orange-100 text-orange-700">
            <PhoneCall size={14} /> Contacted
          </span>
        );
      case "Qualified":
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-700">
            <CheckCircle size={14} /> Qualified
          </span>
        );
      case "Converted":
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-700">
            <TrendingUp size={14} /> Converted
          </span>
        );
      case "Lost":
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-700">
            <XCircle size={14} /> Lost
          </span>
        );
      default:
        return status;
    }
  };

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
      <td className="p-4 hidden lg:table-cell">{getSourceBadge(l.source)}</td>
      <td className="p-4 hidden lg:table-cell">{getStatusBadge(l.status)}</td>
      <td className="p-4 hidden lg:table-cell">
        {isAdmin() ? (
          <select
            value={l.assignedRep?._id || ""}
            onChange={async (e) => {
              try {
                await API.put(`/leads/${l._id}`, {
                  assignedRep: e.target.value,
                });
                fetchLeads();
              } catch (err) {
                console.error("Error assigning rep", err);
              }
            }}
            className="border border-gray-300 rounded px-2 py-1 text-sm"
          >
            <option value="">Unassigned</option>
            {reps.map((rep) => (
              <option key={rep._id} value={rep._id}>
                {rep.name}
              </option>
            ))}
          </select>
        ) : (
          l.assignedRep?.name || "Unassigned"
        )}
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

  // filters
  const sortedLeads = getSortedLeads();
  const filteredLeads = sortedLeads.filter((l) => {
    return (
      (statusFilter ? l.status === statusFilter : true) &&
      (sourceFilter ? l.source === sourceFilter : true)
    );
  });

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
            <Target size={28} className="text-blue-600" />
            Leads
          </h1>
        )}
        {loading ? (
          <Skeleton className="h-10 w-32 rounded-full" />
        ) : (
          isAdmin() && (
            <Link
              to="/leads/new"
              className="flex items-center gap-2 bg-blue-600 text-white font-semibold px-4 py-2 rounded-full hover:bg-blue-700 transition-colors duration-200"
            >
              <Plus size={18} /> Add Lead
            </Link>
          )
        )}
      </div>

      {/* Filters */}
      {!loading && (
        <div className="flex flex-wrap gap-4 mb-6">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 rounded-full border border-gray-400 bg-white shadow-sm 
                 text-gray-700 focus:outline-none transition duration-200"
          >
            <option value="">All Statuses</option>
            <option value="New">New</option>
            <option value="Contacted">Contacted</option>
            <option value="Qualified">Qualified</option>
            <option value="Converted">Converted</option>
            <option value="Lost">Lost</option>
          </select>

          <select
            value={sourceFilter}
            onChange={(e) => setSourceFilter(e.target.value)}
            className="px-4 py-2 rounded-full border border-gray-400 bg-white shadow-sm 
                 text-gray-700 focus:outline-none transition duration-200"
          >
            <option value="">All Sources</option>
            <option value="Website">Website</option>
            <option value="Email">Email</option>
            <option value="Phone">Phone</option>
            <option value="Referral">Referral</option>
            <option value="Other">Other</option>
          </select>
        </div>
      )}

      {/* List */}
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
                <Skeleton className="h-5 w-20 hidden lg:block" />
                <Skeleton className="h-5 w-28 hidden lg:block" />
              </div>
            ))}
          </div>
        ) : filteredLeads.length === 0 ? (
          <p className="p-8 text-center text-gray-600 italic">
            No leads found.
            {isAdmin() && ' Click "Add Lead" to get started.'}
          </p>
        ) : (
          <DataTable
            headers={tableHeaders}
            data={filteredLeads}
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
