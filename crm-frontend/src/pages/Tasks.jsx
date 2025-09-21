import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import GlassCard from "../components/GlassCard.jsx";
import API from "../services/api.js";
import {
  Trash2,
  Plus,
  ClipboardCheck,
  Edit,
  Clock,
  Loader,
  CheckCheck,
  ArrowUp,
  Minus,
  ArrowDown,
} from "lucide-react";
import DataTable from "../components/DataTable.jsx";
import { isAdmin, isSales } from "../services/auth.js";

/* Simple Skeleton Loader */
const Skeleton = ({ className }) => (
  <div className={`animate-pulse bg-gray-200 rounded ${className}`} />
);

export default function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortState, setSortState] = useState({ key: null, direction: null });

  const fetchTasks = async () => {
    try {
      const { data } = await API.get("/tasks");
      setTasks(data);
    } catch (err) {
      console.error("Error fetching tasks", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleDelete = async (id) => {
    try {
      await API.delete(`/tasks/${id}`);
      fetchTasks();
    } catch (err) {
      console.error("Error deleting task", err);
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

  const getValueByKey = (obj, key) => {
    if (!key) return undefined;
    if (key.includes(".")) {
      return key.split(".").reduce((o, k) => (o ? o[k] : undefined), obj);
    }
    return obj ? obj[key] : undefined;
  };

  const getSortedTasks = () => {
    let data = [...tasks];

    data.sort((a, b) => {
      if (a.status === "Completed" && b.status !== "Completed") return 1;
      if (b.status === "Completed" && a.status !== "Completed") return -1;
      return 0;
    });

    if (!sortState.key || !sortState.direction) return data;

    const key = sortState.key;
    const dir = sortState.direction;

    data.sort((a, b) => {
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

    return data;
  };

  const sortedTasks = getSortedTasks();

  const tableHeaders = [
    { label: "Title", key: "title" },
    { label: "Due Date", key: "dueDate", responsive: "md:table-cell" },
    { label: "Status", key: "status", responsive: "lg:table-cell" },
    { label: "Priority", key: "priority", responsive: "lg:table-cell" },
    {
      label: "Assigned To",
      key: "assignedTo.name",
      responsive: "lg:table-cell",
    },
  ];

  /* Status Section */
  const getStatusBadge = (status) => {
    switch (status) {
      case "Pending":
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-700">
            <Clock size={14} /> Pending
          </span>
        );
      case "In Progress":
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-700">
            <Loader size={14} className="animate-spin" /> In Progress
          </span>
        );
      case "Completed":
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-700">
            <CheckCheck size={14} /> Completed
          </span>
        );
      default:
        return status;
    }
  };

  /* Priority Section */
  const getPriorityBadge = (priority) => {
    switch (priority) {
      case "High":
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-700">
            <ArrowUp size={14} /> High
          </span>
        );
      case "Medium":
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium bg-amber-100 text-amber-700">
            <Minus size={14} /> Medium
          </span>
        );
      case "Low":
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-700">
            <ArrowDown size={14} /> Low
          </span>
        );
      default:
        return priority;
    }
  };

  const renderRow = (t, index) => (
    <tr
      key={t._id}
      className={`border-b border-gray-200 text-gray-700 hover:bg-gray-100 transition-colors duration-200 ${
        index % 2 === 0 ? "bg-white/50" : "bg-white/80"
      }`}
    >
      <td className="p-4 font-medium">{t.title}</td>
      <td className="p-4 hidden md:table-cell">
        {t.dueDate
          ? new Date(t.dueDate)
              .toLocaleDateString("en-GB", {
                day: "2-digit",
                month: "short",
                year: "numeric",
              })
              .replace(/ /g, "-")
          : "-"}
      </td>
      <td className="p-4 hidden lg:table-cell">{getStatusBadge(t.status)}</td>
      <td className="p-4 hidden lg:table-cell">
        {getPriorityBadge(t.priority)}
      </td>
      <td className="p-4 hidden lg:table-cell">{t.assignedTo?.name || "-"}</td>
      <td className="p-4 text-center">
        <div className="flex justify-center gap-3">
          {(isAdmin() || isSales()) && (
            <Link
              to={`/tasks/${t._id}/edit`}
              className="text-blue-500 hover:text-blue-700 transition-colors duration-200"
              title="Edit Task"
            >
              <Edit size={18} />
            </Link>
          )}
          {isAdmin() && (
            <button
              onClick={() => handleDelete(t._id)}
              className="text-red-500 hover:text-red-700 transition-colors duration-200"
              title="Delete Task"
            >
              <Trash2 size={18} />
            </button>
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
            <ClipboardCheck size={28} className="text-blue-600" />
            Tasks
          </h1>
        )}
        {loading ? (
          <Skeleton className="h-10 w-32 rounded-full" />
        ) : (
          isAdmin() && (
            <Link
              to="/tasks/new"
              className="flex items-center gap-2 bg-blue-600 text-white font-semibold px-4 py-2 rounded-full hover:bg-blue-700 transition-colors duration-200"
            >
              <Plus size={18} /> Add Task
            </Link>
          )
        )}
      </div>

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
        ) : sortedTasks.length === 0 ? (
          <p className="p-8 text-center text-gray-600 italic">
            No tasks found. Click "Add Task" to get started.
          </p>
        ) : (
          <DataTable
            headers={tableHeaders}
            data={sortedTasks}
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
