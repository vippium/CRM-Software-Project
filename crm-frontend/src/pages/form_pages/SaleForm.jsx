import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import GlassCard from "../../components/GlassCard.jsx";
import API from "../../services/api.js";
import { DollarSign, Plus, Edit } from "lucide-react";
import { isAdmin } from "../../services/auth.js";

export default function SaleForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = !!id;

  const [form, setForm] = useState({
    customerId: "",
    amount: "",
    status: "Prospecting",
    date: "",
    assignedRep: "",
  });

  const [customers, setCustomers] = useState([]);
  const [reps, setReps] = useState([]);

  // Fetch customers (for new sale form only)
  useEffect(() => {
    if (!isEditing) {
      API.get("/customers")
        .then((res) => setCustomers(res.data))
        .catch((err) => console.error("Error fetching customers", err));
    }
  }, [isEditing]);

  // Fetch reps (for both new & edit)
  useEffect(() => {
    API.get("/users/sales-reps")
      .then((res) => setReps(res.data))
      .catch((err) => console.error("Error fetching sales reps", err));
  }, []);

  // Fetch sale details in edit mode
  useEffect(() => {
    if (isEditing) {
      API.get(`/sales/${id}`)
        .then((res) => setForm(res.data))
        .catch((err) => {
          console.error("Error fetching sale", err);
          navigate("/sales");
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
        await API.put(`/sales/${id}`, {
          status: form.status,
          ...(isAdmin() && form),
        });
      } else {
        if (!isAdmin()) return;
        await API.post("/sales", form);
      }
      navigate("/sales");
    } catch (err) {
      console.error("Error saving sale", err);
    }
  };

  const isReadOnly = isEditing && !isAdmin();

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 p-8 pt-24 flex items-start justify-center">
      <GlassCard className="w-full max-w-2xl p-8">
        <h2 className="text-3xl font-bold mb-8 text-gray-800 flex items-center gap-2">
          {isEditing ? (
            <>
              <Edit size={28} className="text-green-600" /> Update Sale Status
            </>
          ) : (
            <>
              <DollarSign size={28} className="text-blue-600" /> Record New Sale
            </>
          )}
        </h2>

        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-2 gap-3"
        >
          {/* Customer Dropdown */}
          <div className="md:col-span-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Customer *
            </label>
            {isEditing ? (
              <input
                type="text"
                value={form.customerId?.name || "N/A"}
                disabled
                className="w-full p-2 border border-gray-200 rounded-full bg-gray-100"
              />
            ) : (
              <select
                name="customerId"
                value={form.customerId}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-full focus:ring-2 focus:ring-blue-500 bg-white"
                required
              >
                <option value="">Select Customer</option>
                {customers.map((c) => (
                  <option key={c._id} value={c._id}>
                    {c.name} ({c.email})
                  </option>
                ))}
              </select>
            )}
          </div>

          {/* Amount */}
          <div className="md:col-span-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Amount *
            </label>
            <input
              type="number"
              name="amount"
              value={form.amount}
              onChange={handleChange}
              disabled={isReadOnly}
              className={`w-full p-2 border rounded-full ${
                isReadOnly
                  ? "border-gray-200 bg-gray-100"
                  : "border-gray-300 focus:ring-2 focus:ring-blue-500"
              }`}
              required
            />
          </div>

          {/* Status */}
          <div className="md:col-span-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Status
            </label>
            <select
              name="status"
              value={form.status}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-full focus:ring-2 focus:ring-blue-500 bg-white"
            >
              <option value="Prospecting">Prospecting</option>
              <option value="Negotiation">Negotiation</option>
              <option value="Closed-Won">Closed-Won</option>
              <option value="Closed-Lost">Closed-Lost</option>
            </select>
          </div>

          {/* Date */}
          <div className="md:col-span-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Date *
            </label>
            <input
              type="date"
              name="date"
              value={form.date ? form.date.split("T")[0] : ""}
              onChange={handleChange}
              disabled={isReadOnly}
              className={`w-full p-2 border rounded-full ${
                isReadOnly
                  ? "border-gray-200 bg-gray-100"
                  : "border-gray-300 focus:ring-2 focus:ring-blue-500"
              }`}
              required
            />
          </div>

          {/* Assigned Rep Dropdown */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Assigned Rep
            </label>
            {isEditing && !isAdmin() ? (
              <input
                type="text"
                value={form.assignedRep?.name || "Unassigned"}
                disabled
                className="w-full p-2 border border-gray-200 rounded-full bg-gray-100"
              />
            ) : (
              <select
                name="assignedRep"
                value={form.assignedRep?._id || ""}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-full focus:ring-2 focus:ring-blue-500 bg-white"
              >
                <option value="">Select a Rep</option>
                {reps.map((rep) => (
                  <option key={rep._id} value={rep._id}>
                    {rep.name} ({rep.email})
                  </option>
                ))}
              </select>
            )}
          </div>

          {/* Submit */}
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
                <Edit size={20} /> Update Status
              </>
            ) : (
              <>
                <Plus size={20} /> Record Sale
              </>
            )}
          </button>
        </form>
      </GlassCard>
    </div>
  );
}
