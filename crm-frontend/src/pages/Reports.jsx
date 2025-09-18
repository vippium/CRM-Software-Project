import { useEffect, useState } from "react";
import GlassCard from "../components/GlassCard.jsx";
import API from "../services/api.js";
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

export default function Reports() {
  const [sales, setSales] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const { data } = await API.get("/sales");
      setSales(data);
    };
    fetchData();
  }, []);

  // 1️⃣ Sales Status Distribution
  const statusCounts = sales.reduce((acc, s) => {
    acc[s.status] = (acc[s.status] || 0) + 1;
    return acc;
  }, {});

  const statusData = {
    labels: Object.keys(statusCounts),
    datasets: [
      {
        data: Object.values(statusCounts),
        backgroundColor: ["#facc15", "#3b82f6", "#22c55e", "#ef4444"],
      },
    ],
  };

  // 2️⃣ Monthly Sales (Sum by Month)
  const monthlySales = sales.reduce((acc, s) => {
    const month = new Date(s.date).toLocaleString("default", {
      month: "short",
    });
    acc[month] = (acc[month] || 0) + s.amount;
    return acc;
  }, {});

  const monthlyData = {
    labels: Object.keys(monthlySales),
    datasets: [
      {
        label: "Sales Amount",
        data: Object.values(monthlySales),
        backgroundColor: "#3b82f6",
      },
    ],
  };

  return (
    <div className="p-6 space-y-8">
      <h1 className="text-2xl font-bold text-gray-800">
        📊 Reports & Analytics
      </h1>

      {/* Sales Status Pie Chart */}
      <GlassCard>
        <h2 className="text-lg font-semibold mb-4">
          Sales Status Distribution
        </h2>
        <Pie data={statusData} />
      </GlassCard>

      {/* Monthly Sales Bar Chart */}
      <GlassCard>
        <h2 className="text-lg font-semibold mb-4">Monthly Sales</h2>
        <Bar data={monthlyData} />
      </GlassCard>
    </div>
  );
}
