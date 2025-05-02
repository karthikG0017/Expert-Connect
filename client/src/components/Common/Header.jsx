import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Header.css";
import { useAuth } from "../../contexts/AuthContext";

function Header() {
    const {user, logout} = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        // Redirect to home page instead of dashboard
        navigate("/");
    };

    return (
        <header className="header">
            <div className="header-container">
                <h1 
                  className="header-logo" 
                  onClick={() => navigate("/")} 
                  style={{ cursor: "pointer" }}
                >
                  Expert Connect
                </h1>
                <nav className="header-nav">
                    {
                        !user ? (
                            <>
                                <Link to="" className="nav-link">Home</Link>
                                <Link to="/login" className="nav-link nav-link-login">Login</Link>
                                <Link to="/register" className="nav-link nav-link-register">Register</Link>
                            </>
                        ) : (
                            <>
                                <Link to="/dashboard" className="nav-link">Dashboard</Link>
                                {
                                    user.role === "user" && <Link to="/explore-experts" className="nav-link">Explore Experts</Link>
                                }
                                    {
                                    user.role === "expert" && <Link to="/edit-profile" className="nav-link">Profile</Link>
                                }
                                <button onClick={handleLogout}>Logout</button>
                            </>
                        )
                    }
                </nav>
            </div>
        </header>
    );
}

export default Header;
