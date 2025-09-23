import { useState, useEffect, useRef } from "react";
import { Bell, CheckCheck } from "lucide-react";
import { useNotifications } from "./NotificationContext.jsx";

export default function NotificationBell() {
  const { notifications, unseenCount, loading, markOneSeen, markAllSeen } =
    useNotifications();

  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Bell Icon */}
      <button
        onClick={() => setOpen(!open)}
        className="relative p-2 rounded-full hover:bg-gray-200 transition"
      >
        <Bell className="w-6 h-6 text-gray-700" />
        {unseenCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full">
            {unseenCount}
          </span>
        )}
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute right-0 mt-2 w-80 bg-white shadow-lg rounded-3xl border border-gray-300 z-50">
          <div className="flex items-center justify-between px-4 py-2 border-b border-gray-200">
            <h3 className="text-sm font-semibold text-gray-800">
              Notifications
            </h3>
            {unseenCount > 0 && (
              <button
                onClick={markAllSeen}
                className="text-xs text-blue-600 hover:underline"
              >
                Mark all as seen
              </button>
            )}
          </div>

          <div className="max-h-64 overflow-y-auto">
            {loading ? (
              <p className="p-4 text-sm text-gray-500">Loading...</p>
            ) : notifications.length === 0 ? (
              <p className="p-4 text-sm text-gray-500">No notifications</p>
            ) : (
              notifications.map((n) => (
                <div
                  key={n._id}
                  className={`px-4 py-2 text-sm flex items-start gap-2 cursor-pointer hover:bg-gray-100 ${
                    !n.seen ? "font-medium bg-blue-50" : ""
                  }`}
                  onClick={() => markOneSeen(n._id)}
                >
                  {!n.seen && (
                    <span className="mt-1">
                      <CheckCheck className="w-4 h-4 text-green-500" />
                    </span>
                  )}
                  <div>
                    <p className="text-gray-800">{n.message}</p>
                    {n.taskId && (
                      <p className="text-xs text-gray-500">
                        Related Task: {n.taskId.title}
                      </p>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
