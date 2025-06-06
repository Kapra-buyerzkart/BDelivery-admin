import React, { useState } from "react";
import { FaEnvelope, FaEye, FaEyeSlash } from "react-icons/fa";
import { doc, getDoc } from 'firebase/firestore';
import './LoginScreen.css';
import { useNavigate } from 'react-router-dom';
import { db } from "../../firebase/firebaseConfig";

const LoginScreen = ({ onLogin }) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!email || !password) {
            setError('Both fields are required.');
            return;
        }

        if (!/\S+@\S+\.\S+/.test(email)) {
            setError('Please enter a valid email address.');
            return;
        }

        setError('');

        try {
            const adminDoc = await getDoc(doc(db, 'admin', email));
            if (adminDoc.exists()) {
                const adminData = adminDoc.data();
                if (adminData.password === password) {
                    // console.log("Login Successful");
                    onLogin();
                } else {
                    setError('Incorrect password.');
                }
            } else {
                setError('User does not exist.');
            }
        } catch (err) {
            console.error("Error logging in:", err);
            setError("Something went wrong. Please try again.");
        }
    };

    return (
        <div className="login-screenContainer">
            {/* BDELIVERY Header */}
            <header className="login-header">
                <h1>BDELIVERY</h1>
            </header>

            <div className="login-formContainer">
                <h2 className="login-heading">Login</h2>
                <form onSubmit={handleSubmit} className="login-form">
                    <div className="login-inputGroup">
                        <div className="login-inputContainer">
                            <input
                                type="email"
                                id="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="login-input"
                                placeholder="Enter your email"
                            />
                            <FaEnvelope className="login-icon" />
                        </div>
                    </div>

                    <div className="login-inputGroup">
                        <div className="login-inputContainer">
                            <input
                                type={showPassword ? "text" : "password"}
                                id="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="login-input"
                                placeholder="Enter your password"
                            />
                            <span
                                onClick={() => setShowPassword(!showPassword)}
                                className="login-icon"
                                role="login-button"
                                aria-label="Toggle Password Visibility"
                            >
                                {showPassword ? <FaEye /> : <FaEyeSlash />}
                            </span>
                        </div>
                    </div>

                    {error && <p className="login-error">{error}</p>}

                    <button type="submit" className="login-button">
                        Login
                    </button>
                </form>
            </div>
        </div>
    );
};

export default LoginScreen;
