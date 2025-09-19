import { useEffect, useState, useRef } from "react";
import {
  Layers,
  Users,
  Target,
  CheckSquare,
  ShoppingCart,
  PieChart,
  BarChart,
  ChartBar,
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
import { CSVLink } from "react-csv";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

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
    legend: { labels: { color: "#4B5563" } },
    tooltip: {
      backgroundColor: "rgba(255, 255, 255, 0.9)",
      titleColor: "#111827",
      bodyColor: "#374151",
      borderColor: "#E5E7EB",
      borderWidth: 1,
    },
  },
  scales: {
    x: { ticks: { color: "#6B7280" }, grid: { color: "#E5E7EB" } },
    y: { ticks: { color: "#6B7280" }, grid: { color: "#E5E7EB" } },
  },
};

// 🔹 Helper to calculate MoM change safely
const calculateMoMChange = (current, previous) => {
  if (!previous || previous === 0) return null; // no valid comparison
  return ((current - previous) / previous) * 100;
};

export default function Dashboard() {
  const navigate = useNavigate();
  const dashboardRef = useRef();
  const [user, setUser] = useState(null);
  const [customers, setCustomers] = useState([]);
  const [leads, setLeads] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchUserAndData = async () => {
    try {
      const { data: currentUser } = await API.get("/users/me");
      setUser(currentUser);

      const [cRes, lRes, tRes, sRes] = await Promise.all([
        API.get("/customers"),
        API.get("/leads"),
        API.get("/tasks"),
        API.get("/sales"),
      ]);

      setCustomers(cRes.data);
      setLeads(lRes.data);
      setTasks(tRes.data);
      setSales(sRes.data);
    } catch (err) {
      console.error(err);
      localStorage.clear();
      navigate("/");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserAndData();
    const interval = setInterval(fetchUserAndData, 30000); // refresh every 30s
    return () => clearInterval(interval);
  }, [navigate]);

  if (loading)
    return (
      <div className="p-16 text-gray-700 text-xl">Loading Dashboard...</div>
    );

  const isAdmin = user?.role === "admin";

  // 🔹 Filtering data based on role
  const filteredCustomers = isAdmin
    ? customers
    : customers.filter((c) => c.assignedRep?._id === user._id);
  const filteredLeads = isAdmin
    ? leads
    : leads.filter((l) => l.assignedRep?._id === user._id);
  const filteredTasks = isAdmin
    ? tasks
    : tasks.filter((t) => t.assignedTo?._id === user._id);
  const filteredSales = isAdmin
    ? sales
    : sales.filter((s) => s.assignedRep?._id === user._id);

  // 🔹 Current & Previous month
  const currentMonth = new Date().getMonth();
  const previousMonth = currentMonth === 0 ? 11 : currentMonth - 1;

  // 🔹 Month-over-Month counts
  const customersThisMonth = filteredCustomers.filter(
    (c) => new Date(c.createdAt).getMonth() === currentMonth
  ).length;
  const customersLastMonth = filteredCustomers.filter(
    (c) => new Date(c.createdAt).getMonth() === previousMonth
  ).length;

  const leadsThisMonth = filteredLeads.filter(
    (l) => new Date(l.createdAt).getMonth() === currentMonth
  ).length;
  const leadsLastMonth = filteredLeads.filter(
    (l) => new Date(l.createdAt).getMonth() === previousMonth
  ).length;

  const tasksThisMonth = filteredTasks.filter(
    (t) => new Date(t.createdAt).getMonth() === currentMonth
  ).length;
  const tasksLastMonth = filteredTasks.filter(
    (t) => new Date(t.createdAt).getMonth() === previousMonth
  ).length;

  const salesThisMonth = filteredSales.filter(
    (s) => new Date(s.date).getMonth() === currentMonth
  ).length;
  const salesLastMonth = filteredSales.filter(
    (s) => new Date(s.date).getMonth() === previousMonth
  ).length;

  // 🔹 Stats with MoM change
  const stats = [
    {
      label: "Customers",
      value: filteredCustomers.length,
      change: calculateMoMChange(customersThisMonth, customersLastMonth),
      icon: <Users size={28} />,
      color: "bg-blue-100 text-blue-600",
    },
    {
      label: "Leads",
      value: filteredLeads.length,
      change: calculateMoMChange(leadsThisMonth, leadsLastMonth),
      icon: <Target size={28} />,
      color: "bg-green-100 text-green-600",
    },
    {
      label: "Tasks",
      value: filteredTasks.length,
      change: calculateMoMChange(tasksThisMonth, tasksLastMonth),
      icon: <CheckSquare size={28} />,
      color: "bg-yellow-100 text-yellow-600",
    },
    {
      label: "Sales",
      value: filteredSales.length,
      change: calculateMoMChange(salesThisMonth, salesLastMonth),
      icon: <ShoppingCart size={28} />,
      color: "bg-purple-100 text-purple-600",
    },
  ];

  // 🔹 Chart Data Generators
  const generateStatusData = (items, colors) => {
    const counts = items.reduce((acc, item) => {
      acc[item.status] = (acc[item.status] || 0) + 1;
      return acc;
    }, {});
    return {
      labels: Object.keys(counts),
      datasets: [
        {
          data: Object.values(counts),
          backgroundColor: colors,
          borderColor: "rgba(255,255,255,0.1)",
        },
      ],
    };
  };

  const salesStatusData = generateStatusData(filteredSales, [
    "#facc15",
    "#3b82f6",
    "#22c55e",
    "#ef4444",
  ]);
  const leadStatusData = generateStatusData(filteredLeads, [
    "#3b82f6",
    "#22c55e",
    "#f59e0b",
    "#ef4444",
  ]);
  const taskStatusData = generateStatusData(filteredTasks, [
    "#facc15",
    "#3b82f6",
    "#22c55e",
  ]);

  const monthlySales = filteredSales.reduce((acc, s) => {
    const month = new Date(s.date).toLocaleString("default", {
      month: "short",
    });
    acc[month] = (acc[month] || 0) + s.amount;
    return acc;
  }, {});
  const monthOrder = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const sortedMonths = Object.keys(monthlySales).sort(
    (a, b) => monthOrder.indexOf(a) - monthOrder.indexOf(b)
  );
  const monthlySalesData = {
    labels: sortedMonths,
    datasets: [
      {
        label: "Sales Amount",
        data: sortedMonths.map((m) => monthlySales[m]),
        backgroundColor: "#3b82f6",
        borderColor: "#3b82f6",
        borderWidth: 1,
      },
    ],
  };

  // 🔹 CSV export
  const csvData = [
    ["Type", "Name", "Status", "Amount/ID"],
    ...filteredCustomers.map((c) => ["Customer", c.name, "-", c._id]),
    ...filteredLeads.map((l) => ["Lead", l.name, l.status, l._id]),
    ...filteredTasks.map((t) => ["Task", t.title, t.status, t._id]),
    ...filteredSales.map((s) => [
      "Sale",
      s.customerId?.name || "-",
      s.status,
      s.amount,
    ]),
  ];

  // 🔹 PDF export
  const handlePDFExport = async () => {
    if (!dashboardRef.current) return;
    const canvas = await html2canvas(dashboardRef.current, { scale: 2 });
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "mm", "a4");
    const imgProps = pdf.getImageProperties(imgData);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
    pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
    pdf.save("dashboard-report.pdf");
  };

  return (
    <div
      ref={dashboardRef}
      className="min-h-screen bg-gray-50 text-gray-800 p-16 pt-16"
    >
      {/* Header */}
      <div className="flex justify-between items-center mb-12">
        <div className="flex items-center gap-4">
          <Layers size={48} className="text-blue-600" />
          <h1 className="text-4xl font-extrabold tracking-tight text-gray-900">
            Overview
          </h1>
        </div>
        {user && (
          <div className="flex flex-col items-end">
            <p className="text-lg font-medium text-gray-600">Welcome back,</p>
            <h2 className="text-3xl font-bold text-gray-900">{user.name}</h2>
          </div>
        )}
      </div>

      {/* Stats Section with MoM Highlights */}
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
              {stat.change === null ? (
                <p className="text-sm text-gray-400 mt-1">
                  ◕ No comparison available
                </p>
              ) : (
                <p
                  className={`text-sm font-medium mt-1 ${
                    stat.change >= 0 ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {stat.change >= 0 ? "▲" : "▼"}{" "}
                  {Math.abs(stat.change).toFixed(1)}% vs last month
                </p>
              )}
            </div>
          </GlassCard>
        ))}
      </div>

      {/* Analytics Header */}
      <div className="flex items-center justify-center gap-4 mb-6 py-8">
        <ChartBar size={32} className="text-blue-600" />
        <h2 className="text-3xl font-extrabold tracking-tight text-gray-900">
          Report Summary
        </h2>
      </div>

      {/* Charts Section */}
      <div className="px-24 grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Sales Status */}
        <GlassCard className="p-6 h-96 flex flex-col">
          <div className="flex items-center gap-3 mb-4 text-gray-700">
            <PieChart size={24} />
            <h2 className="text-xl font-semibold">Sales Status</h2>
          </div>
          <div className="flex-1">
            {filteredSales.length ? (
              <Pie data={salesStatusData} options={chartOptions} />
            ) : (
              <p>No sales data available</p>
            )}
          </div>
        </GlassCard>

        {/* Monthly Sales (Admin only) */}
        {isAdmin && (
          <GlassCard className="p-6 h-96 flex flex-col">
            <div className="flex items-center gap-3 mb-4 text-gray-700">
              <BarChart size={24} />
              <h2 className="text-xl font-semibold">Monthly Sales</h2>
            </div>
            <div className="flex-1">
              {filteredSales.length ? (
                <Bar data={monthlySalesData} options={chartOptions} />
              ) : (
                <p>No sales data available</p>
              )}
            </div>
          </GlassCard>
        )}

        {/* Leads Status */}
        <GlassCard className="p-6 h-96 flex flex-col">
          <div className="flex items-center gap-3 mb-4 text-gray-700">
            <PieChart size={24} />
            <h2 className="text-xl font-semibold">Leads Status</h2>
          </div>
          <div className="flex-1">
            {filteredLeads.length ? (
              <Pie data={leadStatusData} options={chartOptions} />
            ) : (
              <p>No leads data available</p>
            )}
          </div>
        </GlassCard>

        {/* Tasks Status */}
        <GlassCard className="p-6 h-96 flex flex-col">
          <div className="flex items-center gap-3 mb-4 text-gray-700">
            <PieChart size={24} />
            <h2 className="text-xl font-semibold">Tasks Status</h2>
          </div>
          <div className="flex-1">
            {filteredTasks.length ? (
              <Pie data={taskStatusData} options={chartOptions} />
            ) : (
              <p>No tasks data available</p>
            )}
          </div>
        </GlassCard>
      </div>

      {/* Footer */}
      <div className="mt-12 text-center text-gray-700 text-lg space-y-2">
        <p>
          You can download the complete analytics report in{" "}
          <CSVLink
            data={csvData}
            filename="dashboard-report.csv"
            className="text-blue-600 font-medium"
          >
            CSV
          </CSVLink>{" "}
          or{" "}
          <button
            onClick={handlePDFExport}
            className="text-blue-600 font-medium"
          >
            PDF
          </button>{" "}
          format for your records.
        </p>
        <p className="text-gray-500 text-sm">
          Last Updated:{" "}
          {new Date().toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "short",
            year: "numeric",
          })}
        </p>
      </div>
    </div>
  );
}
