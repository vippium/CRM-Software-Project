import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import GlassCard from "../../components/GlassCard.jsx";
import API from "../../services/api.js";
import { Target, Plus, Edit } from "lucide-react";
import FormInput from "../../components/FormInput.jsx";
import FormTextarea from "../../components/FormTextarea.jsx";
import FormSelect from "../../components/FormSelect.jsx";
import { isAdmin, isSales } from "../../services/auth.js";

export default function LeadForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = !!id;

  const [form, setForm] = useState({
    name: "",
    contactInfo: { email: "", phone: "" },
    source: "",
    status: "New",
    assignedRep: "",
    notes: "",
  });

  const [salesReps, setSalesReps] = useState([]);

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
    if (isEditing) {
      API.get(`/leads/${id}`)
        .then((res) => {
          setForm({
            ...res.data,
            contactInfo: {
              email: res.data.contactInfo?.email || "",
              phone: res.data.contactInfo?.phone || "",
            },
            assignedRep: res.data.assignedRep?._id || "",
          });
        })
        .catch((err) => {
          console.error("Error fetching lead for edit", err);
          navigate("/leads");
        });
    }
  }, [id, isEditing, navigate]);

  useEffect(() => {
    API.get("/users/sales-reps")
      .then((res) => setSalesReps(res.data))
      .catch((err) => console.error("Error fetching sales reps", err));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (["email", "phone"].includes(name)) {
      setForm({ ...form, contactInfo: { ...form.contactInfo, [name]: value } });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditing) {
        await API.put(`/leads/${id}`, form);
      } else {
        if (!isAdmin()) return;
        await API.post("/leads", form);
      }
      navigate("/leads");
    } catch (err) {
      console.error("Error saving lead", err);
    }
  };

  const sourceOptions = [
    { value: "", label: "Select a source" },
    { value: "Referral", label: "Referral" },
    { value: "Ads", label: "Ads" },
    { value: "Web", label: "Web" },
  ];

  const statusOptions = [
    { value: "New", label: "New" },
    { value: "Contacted", label: "Contacted" },
    { value: "Qualified", label: "Qualified" },
    { value: "Lost", label: "Lost" },
  ];

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 p-8 pt-24 flex items-start justify-center">
      <GlassCard className="w-full max-w-2xl p-8">
        <h2 className="text-3xl font-bold mb-8 text-gray-800 flex items-center gap-2">
          {isEditing ? (
            <>
              <Edit size={28} className="text-green-600" /> Edit Lead
            </>
          ) : (
            isAdmin() && (
              <>
                <Target size={28} className="text-blue-600" /> Add New Lead
              </>
            )
          )}
        </h2>

        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-2 gap-3"
        >
          <FormInput
            label="Name *"
            name="name"
            value={form.name}
            onChange={handleChange}
            required
          />
          <FormInput
            label="Email"
            type="email"
            name="email"
            value={form.contactInfo.email}
            onChange={handleChange}
          />
          <FormInput
            label="Phone"
            name="phone"
            value={form.contactInfo.phone}
            onChange={handleChange}
          />
          <FormSelect
            label="Source"
            name="source"
            value={form.source}
            onChange={handleChange}
            options={sourceOptions}
          />
          <FormSelect
            label="Status"
            name="status"
            value={form.status}
            onChange={handleChange}
            options={statusOptions}
          />

          {/* Assigned Rep Dropdown */}
          <FormSelect
            label="Assigned Rep"
            name="assignedRep"
            value={form.assignedRep}
            onChange={handleChange}
            options={[
              { value: "", label: "Select a rep" },
              ...salesReps.map((rep) => ({
                value: rep._id,
                label: `${rep.name} (${rep.email})`,
              })),
            ]}
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
              {isEditing ? (
                <>
                  <Edit size={20} /> Update Lead
                </>
              ) : (
                <>
                  <Plus size={20} /> Save Lead
                </>
              )}
            </button>
          )}
        </form>
      </GlassCard>
    </div>
  );
}
