import { Link, useLocation, useNavigate } from "react-router-dom";
import { LogIn, LogOut } from "lucide-react";
import "./Navbar_Home.css";

interface NavbarProps {
  onLoginClick: () => void;
}

export default function Navbar({ onLoginClick }: NavbarProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const token = localStorage.getItem("af_token");

  const logout = () => {
    localStorage.removeItem("af_token");
    localStorage.removeItem("af_user");
    localStorage.removeItem("af_loginType");
    localStorage.removeItem("af_userType");
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
          <a href="#home" className={location.pathname === "/" ? "active" : ""}>Home</a>
          <a href="#about" className="">About</a>
          <a href="#services" className="">Services</a>
          <a href="#contact" className="">Contact</a>
        </nav>

        {token ? (
          <button className="login-btn" onClick={logout}>
            <LogOut size={16} />
            <span>Logout</span>
          </button>
        ) : (
          <button className="login-btn" onClick={onLoginClick}>
            <LogIn size={16} />
            <span>Login</span>
          </button>
        )}
      </div>
    </header>
  );
}
