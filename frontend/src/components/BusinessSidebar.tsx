import { NavLink, useLocation } from "react-router-dom";
import { Building2, PackageSearch, Truck, Settings, FileText } from "lucide-react";

export default function BusinessSidebar() {
  const location = useLocation();

  const navItems = [
    { title: "Command Center", url: "/business", icon: Building2 },
    { title: "Marketplace", url: "/business/market", icon: PackageSearch },
    { title: "Active Orders", url: "/business/orders", icon: Truck },
    { title: "Contracts", url: "/business/contracts", icon: FileText },
    { title: "Settings", url: "/business/settings", icon: Settings },
  ];

  return (
    <aside className="w-64 h-screen bg-gray-900 text-white flex flex-col hidden md:flex fixed">
      <div className="p-6 border-b border-gray-800">
        <h2 className="text-2xl font-black text-blue-400">AgriFuel <span className="text-white">Corp</span></h2>
      </div>
      <nav className="flex-1 p-4 space-y-2">
        {navItems.map((item) => {
          const active = location.pathname === item.url || (item.url === '/business/market' && location.pathname === '/business');
          return (
            <NavLink key={item.title} to={item.url} className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors font-medium ${active ? "bg-blue-600 text-white" : "hover:bg-gray-800 text-gray-400"}`}>
              <item.icon size={20} />
              <span>{item.title}</span>
            </NavLink>
          );
        })}
      </nav>
    </aside>
  );
}