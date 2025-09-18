import { useEffect, useState } from "react";
import {
  LayoutDashboard,
  Users,
  Target,
  CheckSquare,
  ShoppingCart,
  PieChart,
  BarChart,
} from "lucide-react";
import API from "../services/api.js";
import { useNavigate } from "react-router-dom";
import GlassCard from "../components/GlassCard.jsx";
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement,
} from "chart.js";
import { Pie, Bar } from "react-chartjs-2";

ChartJS.register(
  Title,
  Tooltip,
  Legend,
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement
);

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      labels: {
        color: "#4B5563", // text-gray-600
      },
    },
    tooltip: {
      backgroundColor: "rgba(255, 255, 255, 0.9)",
      titleColor: "#111827", // text-gray-900
      bodyColor: "#374151", // text-gray-700
      borderColor: "#E5E7EB",
      borderWidth: 1,
    },
  },
  scales: {
    x: {
      ticks: {
        color: "#6B7280", // text-gray-500
      },
      grid: {
        color: "#E5E7EB", // gray-200
      },
    },
    y: {
      ticks: {
        color: "#6B7280",
      },
      grid: {
        color: "#E5E7EB",
      },
    },
  },
};

export default function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [customers, setCustomers] = useState([]);
  const [leads, setLeads] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [sales, setSales] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return navigate("/");

    API.get("/users/me")
      .then((res) => setUser(res.data))
      .catch(() => {
        localStorage.clear();
        navigate("/");
      });

    const fetchData = async () => {
      const [c, l, t, s] = await Promise.all([
        API.get("/customers"),
        API.get("/leads"),
        API.get("/tasks"),
        API.get("/sales"),
      ]);
      setCustomers(c.data);
      setLeads(l.data);
      setTasks(t.data);
      setSales(s.data);
    };
    fetchData();
  }, [navigate]);

  const stats = [
    {
      label: "Customers",
      value: customers.length,
      icon: <Users size={28} />,
      color: "bg-blue-100 text-blue-600",
    },
    {
      label: "Leads",
      value: leads.length,
      icon: <Target size={28} />,
      color: "bg-green-100 text-green-600",
    },
    {
      label: "Tasks",
      value: tasks.length,
      icon: <CheckSquare size={28} />,
      color: "bg-yellow-100 text-yellow-600",
    },
    {
      label: "Sales",
      value: sales.length,
      icon: <ShoppingCart size={28} />,
      color: "bg-purple-100 text-purple-600",
    },
  ];

  const salesStatusCounts = sales.reduce((acc, s) => {
    acc[s.status] = (acc[s.status] || 0) + 1;
    return acc;
  }, {});
  const salesStatusData = {
    labels: Object.keys(salesStatusCounts),
    datasets: [
      {
        data: Object.values(salesStatusCounts),
        backgroundColor: ["#facc15", "#3b82f6", "#22c55e", "#ef4444"],
        borderColor: "rgba(255, 255, 255, 0.1)",
      },
    ],
  };

  const monthlySales = sales.reduce((acc, s) => {
    const month = new Date(s.date).toLocaleString("default", {
      month: "short",
    });
    acc[month] = (acc[month] || 0) + s.amount;
    return acc;
  }, {});
  const monthlySalesData = {
    labels: Object.keys(monthlySales),
    datasets: [
      {
        label: "Sales Amount",
        data: Object.values(monthlySales),
        backgroundColor: "#3b82f6",
        borderColor: "#3b82f6",
        borderWidth: 1,
      },
    ],
  };

  const leadStatusCounts = leads.reduce((acc, l) => {
    acc[l.status] = (acc[l.status] || 0) + 1;
    return acc;
  }, {});
  const leadStatusData = {
    labels: Object.keys(leadStatusCounts),
    datasets: [
      {
        data: Object.values(leadStatusCounts),
        backgroundColor: ["#3b82f6", "#22c55e", "#f59e0b", "#ef4444"],
        borderColor: "rgba(255, 255, 255, 0.1)",
      },
    ],
  };

  const taskStatusCounts = tasks.reduce((acc, t) => {
    acc[t.status] = (acc[t.status] || 0) + 1;
    return acc;
  }, {});
  const taskStatusData = {
    labels: Object.keys(taskStatusCounts),
    datasets: [
      {
        data: Object.values(taskStatusCounts),
        backgroundColor: ["#facc15", "#3b82f6", "#22c55e"],
        borderColor: "rgba(255, 255, 255, 0.1)",
      },
    ],
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 p-16 pt-16">
      {/* Welcome & Dashboard Title */}
      <div className="flex justify-between items-center mb-12">
        <div className="flex items-center gap-4">
          <LayoutDashboard size={40} className="text-blue-600" />
          <h1 className="text-4xl font-extrabold tracking-tight text-gray-900">
            CRM Dashboard
          </h1>
        </div>
        {user && (
          <p className="text-xl font-medium text-gray-600">
            Welcome, <span className="text-gray-900">{user.name}</span> 🎉
          </p>
        )}
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {stats.map((stat, i) => (
          <GlassCard key={i} className="p-6 flex items-center gap-6">
            <div className={`p-4 rounded-3xl ${stat.color}`}>{stat.icon}</div>
            <div>
              <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider">
                {stat.label}
              </p>
              <h2 className="text-4xl font-bold text-gray-900 mt-1">
                {stat.value}
              </h2>
            </div>
          </GlassCard>
        ))}
      </div>

      <div className="px-16">
        {/* Charts Section - Now with 2 cards per row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
          {/* Sales Status Chart */}
          <GlassCard className="p-6">
            <div className="flex items-center gap-3 mb-4 text-gray-700">
              <PieChart size={24} />
              <h2 className="text-xl font-semibold">Sales Status</h2>
            </div>
            <div className="h-64">
              <Pie data={salesStatusData} options={chartOptions} />
            </div>
          </GlassCard>

          {/* Monthly Sales Chart */}
          <GlassCard className="p-6">
            <div className="flex items-center gap-3 mb-4 text-gray-700">
              <BarChart size={24} />
              <h2 className="text-xl font-semibold">Monthly Sales</h2>
            </div>
            <div className="h-64">
              <Bar data={monthlySalesData} options={chartOptions} />
            </div>
          </GlassCard>

          {/* Leads Status Chart */}
          <GlassCard className="p-6">
            <div className="flex items-center gap-3 mb-4 text-gray-700">
              <PieChart size={24} />
              <h2 className="text-xl font-semibold">Leads Status</h2>
            </div>
            <div className="h-64">
              <Pie data={leadStatusData} options={chartOptions} />
            </div>
          </GlassCard>

          {/* Tasks Status Chart */}
          <GlassCard className="p-6">
            <div className="flex items-center gap-3 mb-4 text-gray-700">
              <PieChart size={24} />
              <h2 className="text-xl font-semibold">Tasks Status</h2>
            </div>
            <div className="h-64">
              <Pie data={taskStatusData} options={chartOptions} />
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  );
}
