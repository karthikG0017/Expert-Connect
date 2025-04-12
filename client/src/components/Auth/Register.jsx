import React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import axios from 'axios'
import { Link } from "react-router-dom";

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
        <div className="flex justify-center items-center min-h-screen bg-sky-50">
            <form onSubmit={handleRegister} className="bg-white shadow-md p-8 rounded-xl w-full max-w-md space-y-6">
                <h2 className="text-2xl font-bold text-center text-sky-700">Register</h2>

                <div className="flex justify-center space-x-4">
                    <button
                        type="button"
                        className={`px-4 py-2 rounded-lg ${role === 'user' ? 'bg-sky-600 text-primary' : 'bg-gray-200'}`}
                        onClick={() => setRole('user')}
                    >User</button>
                    <button
                        type="button"
                        className={`px-4 py-2 rounded-lg ${role === 'expert' ? 'bg-sky-600 text-primary' : 'bg-gray-200'}`}
                        onClick={() => setRole('expert')}
                    >Expert</button>
                </div>

                <input type="text" placeholder="Name" className="w-full p-3 border rounded-lg" required onChange={(e) => setName(e.target.value)} />
                <br/>
                <input type="email" placeholder="Email" className="w-full p-3 border rounded-lg" required onChange={(e) => setEmail(e.target.value)} />
                <br/>
                <input type="password" placeholder="Password" className="w-full p-3 border rounded-lg" required onChange={(e) => setPassword(e.target.value)} />
                <br/>

                <button type="submit" className="w-full bg-sky-600 text-dark py-3 rounded-lg hover:bg-sky-700">Register</button>
                <br/>
                <Link to="/login">Already have an account?</Link>
            </form>
        </div>
    );
};

export default Register;