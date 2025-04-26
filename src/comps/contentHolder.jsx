import NavBar from "./navbar";
import { BrowserRouter as Router, Route, Routes, useNavigate } from 'react-router-dom';
import { useContext, useEffect, useState, useRef } from "react";
import { AuthContext } from "./authContext";
import { db } from "../firebaseConfig";
import { doc, getDoc, setDoc, updateDoc, increment } from "firebase/firestore";
import { ThemeContext } from "./App";
import Home from '../pages/home';
import Login from "../pages/login";
import { Loading } from "./loading";
import Footer from "./Footer";
import NotFound from "./NotFound";

const ContentHolder = () => {

    const {theme} = useContext(ThemeContext);
    const auth = useContext(AuthContext);
    const [pageViews, setPageViews] = useState(null); 
    const addedViewRef = useRef(false);
    const navigate = useNavigate(); 

    useEffect(() => {
        const handlePageView = async () => {
            if (addedViewRef.current) return; 
            addedViewRef.current = true; 

            console.log("Welcome user to my page");
            try {
                const pageViewDocRef = doc(db, "pageViews", "siteViews");

                // Fetch the current view count
                const pageViewDoc = await getDoc(pageViewDocRef);
                if (pageViewDoc.exists()) {
                    setPageViews(pageViewDoc.data().views);

                    if (auth.currentUser === null) {
                        await updateDoc(pageViewDocRef, {
                            views: increment(1),
                        });
                        const updatedDoc = await getDoc(pageViewDocRef);
                        setPageViews(updatedDoc.data().views);
                    }
                } else {
                    if (auth === null) {
                        await setDoc(pageViewDocRef, {
                            views: 1,
                        });
                        setPageViews(1);
                    } else {
                        setPageViews(0);
                    }
                }
            } catch (error) {
                console.error("Error handling page view:", error);
            }
        };

    handlePageView();
    }, [auth]); // Dependency array

        
    return (
        <div className="page">
            
            <div className="bamboo left"></div>
            <div className="bamboo left back"></div>

            <div className="bamboo right"></div>
            <div className="bamboo right back"></div>


            {auth.currentUser == null ? (
                <></>
            ) : (
                <>
                    <span className="analytics">
                        <img src = {theme == "light" ? "svgs/eye.svg" : "svgs/eye-white.svg"} alt="Analytics" />
                        <p>{pageViews != null && pageViews}</p>
                        {pageViews == null && <Loading />}
                    </span>
                    <p onClick = {() => {navigate("/login")}} className="logged-text">Logged In</p>
                </>
            )}
            <div className="content">
                {/* <NavBar /> */}
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/login" element={<Login />} />
                    {/* Add more routes as needed */}
                    <Route path="*" element={<NotFound />} /> {/* Redirect to Home for any unknown routes */}
                </Routes>
            </div>
        </div>
    );
};

export default ContentHolder;
