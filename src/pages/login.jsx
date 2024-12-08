import React, { useState, useContext } from "react";
import "../styles/login.css";
import { signIn } from "../services/auth";
import { AuthContext } from "../comps/authContext";
import { useNavigate } from "react-router-dom";

const Login = () => {
    // State variables to hold the input values
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [loading, setLoading] = useState(false); // Optional: for loading state during API calls
    const { currentUser, logout } = useContext(AuthContext);
    const navigate = useNavigate(); 

    // Handle input change for username and password
    const handleInputChange = (event) => {
        const { name, value } = event.target;

        if (name === "email") {
            setEmail(value);
        } else if (name === "password") {
            setPassword(value);
        }
    };

    // Handle form submission
    const handleSubmit = async (event) => {
        event.preventDefault();

        // Validate the form fields
        if (!email || !password) {
            setErrorMessage("Both username and password are required.");
            return;
        }

        // Clear any previous error messages
        setErrorMessage("");
        
        // Here you would make the API call for login
        setLoading(true);

        try {
            const { user, status } = await signIn(currentUser, email, password);
            if (user) {
                console.log(status);
                navigate("/"); // Redirect to a private page
            } else {
                console.log(status);
            }
        } catch (error) {
            console.error(error);
            setErrorMessage("Login failed, please try again.");
            setEmail("");
            setPassword("");
            setLoading(false);
        }    
    }

    return (
        <div id="login" className="container">
            {currentUser == null ?
            
            <div className="text-container">
                <h1>Admin Log In</h1>
                <form onSubmit={handleSubmit}>
                    <div className="input-group">
                        <label htmlFor="email">Email</label>
                        <input
                            type="text"
                            id="email"
                            name="email"
                            value={email}
                            onChange={handleInputChange}
                            placeholder="Enter email"
                        />
                    </div>
                    <div className="input-group">
                        <label htmlFor="password">Password</label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={password}
                            onChange={handleInputChange}
                            placeholder="Enter password"
                        />
                    </div>

                    {errorMessage && <p className="error">{errorMessage}</p>}

                    <button type="submit" disabled={loading}>
                        {loading ? "Logging in..." : "Log In"}
                    </button>
                </form>
            </div>
            :
            <div className="text-container logout">
                <h1>Admin Log In</h1>
                <p>Logged in as {currentUser.email}</p>
                <button disabled={loading} onClick={(e) => {logout()}}>
                    Log Out
                </button>
            </div>
        }
        </div>
    );
};

export default Login;
