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
import Chart from "react-apexcharts";
import { CSVLink } from "react-csv";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import toast from "react-hot-toast";

// 🔹 MoM Change Helper
const calculateMoMChange = (current, previous) => {
  if (!previous || previous === 0) return null;
  return ((current - previous) / previous) * 100;
};

// 🔹 Skeleton Components
const StatsSkeleton = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
    {[...Array(4)].map((_, i) => (
      <div
        key={i}
        className="p-6 rounded-2xl bg-white shadow animate-pulse flex items-center gap-6"
      >
        <div className="w-12 h-12 bg-gray-200 rounded-2xl"></div>
        <div className="flex-1 space-y-3">
          <div className="h-3 bg-gray-200 rounded w-20"></div>
          <div className="h-6 bg-gray-200 rounded w-16"></div>
          <div className="h-3 bg-gray-200 rounded w-24"></div>
        </div>
      </div>
    ))}
  </div>
);

const ChartSkeleton = () => (
  <div className="p-6 h-96 rounded-2xl bg-white shadow animate-pulse">
    <div className="h-6 w-32 bg-gray-200 rounded mb-4"></div>
    <div className="h-full w-full bg-gray-200 rounded"></div>
  </div>
);

const HeaderSkeleton = () => (
  <div className="flex justify-between items-center mb-12">
    <div className="flex items-center gap-4">
      <div className="w-12 h-12 bg-gray-200 rounded-full animate-pulse" />
      <div className="h-8 w-40 bg-gray-200 rounded animate-pulse" />
    </div>
    <div className="flex flex-col items-end gap-2">
      <div className="h-4 w-28 bg-gray-200 rounded animate-pulse" />
      <div className="h-6 w-32 bg-gray-200 rounded animate-pulse" />
    </div>
  </div>
);

const SectionTitleSkeleton = () => (
  <div className="flex items-center justify-center gap-4 mb-6 py-8">
    <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse" />
    <div className="h-8 w-48 bg-gray-200 rounded animate-pulse" />
  </div>
);

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
      toast.error("Failed to load dashboard data");
      localStorage.clear();
      navigate("/");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserAndData();
    const interval = setInterval(fetchUserAndData, 30000);
    return () => clearInterval(interval);
  }, [navigate]);

  if (loading)
    return (
      <div className="p-16 space-y-12">
        <HeaderSkeleton />
        <StatsSkeleton />
        <SectionTitleSkeleton />
        <div className="px-24 grid grid-cols-1 lg:grid-cols-2 gap-12">
          <ChartSkeleton />
          <ChartSkeleton />
          <ChartSkeleton />
          <ChartSkeleton />
        </div>
      </div>
    );

  const isAdmin = user?.role === "admin";

  // 🔹 Filtered data
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

  // 🔹 MoM stats
  const currentMonth = new Date().getMonth();
  const previousMonth = currentMonth === 0 ? 11 : currentMonth - 1;

  const countByMonth = (items, key) =>
    items.filter((i) => new Date(i[key]).getMonth() === currentMonth).length;
  const countByPrevMonth = (items, key) =>
    items.filter((i) => new Date(i[key]).getMonth() === previousMonth).length;

  const stats = [
    {
      label: "Customers",
      value: filteredCustomers.length,
      change: calculateMoMChange(
        countByMonth(filteredCustomers, "createdAt"),
        countByPrevMonth(filteredCustomers, "createdAt")
      ),
      icon: <Users size={28} />,
      color: "bg-blue-100 text-blue-600",
    },
    {
      label: "Leads",
      value: filteredLeads.length,
      change: calculateMoMChange(
        countByMonth(filteredLeads, "createdAt"),
        countByPrevMonth(filteredLeads, "createdAt")
      ),
      icon: <Target size={28} />,
      color: "bg-green-100 text-green-600",
    },
    {
      label: "Tasks",
      value: filteredTasks.length,
      change: calculateMoMChange(
        countByMonth(filteredTasks, "createdAt"),
        countByPrevMonth(filteredTasks, "createdAt")
      ),
      icon: <CheckSquare size={28} />,
      color: "bg-yellow-100 text-yellow-600",
    },
    {
      label: "Sales",
      value: filteredSales.length,
      change: calculateMoMChange(
        countByMonth(filteredSales, "date"),
        countByPrevMonth(filteredSales, "date")
      ),
      icon: <ShoppingCart size={28} />,
      color: "bg-purple-100 text-purple-600",
    },
  ];

  // 🔹 ApexCharts data
  const getStatusChart = (items) => {
    const counts = items.reduce((acc, item) => {
      acc[item.status] = (acc[item.status] || 0) + 1;
      return acc;
    }, {});
    return {
      series: Object.values(counts),
      options: {
        chart: {
          type: "donut",
          animations: { enabled: true, easing: "easeinout", speed: 800 },
        },
        labels: Object.keys(counts),
        legend: { position: "bottom", labels: { colors: "#374151" } },
        colors: ["#facc15", "#3b82f6", "#22c55e", "#ef4444"],
        plotOptions: {
          pie: { donut: { size: "70%" } },
        },
        dataLabels: { enabled: true, style: { colors: ["#111827"] } },
        theme: { mode: "light" },
        tooltip: {
          theme: "light",
          style: { fontSize: "14px" },
        },
      },
    };
  };

  const salesStatusChart = getStatusChart(filteredSales);
  const leadStatusChart = getStatusChart(filteredLeads);
  const taskStatusChart = getStatusChart(filteredTasks);

  // Monthly sales
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
  const monthlySalesChart = {
    series: [
      {
        name: "Sales",
        data: sortedMonths.map((m) => monthlySales[m]),
      },
    ],
    options: {
      chart: {
        type: "bar",
        animations: { enabled: true, easing: "easeout", speed: 1000 },
      },
      xaxis: {
        categories: sortedMonths,
        labels: { style: { colors: "#374151" } },
      },
      yaxis: { labels: { style: { colors: "#374151" } } },
      colors: ["#3b82f6"],
      theme: { mode: "light" },
      dataLabels: { enabled: false },
      grid: { borderColor: "#E5E7EB" },
      tooltip: {
        theme: "light",
        style: { fontSize: "14px" },
      },
    },
  };

  // Export CSV/PDF
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

  const handlePDFExport = async () => {
    if (!dashboardRef.current) return;
    try {
      const canvas = await html2canvas(dashboardRef.current, { scale: 2 });
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save("dashboard-report.pdf");
      toast.success("Dashboard exported as PDF");
    } catch {
      toast.error("Failed to export PDF");
    }
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

      {/* Stats */}
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
                <p className="text-sm text-gray-400 mt-1">◕ No comparison</p>
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
        <GlassCard className="p-6 h-96 flex flex-col">
          <div className="flex items-center gap-3 mb-4 text-gray-700">
            <PieChart size={24} />
            <h2 className="text-xl font-semibold">Sales Status</h2>
          </div>
          <div className="flex-1">
            {filteredSales.length ? (
              <Chart
                options={salesStatusChart.options}
                series={salesStatusChart.series}
                type="donut"
                height="100%"
              />
            ) : (
              <p>No sales data</p>
            )}
          </div>
        </GlassCard>

        {isAdmin && (
          <GlassCard className="p-6 h-96 flex flex-col">
            <div className="flex items-center gap-3 mb-4 text-gray-700">
              <BarChart size={24} />
              <h2 className="text-xl font-semibold">Monthly Sales</h2>
            </div>
            <div className="flex-1">
              {filteredSales.length ? (
                <Chart
                  options={monthlySalesChart.options}
                  series={monthlySalesChart.series}
                  type="bar"
                  height="100%"
                />
              ) : (
                <p>No sales data</p>
              )}
            </div>
          </GlassCard>
        )}

        <GlassCard className="p-6 h-96 flex flex-col">
          <div className="flex items-center gap-3 mb-4 text-gray-700">
            <PieChart size={24} />
            <h2 className="text-xl font-semibold">Leads Status</h2>
          </div>
          <div className="flex-1">
            {filteredLeads.length ? (
              <Chart
                options={leadStatusChart.options}
                series={leadStatusChart.series}
                type="donut"
                height="100%"
              />
            ) : (
              <p>No leads data</p>
            )}
          </div>
        </GlassCard>

        <GlassCard className="p-6 h-96 flex flex-col">
          <div className="flex items-center gap-3 mb-4 text-gray-700">
            <PieChart size={24} />
            <h2 className="text-xl font-semibold">Tasks Status</h2>
          </div>
          <div className="flex-1">
            {filteredTasks.length ? (
              <Chart
                options={taskStatusChart.options}
                series={taskStatusChart.series}
                type="donut"
                height="100%"
              />
            ) : (
              <p>No tasks data</p>
            )}
          </div>
        </GlassCard>
      </div>

      {/* Footer */}
      <div className="mt-12 text-center text-gray-700 text-lg space-y-2">
        <p>
          You can download the report in{" "}
          <CSVLink
            data={csvData}
            filename="dashboard-report.csv"
            className="text-blue-600 font-medium"
            onClick={() => toast.success("CSV exported 📊")}
          >
            CSV
          </CSVLink>{" "}
          or{" "}
          <button
            onClick={handlePDFExport}
            className="text-blue-600 font-medium"
          >
            PDF
          </button>
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
