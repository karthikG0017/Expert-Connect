import React from "react";
import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from '../../contexts/AuthContext';
import axios from 'axios';
import "./Login.css"; // Import the CSS file

function Login() {
    const [role, setRole] = useState('user');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post('http://localhost:4000/auth-api/login', {email, password});

            const {token, user} = res.data;

            if (user.role !== role) {
                alert(`You selected ${role}, but your account is registered as ${user.role}`);
                return;
            }
            login(user, token); 
            navigate('/dashboard');
        } catch(err) {
            if (err.response) {
                alert(err.response.data.message || "Login failed!");
            } else if (err.request) {
                alert("Server is not responding. Please try again later.");
            } else {
                alert("Something went wrong during login");
            }
        }
    }

    return (
        <div className="login-container">
            <div className="login-card">
                <div className="login-header">
                    <h2 className="login-title">Sign In</h2>
                    <p className="login-subtitle">Access your Expert Connect account</p>
                </div>
                
                <form onSubmit={handleLogin}>
                    <div className="role-selector">
                        <button
                            type="button"
                            className={`role-button ${role === 'user' ? 'role-button-active' : ''}`}
                            onClick={() => setRole('user')}
                        >User</button>
                        <button
                            type="button"
                            className={`role-button ${role === 'expert' ? 'role-button-active' : ''}`}
                            onClick={() => setRole('expert')}
                        >Expert</button>
                    </div>

                    <div className="form-group">
                        <input
                            type="email"
                            className="form-control"
                            placeholder="Email Address"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    
                    <div className="form-group">
                        <input
                            type="password"
                            className="form-control"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    <button type="submit" className="submit-button">
                        Sign In
                    </button>
                    
                    <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
                        <a href="/register" className="form-link">Don't have an account? Register</a>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default Login;