import { useState, FC } from "react";
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
  LucideIcon,
} from "lucide-react";
import "./Sidebar.css";

interface NavItem {
  title: string;
  url: string;
  icon: LucideIcon;
}

interface NavSection {
  label: string;
  items: NavItem[];
}

const mainItems: NavItem[] = [
  { title: "Dashboard", url: "/dashboard", icon: Home },
  { title: "AI Disease Detection", url: "/dashboard/detection", icon: Microscope },
  { title: "Farming Advisory", url: "/dashboard/advisory", icon: Lightbulb },
  { title: "Crop Health", url: "/dashboard/health", icon: Leaf },
];

const marketplaceItems: NavItem[] = [
  { title: "My Listings", url: "/dashboard/listings", icon: ShoppingCart },
  { title: "Marketplace", url: "/dashboard/marketplace", icon: TrendingUp },
  { title: "Analytics", url: "/dashboard/analytics", icon: BarChart3 },
];

const systemItems: NavItem[] = [
  { title: "Upload Data", url: "/dashboard/upload", icon: Upload },
  { title: "Settings", url: "/dashboard/settings", icon: Settings },
];

const Sidebar: FC = () => {
  const [collapsed, setCollapsed] = useState<boolean>(false);
  const location = useLocation();

  const navItems: NavSection[] = [
    { label: "AI Farming", items: mainItems },
    { label: "Marketplace", items: marketplaceItems },
    { label: "System", items: systemItems },
  ];

  return (
    <aside className={`sidebar ${collapsed ? "collapsed" : ""}`}>
      {/* Header */}
      <div className="sidebar-header">
        {!collapsed && (
          <div className="sidebar-logo">
            <div className="logo-icon">A</div>
            <div className="logo-text">
              <h2>AgriFuel</h2>
              <p>Nexus</p>
            </div>
          </div>
        )}
        <button onClick={() => setCollapsed(!collapsed)} className="collapse-btn">
          <PanelLeft size={20} />
        </button>
      </div>

      {/* Navigation */}
      <nav className="sidebar-nav">
        {navItems.map((section) => (
          <div key={section.label} className="nav-section">
            {!collapsed && <p className="nav-section-title">{section.label}</p>}
            <ul className="nav-list">
              {section.items.map((item) => {
                const active = location.pathname === item.url;
                const Icon = item.icon;
                return (
                  <li key={item.title}>
                    <NavLink
                      to={item.url}
                      className={`nav-item ${active ? "active" : ""}`}
                    >
                      <Icon size={18} />
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
};

export default Sidebar;
