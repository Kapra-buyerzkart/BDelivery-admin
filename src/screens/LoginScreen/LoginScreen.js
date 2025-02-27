import React, { useState } from "react";
import { FaEnvelope, FaEye, FaEyeSlash } from "react-icons/fa"; // Import icons
import { doc, getDoc } from 'firebase/firestore';
import './LoginScreen.css'; // Import the CSS file
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

        setError(''); // Clear any existing errors

        try {
            const adminDoc = await getDoc(doc(db, 'admin', email));
            if (adminDoc.exists()) {
                const adminData = adminDoc.data();
                if (adminData.password === password) {
                    console.log("???????")
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
        <div className="screenContainer"> {/* Full-screen container with gradient background */}
            <div className="formContainer">
                <h2 className="heading">Login</h2> {/* Center the Login text */}
                <form
                    onSubmit={handleSubmit}
                    className="form">
                    {/* Email Input */}
                    <div className="inputGroup">
                        <div className="inputContainer">
                            <input
                                type="email"
                                id="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="input"
                                placeholder="Enter your email"
                            />
                            <FaEnvelope className="icon" />
                        </div>
                    </div>

                    {/* Password Input */}
                    <div className="inputGroup">
                        <div className="inputContainer">
                            <input
                                type={showPassword ? "text" : "password"}
                                id="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="input"
                                placeholder="Enter your password"
                            />
                            <span
                                onClick={() => setShowPassword(!showPassword)}
                                className="icon"
                                role="button"
                                aria-label="Toggle Password Visibility"
                            >
                                {showPassword ? <FaEye /> : <FaEyeSlash />}
                            </span>
                        </div>
                    </div>

                    {/* Error Message */}
                    {error && <p className="error">{error}</p>}

                    <button type="submit" className="button">
                        Login
                    </button>
                </form>
            </div>
        </div>
    );
};

export default LoginScreen;
