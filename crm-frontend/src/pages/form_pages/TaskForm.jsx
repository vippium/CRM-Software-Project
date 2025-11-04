import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import GlassCard from "../../components/GlassCard.jsx";
import FormInput from "../../components/FormInput.jsx";
import FormTextarea from "../../components/FormTextarea.jsx";
import FormSelect from "../../components/FormSelect.jsx";
import API from "../../services/api.js";
import { Plus, ClipboardCheck, Edit } from "lucide-react";
import { getUser, isSales, isAdmin } from "../../services/auth.js";

export default function TaskForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = !!id;
  const user = getUser();
  const isSalesEditing = isSales() && isEditing;

  const [form, setForm] = useState({
    title: "",
    description: "",
    dueDate: "",
    status: "Pending",
    priority: "Medium",
    assignedTo: "",
  });

  const [users, setUsers] = useState([]);

  useEffect(() => {
    API.get("/users/sales-reps")
      .then((res) => setUsers(res.data))
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (!isEditing && isSales()) navigate("/tasks");

    if (isEditing) {
      API.get(`/tasks/${id}`)
        .then((res) => {
          const taskData = {
            title: res.data.title || "",
            description: res.data.description || "",
            dueDate: res.data.dueDate ? res.data.dueDate.split("T")[0] : "",
            status: res.data.status || "Pending",
            priority: res.data.priority || "Medium",
            assignedTo:
              typeof res.data.assignedTo === "string"
                ? res.data.assignedTo
                : res.data.assignedTo?._id || "",
          };
          setForm(taskData);
        })
        .catch(() => navigate("/tasks"));
    }
  }, [id, isEditing, navigate]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditing) {
        await API.put(`/tasks/${id}`, form);
      } else {
        await API.post("/tasks", form);
      }
      navigate("/tasks");
    } catch {
      console.error("Error saving task");
    }
  };

  const statusOptions = [
    { value: "Pending", label: "Pending" },
    { value: "In Progress", label: "In Progress" },
    { value: "Completed", label: "Completed" },
  ];

  const priorityOptions = [
    { value: "Low", label: "Low" },
    { value: "Medium", label: "Medium" },
    { value: "High", label: "High" },
  ];

  const disabledStyle =
    "opacity-60 cursor-not-allowed bg-gray-100 pointer-events-none select-none";

  return (
    <div className="fixed inset-0 overflow-hidden flex items-start justify-center p-8 pt-28 bg-gray-50 text-gray-800">
      <GlassCard className="w-full max-w-2xl p-8">
        <h2 className="text-3xl font-bold mb-8 text-gray-800 flex items-center gap-2">
          {isEditing ? (
            <>
              <Edit size={28} className="text-green-600" /> Edit Task
            </>
          ) : (
            <>
              <ClipboardCheck size={28} className="text-blue-600" /> Add New
              Task
            </>
          )}
        </h2>

        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-2 gap-3"
        >
          {/* Non-editable fields for Sales */}
          <div className={isSalesEditing ? disabledStyle : ""}>
            <FormInput
              label="Title *"
              name="title"
              value={form.title}
              onChange={handleChange}
              required
              disabled={isSalesEditing}
            />
          </div>

          <div className={isSalesEditing ? disabledStyle : ""}>
            <FormInput
              label="Due Date"
              type="date"
              name="dueDate"
              value={form.dueDate}
              onChange={handleChange}
              disabled={isSalesEditing}
            />
          </div>

          {/* Only editable field for Sales */}
          <FormSelect
            label="Status"
            name="status"
            value={form.status}
            onChange={handleChange}
            options={statusOptions}
          />

          {/* Non-editable for Sales */}
          <div className={isSalesEditing ? disabledStyle : ""}>
            <FormSelect
              label="Priority"
              name="priority"
              value={form.priority}
              onChange={handleChange}
              options={priorityOptions}
              disabled={isSalesEditing}
            />
          </div>

          <div className={isSalesEditing ? disabledStyle : ""}>
            <FormSelect
              label="Assigned To"
              name="assignedTo"
              value={form.assignedTo}
              onChange={handleChange}
              options={[
                { value: "", label: "Select Sales Rep" },
                ...users.map((rep) => ({
                  value: rep._id,
                  label: `${rep.name} (${rep.email})`,
                })),
              ]}
              disabled={isSalesEditing}
            />
          </div>

          <div
            className={`md:col-span-2 ${isSalesEditing ? disabledStyle : ""}`}
          >
            <FormTextarea
              label="Description"
              name="description"
              value={form.description}
              onChange={handleChange}
              rows={3}
              disabled={isSalesEditing}
            />
          </div>

          {(isAdmin() || isSalesEditing) && (
            <button
              type="submit"
              className={`md:col-span-2 flex items-center justify-center gap-2 ${
                isEditing
                  ? "bg-green-600 hover:bg-green-700"
                  : "bg-blue-600 hover:bg-blue-700"
              } text-white font-semibold px-6 py-3 rounded-full transition-colors duration-200`}
            >
              {isEditing ? (
                <>
                  <Edit size={20} /> Update Task
                </>
              ) : (
                <>
                  <Plus size={20} /> Save Task
                </>
              )}
            </button>
          )}
        </form>
      </GlassCard>
    </div>
  );
}
