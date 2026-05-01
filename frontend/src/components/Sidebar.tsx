import { useState } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import {
  Home,
  Lightbulb,
  ShoppingCart,
  TrendingUp,
  BarChart3,
  Settings,
  LogOut,
  PanelLeftClose,
  PanelLeftOpen,
  LucideIcon
} from "lucide-react";

interface NavItem {
  title: string;
  url: string;
  icon: LucideIcon;
}

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("af_token");
    localStorage.removeItem("af_user");
    navigate("/login");
  };

  const navItems = [
    {
      label: "Farming",
      items: [
        { title: "Dashboard", url: "/dashboard", icon: Home },
        { title: "Advisory", url: "/dashboard/advisory", icon: Lightbulb },
      ]
    },
    {
      label: "Marketplace",
      items: [
        { title: "Marketplace", url: "/dashboard/marketplace", icon: TrendingUp },
        { title: "My Listings", url: "/dashboard/listings", icon: ShoppingCart },
        { title: "Analytics", url: "/dashboard/analytics", icon: BarChart3 },
      ]
    }
  ];

  return (
    <>
      {/* 1. Mobile Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 md:hidden transition-opacity duration-10"
          onClick={onClose}
        />
      )}

      {/* 2. Aside Element: Lightning fast transition */}
      <aside
        className={`bg-white border-r border-[#E5E9DF] text-[#1A2E19] transition-all duration-150 ease-out flex flex-col shrink-0
          fixed md:relative z-50 md:z-auto h-full
          ${collapsed ? "w-[72px]" : "w-50"}
          ${isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
        `}
      >
        {/* Toggle Button Area with Text */}
        <div className={`flex items-center h-14 border-b border-[#F4F7F4] overflow-hidden whitespace-nowrap ${collapsed ? 'justify-center' : 'justify-between px-5'}`}>
          {!collapsed && (
            <span className="text-[10px] font-black text-[#8A9A86] uppercase tracking-widest">
              Navigation
            </span>
          )}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-2 rounded-xl text-[#8A9A86] hover:text-[#16a34a] hover:bg-[#F0FDF4] transition-colors"
            title={collapsed ? "Expand Menu" : "Collapse Menu"}
          >
            {collapsed ? <PanelLeftOpen size={20} /> : <PanelLeftClose size={20} />}
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 overflow-y-auto py-4 hide-scrollbar">
          {navItems.map((section) => (
            <div key={section.label} className="mb-6 px-3">
              {!collapsed && (
                <p className="px-3 text-[10px] font-black text-[#8A9A86] uppercase tracking-widest mb-2">
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
                        onClick={() => onClose && onClose()} 
                        className={`flex items-center gap-3 py-2.5 rounded-xl transition-colors ${
                          collapsed ? 'justify-center px-0' : 'px-3'
                        } ${
                          active
                            ? "bg-[#F0FDF4] text-[#16a34a] font-bold border border-[#DCFCE7]"
                            : "text-[#5C715A] hover:bg-[#F8FAF8] hover:text-[#1A2E19] font-medium border border-transparent"
                        }`}
                        title={collapsed ? item.title : ""}
                      >
                        <item.icon size={18} className={active ? "text-[#16a34a]" : "text-[#8A9A86]"} />
                        {!collapsed && <span>{item.title}</span>}
                      </NavLink>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </nav>

        {/* Bottom Actions */}
        <div className="p-3 border-t border-[#F4F7F4] space-y-1">
          <NavLink
            to="/dashboard/settings"
            onClick={() => onClose && onClose()}
            className={({ isActive }) => `flex items-center gap-3 py-2.5 rounded-xl transition-colors ${
              collapsed ? 'justify-center px-0' : 'px-3'
            } ${isActive ? "bg-[#F0FDF4] text-[#16a34a] font-bold border border-[#DCFCE7]" : "text-[#5C715A] hover:bg-[#F8FAF8] hover:text-[#1A2E19] font-medium border border-transparent"}`}
            title={collapsed ? "Settings" : ""}
          >
            <Settings size={18} className="text-[#8A9A86]" />
            {!collapsed && <span>Settings</span>}
          </NavLink>

          <button
            onClick={handleLogout}
            className={`w-full flex items-center gap-3 py-2.5 rounded-xl transition-colors text-red-600 hover:bg-[#FEF2F2] hover:text-red-700 font-medium ${
              collapsed ? 'justify-center px-0' : 'px-3'
            }`}
            title={collapsed ? "Log Out" : ""}
          >
            <LogOut size={18} className="text-red-400" />
            {!collapsed && <span>Log Out</span>}
          </button>
        </div>
      </aside>
    </>
  );
}