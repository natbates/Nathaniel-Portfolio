import NavBar from "./navbar";
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { useContext } from "react";
import { AuthContext } from "./authContext";

import Home from '../pages/home';
import Login from "../pages/login";


const ContentHolder = () =>
{

    const auth = useContext(AuthContext);
    console.log(auth);

    return(
        <div className="page">
            <Router>
                {auth.currentUser == null ?
                <p className="logged-text">Logged Out</p>
                :
                <p className="logged-text">Logged In</p>
                }
                <NavBar />
                <div className="content">
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/login" element={<Login />} />
                    </Routes>
                </div>
            </Router>
        </div>
    );
}

export default ContentHolder;