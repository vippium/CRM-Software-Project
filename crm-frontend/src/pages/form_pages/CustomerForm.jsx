import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import GlassCard from "../../components/GlassCard.jsx";
import API from "../../services/api.js";
import { UserPlus, Edit3 } from "lucide-react";
import FormInput from "../../components/FormInput.jsx";
import FormTextarea from "../../components/FormTextarea.jsx";
import FormSelect from "../../components/FormSelect.jsx";
import { isAdmin, isSales } from "../../services/auth.js";

export default function CustomerForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = !!id;

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    address: "",
    assignedRep: "",
    notes: "",
  });

  const [reps, setReps] = useState([]);

  if (!isAdmin() && !(isSales() && isEditing)) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-center p-8">
        <img
          src="/public/restricted_access.png"
          alt="Access Denied"
          className="w-96 mb-2"
        />
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          Access Restricted
        </h2>
        <p className="text-gray-600 max-w-md">
          You don’t have permission to view this page. Please contact your
          administrator if you think this is a mistake.
        </p>
      </div>
    );
  }

  useEffect(() => {
    API.get("/users/sales-reps")
      .then((res) => setReps(res.data))
      .catch((err) => console.error("Error fetching sales reps", err));
  }, []);

  useEffect(() => {
    if (isEditing) {
      API.get(`/customers/${id}`)
        .then((res) => setForm(res.data))
        .catch((err) => console.error("Error fetching customer", err));
    }
  }, [id, isEditing, navigate]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditing) {
        await API.put(`/customers/${id}`, form);
      } else {
        if (!isAdmin()) return;
        await API.post("/customers", form);
      }
      navigate("/customers");
    } catch (err) {
      console.error("Error saving customer", err);
    }
  };

  const assignedRepOptions = [
    { value: "", label: "Select a Rep" },
    ...reps.map((rep) => ({
      value: rep._id,
      label: `${rep.name} (${rep.email})`,
    })),
  ];

  return (
    <div className="fixed inset-0 overflow-hidden flex items-start justify-center p-8 pt-28 bg-gray-50 text-gray-800">
      <GlassCard className="w-full max-w-2xl p-8">
        <h2 className="text-3xl font-bold mb-8 text-gray-800 flex items-center gap-2">
          {isEditing ? (
            <>
              <Edit3 size={28} className="text-green-600" /> Edit Customer
            </>
          ) : (
            <>
              <UserPlus size={28} className="text-blue-600" /> Add New Customer
            </>
          )}
        </h2>

        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-2 gap-3"
        >
          <FormInput
            label="Name"
            name="name"
            value={form.name}
            onChange={handleChange}
            required
          />
          <FormInput
            label="Email"
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            required
          />
          <FormInput
            label="Phone"
            name="phone"
            value={form.phone}
            onChange={handleChange}
          />
          <FormInput
            label="Company"
            name="company"
            value={form.company}
            onChange={handleChange}
          />
          <FormInput
            label="Address"
            name="address"
            value={form.address}
            onChange={handleChange}
          />

          <FormSelect
            label="Assigned Rep"
            name="assignedRep"
            value={form.assignedRep}
            onChange={handleChange}
            options={assignedRepOptions}
          />

          <FormTextarea
            label="Notes"
            name="notes"
            value={form.notes}
            onChange={handleChange}
          />

          {(isAdmin() || (isSales() && isEditing)) && (
            <button
              type="submit"
              className={`md:col-span-2 flex items-center justify-center gap-2 ${
                isEditing
                  ? "bg-green-600 hover:bg-green-700"
                  : "bg-blue-600 hover:bg-blue-700"
              } text-white font-semibold px-6 py-3 rounded-full transition-colors duration-200`}
            >
              {isEditing ? <Edit3 size={20} /> : <UserPlus size={20} />}
              {isEditing ? "Update Customer" : "Save Customer"}
            </button>
          )}
        </form>
      </GlassCard>
    </div>
  );
}
