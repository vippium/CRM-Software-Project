import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { LogOut, Menu, X, Rocket } from "lucide-react";
import GlassNavbar from "./GlassNavbar.jsx";
import NotificationBell from "./NotificationBell.jsx";
import logo from "../assets/crm_logo.png";

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [user, setUser] = useState(null);

  // Load user from localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) setUser(JSON.parse(storedUser));
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  const links = [
    { path: "/dashboard", label: "Dashboard" },
    { path: "/customers", label: "Customers" },
    { path: "/leads", label: "Leads" },
    { path: "/tasks", label: "Tasks" },
    { path: "/sales", label: "Sales" },
  ];

  return (
    <>
      {/* Glass Navbar */}
      <GlassNavbar>
        {/* Logo */}
        <div className="flex items-center gap-2 font-bold text-2xl tracking-wide text-gray-800">
          <img src={logo} alt="Logo" className="w-14 h-14" />
          <span className="text-slate-800">Vipin's CRM System</span>
        </div>

        {/* Desktop Links */}
        <div className="hidden md:flex gap-2 p-1 text-gray-700">
          {links.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`
                px-5 py-2 rounded-full font-medium transition-all duration-200
                ${
                  location.pathname === link.path
                    ? "bg-blue-100 text-blue-600 shadow-md hover:bg-blue-200"
                    : "hover:bg-gray-200 text-gray-700"
                }
              `}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* User + Notification Bell + Logout (Desktop) */}
        <div className="hidden md:flex items-center gap-5">
          <NotificationBell />

          {user && (
            <span className="text-lg text-gray-700 font-semibold">
              {user.name}
            </span>
          )}
          <button
            onClick={handleLogout}
            className="flex items-center gap-1 bg-red-500 text-white px-3 py-1.5 rounded-full hover:bg-red-600 transition"
          >
            <LogOut size={16} /> Logout
          </button>
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <button onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </GlassNavbar>

      {/* Mobile Dropdown (Glassy) */}
      {menuOpen && (
        <div className="md:hidden fixed top-24 left-1/2 -translate-x-1/2 w-[90%] z-40">
          <div className="backdrop-blur-xl bg-white/20 border border-white/30 shadow-2xl rounded-2xl p-4 space-y-3">
            {links.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setMenuOpen(false)}
                className={`block px-4 py-2 rounded-lg transition-all duration-200 ${
                  location.pathname === link.path
                    ? "bg-blue-600 text-white font-semibold shadow-md"
                    : "hover:bg-blue-100 text-gray-700"
                }`}
              >
                {link.label}
              </Link>
            ))}
            <hr className="border-gray-300 my-2" />
            {user && (
              <div className="text-sm text-gray-700 font-medium mb-2 px-4">
                {user.name}
              </div>
            )}
            <button
              onClick={handleLogout}
              className="flex items-center justify-center gap-1 w-full bg-red-500 text-white py-2 rounded-lg hover:bg-red-600 transition"
            >
              <LogOut size={24} /> Logout
            </button>
          </div>
        </div>
      )}
    </>
  );
}
