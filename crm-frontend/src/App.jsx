import { Routes, Route, useLocation } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Navbar from "./components/Navbar.jsx";
import Customers from "./pages/Customers.jsx";
import Leads from "./pages/Leads.jsx";
import Tasks from "./pages/Tasks.jsx";
import Sales from "./pages/Sales.jsx";
import CustomerForm from "./pages/form_pages/CustomerForm.jsx";
import LeadForm from "./pages/form_pages/LeadForm.jsx";
import TaskForm from "./pages/form_pages/TaskForm.jsx";
import SaleForm from "./pages/form_pages/SaleForm.jsx";

export default function App() {
  const location = useLocation();

  const hideNavbar = ["/", "/register"].includes(location.pathname);

  return (
    <div className="min-h-screen bg-gray-100">
      <Toaster
        position="top-center"
        toastOptions={{
          duration: 3000,
          style: {
            background: "#fff",
            color: "#333",
            fontSize: "14px",
            borderRadius: "8px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
          },
          success: { iconTheme: { primary: "#10B981", secondary: "#fff" } },
          error: { iconTheme: { primary: "#EF4444", secondary: "#fff" } },
        }}
      />

      {!hideNavbar && <Navbar />}

      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />

        {/* CRUD pages */}
        <Route path="/customers" element={<Customers />} />
        <Route path="/customers/new" element={<CustomerForm />} />
        <Route path="/customers/:id/edit" element={<CustomerForm />} />

        <Route path="/leads" element={<Leads />} />
        <Route path="/leads/new" element={<LeadForm />} />
        <Route path="/leads/:id/edit" element={<LeadForm />} />

        <Route path="/tasks" element={<Tasks />} />
        <Route path="/tasks/new" element={<TaskForm />} />
        <Route path="/tasks/:id/edit" element={<TaskForm />} />

        <Route path="/sales" element={<Sales />} />
        <Route path="/sales/new" element={<SaleForm />} />
        <Route path="/sales/:id/edit" element={<SaleForm />} />
      </Routes>
    </div>
  );
}
