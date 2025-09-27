// Sidebar.jsx
import { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
  Home,
  Microscope,
  Lightbulb,
  Leaf,
  ShoppingCart,
  TrendingUp,
  BarChart3,
  Upload,
  Settings,
  PanelLeft,
} from "lucide-react";

const mainItems = [
  { title: "Dashboard", url: "/dashboard", icon: Home },
  { title: "AI Disease Detection", url: "/dashboard/detection", icon: Microscope },
  { title: "Farming Advisory", url: "/dashboard/advisory", icon: Lightbulb },
  { title: "Crop Health", url: "/dashboard/health", icon: Leaf },
];

const marketplaceItems = [
  { title: "My Listings", url: "/dashboard/listings", icon: ShoppingCart },
  { title: "Marketplace", url: "/dashboard/marketplace", icon: TrendingUp },
  { title: "Analytics", url: "/dashboard/analytics", icon: BarChart3 },
];

const systemItems = [
  { title: "Upload Data", url: "/dashboard/upload", icon: Upload },
  { title: "Settings", url: "/dashboard/settings", icon: Settings },
];

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();

  const navItems = [
    { label: "AI Farming", items: mainItems },
    { label: "Marketplace", items: marketplaceItems },
    { label: "System", items: systemItems },
  ];

  return (
    <aside
      className={`h-screen bg-white text-black transition-all duration-200 ${
        collapsed ? "w-16" : "w-64"
      } flex flex-col`}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-700">
        {!collapsed && (
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-green-400 to-blue-500 flex items-center justify-center font-bold">
              A
            </div>
            <div>
              <h2 className="text-lg font-bold">AgriFuel</h2>
              <p className="text-xs text-black">Nexus</p>
            </div>
          </div>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-1 rounded hover:bg-gray-700"
        >
          <PanelLeft size={20} />
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto">
        {navItems.map((section) => (
          <div key={section.label} className="mt-4">
            {!collapsed && (
              <p className="px-4 text-xs font-semibold text-black mb-2">
                {section.label}
              </p>
            )}
            <ul className="space-y-1">
              {section.items.map((item) => {
                const active = location.pathname === item.url;
                return (
                  <li key={item.title}>
                    <NavLink
                      to={item.url}
                      className={`flex items-center gap-2 px-4 py-2 rounded-md transition-colors ${
                        active
                          ? "bg-green-600 text-white"
                          : "hover:bg-gray-700 text-black"
                      }`}
                    >
                      <item.icon size={18} />
                      {!collapsed && <span>{item.title}</span>}
                    </NavLink>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>
    </aside>
  );
}
