import { useState } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import {
  Store,
  Truck,
  BarChart3,
  Settings,
  LogOut,
  PanelLeftClose,
  PanelLeftOpen
} from "lucide-react";

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export default function BusinessSidebar({ isOpen, onClose }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false); 
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("af_token");
    localStorage.removeItem("af_user");
    navigate("/login");
  };

  const navItems = [
    { title: "Marketplace", url: "/business", icon: Store },
    { title: "Active Orders", url: "/business/orders", icon: Truck },
    { title: "Analytics", url: "/business/analytics", icon: BarChart3 },
  ];

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-zinc-900/40 backdrop-blur-sm z-40 md:hidden transition-opacity duration-75"
          onClick={onClose}
        />
      )}

      {/* Sidebar Element */}
      <aside
        className={`bg-white border-r border-zinc-200 text-zinc-900 transition-all duration-75 ease-out flex flex-col shrink-0
          fixed md:relative z-50 md:z-auto h-full
          ${collapsed ? "w-[72px]" : "w-64"}
          ${isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
        `}
      >
        {/* Toggle Button Area */}
        <div className={`flex items-center h-12 border-b border-zinc-100 overflow-hidden whitespace-nowrap ${collapsed ? 'justify-center' : 'justify-between px-5'}`}>
          {!collapsed && (
            <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest transition-opacity duration-75">
              Main Menu
            </span>
          )}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-900 hover:bg-zinc-100 transition-colors"
            title={collapsed ? "Expand Menu" : "Collapse Menu"}
          >
            {collapsed ? <PanelLeftOpen size={16} /> : <PanelLeftClose size={16} />}
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 overflow-y-auto py-4 hide-scrollbar px-3 space-y-1">
          {navItems.map((item) => {
            // Strict exact matching
            const active = location.pathname === item.url || (item.url === '/business' && location.pathname === '/business/');
            
            return (
              <NavLink
                key={item.title}
                to={item.url}
                onClick={() => onClose && onClose()} 
                className={`flex items-center gap-3 py-2.5 rounded-xl transition-colors ${
                  collapsed ? 'justify-center px-0' : 'px-3'
                } ${
                  active
                    ? "bg-zinc-900 text-white font-medium shadow-sm"
                    : "text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900 font-medium"
                }`}
                title={collapsed ? item.title : ""}
              >
                <item.icon size={18} className={active ? "text-white min-w-[18px]" : "text-zinc-400 min-w-[18px]"} />
                {!collapsed && <span className="whitespace-nowrap transition-opacity duration-75 text-sm">{item.title}</span>}
              </NavLink>
            );
          })}
        </nav>

        {/* Bottom Actions */}
        <div className="p-3 border-t border-zinc-100 space-y-1">
          <NavLink
            to="/business/settings"
            onClick={() => onClose && onClose()}
            className={({ isActive }) => `flex items-center gap-3 py-2.5 rounded-xl transition-colors ${
              collapsed ? 'justify-center px-0' : 'px-3'
            } ${isActive ? "bg-zinc-900 text-white font-medium shadow-sm" : "text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900 font-medium"}`}
            title={collapsed ? "Settings" : ""}
          >
            <Settings size={18} className={location.pathname === '/business/settings' ? "text-white min-w-[18px]" : "text-zinc-400 min-w-[18px]"} />
            {!collapsed && <span className="whitespace-nowrap transition-opacity duration-75 text-sm">Settings</span>}
          </NavLink>

          <button
            onClick={handleLogout}
            className={`w-full flex items-center gap-3 py-2.5 rounded-xl transition-colors text-red-600 hover:bg-red-50 hover:text-red-700 font-medium ${
              collapsed ? 'justify-center px-0' : 'px-3'
            }`}
            title={collapsed ? "Log Out" : ""}
          >
            <LogOut size={18} className="text-red-500 min-w-[18px]" />
            {!collapsed && <span className="whitespace-nowrap transition-opacity duration-75 text-sm">Sign Out</span>}
          </button>
        </div>
      </aside>
    </>
  );
}