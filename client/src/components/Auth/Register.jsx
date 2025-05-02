import React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import axios from 'axios'
import { Link } from "react-router-dom";
import "./Register.css";


function Register() {
    const [role, setRole] = useState('user');
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const {login} = useAuth();
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post('http://localhost:4000/auth-api/register', {
                name, email, password, role
            });

            const {token, user} = res.data;
            login(user, token);
            navigate('/dashboard');
        } catch(err) {
            if (err.response) {
                alert(err.response.data.message || 'Registration failed');
            } else if (err.request) {
                alert('Server not responding. Please try again.');
            } else {
                alert('Something went wrong during registration');
            }
        }
    };

    return (
        <div className="register-container">
            <div className="register-card">
                <div className="register-header">
                    <h2 className="register-title">Create Account</h2>
                    <p className="register-subtitle">Join the Expert Connect platform</p>
                </div>
                
                <form onSubmit={handleRegister}>
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
                            type="text"
                            className="form-control"
                            placeholder="Full Name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
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
                        Register
                    </button>
                    
                    <div className="alt-action">
                        <a href="/login" className="form-link">Already have an account? Sign in</a>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Register;