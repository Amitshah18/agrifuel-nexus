import { Link, useLocation, useNavigate } from "react-router-dom";
import { LogIn, LogOut } from "lucide-react";
import "./Navbar_Home.css";

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const token = localStorage.getItem("af_token");

  const logout = () => {
    localStorage.removeItem("af_token");
    localStorage.removeItem("af_user");
    navigate("/");
  };

  return (
    <header className="navbar">
      <div className="navbar-container">
        <div className="navbar-logo">
          <div className="logo-icon">A</div>
          <h1>AgriFuel <span>Nexus</span></h1>
        </div>

        <nav className="navbar-links">
          <Link to="/" className={location.pathname === "/" ? "active" : ""}>Home</Link>
          <Link to="/about" className={location.pathname === "/about" ? "active" : ""}>About</Link>
          <Link to="/dashboard" className={location.pathname === "/dashboard" ? "active" : ""}>Dashboard</Link>
        </nav>

        {token ? (
          <button className="login-btn" onClick={logout}>
            <LogOut size={16} />
            <span>Logout</span>
          </button>
        ) : (
          <Link to="/login" className="login-btn">
            <LogIn size={16} />
            <span>Login</span>
          </Link>
        )}
      </div>
    </header>
  );
}
