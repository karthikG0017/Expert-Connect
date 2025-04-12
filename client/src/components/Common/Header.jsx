import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

function Header() {
    const {user, logout} = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate("/");
    };
    console.log(user);

    return (
        <div className="w-full p-6 flex justify-between items-center shadow-md bg-white">
            <h1 className="text-3xl font-bold text-sky-600">Expert Connect</h1>
            <div className="flex gap-4">
                {
                    !user ? (
                        <>
                            <Link to="">Home</Link>
                            <Link to="/login" className="text-sky-600 hover:underline px-4">Login</Link>
                            <Link to="/register" className="bg-sky-600 rounded-lg hover:bg-sky-700">Register</Link>
                        </>
                    ) : (
                        <>
                            <Link to="/dashboard" className="hover:underline px-4">Dashboard</Link>
                            <button onClick={handleLogout} className="hover:underline">Logout</button>
                        </>
                    )
                }

            </div>
        </div>
    );
};

export default Header;