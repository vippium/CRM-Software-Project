import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import GlassCard from "../components/GlassCard.jsx";
import API from "../services/api.js";
import { Trash2, Plus, ClipboardCheck, Edit } from "lucide-react";
import DataTable from "../components/DataTable.jsx";

export default function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [sortState, setSortState] = useState({ key: null, direction: null });

  const fetchTasks = async () => {
    try {
      const { data } = await API.get("/tasks");
      setTasks(data);
    } catch (err) {
      console.error("Error fetching tasks", err);
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
    if (!sortState.key || !sortState.direction) return tasks;

    const key = sortState.key;
    const dir = sortState.direction;

    const sorted = [...tasks].sort((a, b) => {
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

  const sortedTasks = getSortedTasks();

  const tableHeaders = [
    { label: "Title", key: "title" },
    { label: "Due Date", key: "dueDate", responsive: "md:table-cell" },
    { label: "Status", key: "status", responsive: "lg:table-cell" },
    { label: "Priority", key: "priority", responsive: "lg:table-cell" },
    { label: "Assigned To", key: "assignedTo", responsive: "lg:table-cell" },
  ];

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "High":
        return "text-red-600 font-semibold";
      case "Medium":
        return "text-yellow-600 font-semibold";
      case "Low":
        return "text-green-600 font-semibold";
      default:
        return "text-gray-700";
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
        {t.dueDate ? new Date(t.dueDate).toLocaleDateString() : "-"}
      </td>
      <td className="p-4 hidden lg:table-cell">{t.status}</td>
      <td
        className={`p-4 hidden lg:table-cell ${getPriorityColor(t.priority)}`}
      >
        {t.priority || "-"}
      </td>
      <td className="p-4 hidden lg:table-cell">{t.assignedTo || "-"}</td>
      <td className="p-4 text-center">
        <div className="flex justify-center gap-3">
          <Link
            to={`/tasks/${t._id}/edit`}
            className="text-blue-500 hover:text-blue-700 transition-colors duration-200"
            title="Edit Task"
          >
            <Edit size={18} />
          </Link>
          <button
            onClick={() => handleDelete(t._id)}
            className="text-red-500 hover:text-red-700 transition-colors duration-200"
            title="Delete Task"
          >
            <Trash2 size={18} />
          </button>
        </div>
      </td>
    </tr>
  );

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 p-20 pt-14">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
          <ClipboardCheck size={28} className="text-blue-600" />
          Tasks
        </h1>
        <Link
          to="/tasks/new"
          className="flex items-center gap-2 bg-blue-600 text-white font-semibold px-4 py-2 rounded-full hover:bg-blue-700 transition-colors duration-200"
        >
          <Plus size={18} /> Add Task
        </Link>
      </div>

      {/* List */}
      <GlassCard className="p-0">
        {tasks.length === 0 ? (
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
          />
        )}
      </GlassCard>
    </div>
  );
}
