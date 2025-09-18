import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import GlassCard from "../../components/GlassCard.jsx";
import FormInput from "../../components/FormInput.jsx";
import FormTextarea from "../../components/FormTextarea.jsx";
import FormSelect from "../../components/FormSelect.jsx";
import API from "../../services/api.js";
import { Plus, ClipboardCheck, Edit } from "lucide-react";

export default function TaskForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = !!id;

  const [form, setForm] = useState({
    title: "",
    description: "",
    dueDate: "",
    status: "Pending",
    priority: "Medium",
    assignedTo: "",
  });

  useEffect(() => {
    if (isEditing) {
      API.get(`/tasks/${id}`)
        .then((res) => {
          // Format date for the input field
          const taskData = {
            ...res.data,
            dueDate: res.data.dueDate ? res.data.dueDate.split("T")[0] : "",
          };
          setForm(taskData);
        })
        .catch((err) => {
          console.error("Error fetching task for edit", err);
          navigate("/tasks");
        });
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
    } catch (err) {
      console.error("Error saving task", err);
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

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 p-8 pt-24 flex items-start justify-center">
      <GlassCard className="w-full max-w-2xl p-8">
        <h2 className="text-3xl font-bold mb-8 text-gray-800 flex items-center gap-2">
          {isEditing ? (
            <>
              <Edit size={28} className="text-blue-600" />
              Edit Task
            </>
          ) : (
            <>
              <ClipboardCheck size={28} className="text-blue-600" />
              Add New Task
            </>
          )}
        </h2>
        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-2 gap-3"
        >
          <FormInput
            label="Title *"
            name="title"
            value={form.title}
            onChange={handleChange}
            required
          />
          <FormInput
            label="Due Date"
            type="date"
            name="dueDate"
            value={form.dueDate}
            onChange={handleChange}
          />
          <FormSelect
            label="Status"
            name="status"
            value={form.status}
            onChange={handleChange}
            options={statusOptions}
          />
          <FormSelect
            label="Priority"
            name="priority"
            value={form.priority}
            onChange={handleChange}
            options={priorityOptions}
          />
          <FormInput
            label="Assigned To"
            name="assignedTo"
            value={form.assignedTo}
            onChange={handleChange}
          />
          <FormTextarea
            label="Description"
            name="description"
            value={form.description}
            onChange={handleChange}
            rows={3}
          />

          <button
            type="submit"
            className="md:col-span-2 flex items-center justify-center gap-2 bg-blue-600 text-white font-semibold px-6 py-3 rounded-full hover:bg-blue-700 transition-colors duration-200"
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
        </form>
      </GlassCard>
    </div>
  );
}
