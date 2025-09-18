import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import GlassCard from "../../components/GlassCard.jsx";
import API from "../../services/api.js";
import { DollarSign, Plus } from "lucide-react";

export default function SaleForm() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    customerId: "",
    amount: "",
    status: "Prospecting",
    date: "",
    assignedRep: "",
  });

  const [customers, setCustomers] = useState([]);

  // Fetch customers for dropdown
  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const { data } = await API.get("/customers");
        setCustomers(data);
      } catch (err) {
        console.error("Error fetching customers", err);
      }
    };
    fetchCustomers();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.post("/sales", form);
      navigate("/sales");
    } catch (err) {
      console.error("Error adding sale", err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 p-8 pt-24 flex items-start justify-center">
      <GlassCard className="w-full max-w-2xl p-8">
        <h2 className="text-3xl font-bold mb-8 text-gray-800 flex items-center gap-2">
          <DollarSign size={28} className="text-blue-600" />
          Record New Sale
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
            <select
              name="customerId"
              value={form.customerId}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200 bg-white"
              required
            >
              <option value="">Select Customer</option>
              {customers.map((c) => (
                <option key={c._id} value={c._id}>
                  {c.name} ({c.email})
                </option>
              ))}
            </select>
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
              className="w-full p-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200"
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
              className="w-full p-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200 bg-white"
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
              value={form.date}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200"
              required
            />
          </div>

          {/* Assigned Rep */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Assigned Rep
            </label>
            <input
              type="text"
              name="assignedRep"
              value={form.assignedRep}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200"
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="md:col-span-2 flex items-center justify-center gap-2 bg-blue-600 text-white font-semibold px-6 py-3 rounded-full hover:bg-blue-700 transition-colors duration-200"
          >
            <Plus size={20} />
            Record Sale
          </button>
        </form>
      </GlassCard>
    </div>
  );
}
