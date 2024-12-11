import NavBar from "./navbar";
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "./authContext";
import { db } from "../firebaseConfig";
import { doc, getDoc, setDoc, updateDoc, increment } from "firebase/firestore";
import { ThemeContext } from "./App";
import Home from '../pages/home';
import Login from "../pages/login";
import { Loading } from "./loading";

const ContentHolder = () => {

    const {theme} = useContext(ThemeContext);
    const auth = useContext(AuthContext);
    const [pageViews, setPageViews] = useState(null); // State to hold the page view count

    useEffect(() => {
        // Function to handle page view increment
        const incrementPageView = async () => {
            try {
                const pageViewDocRef = doc(db, "pageViews", "siteViews"); // Reference to the page view document
                const pageViewDoc = await getDoc(pageViewDocRef); // Get the document

                if (pageViewDoc.exists()) {
                    // If the document exists, increment the view count using Firestore's increment
                    await updateDoc(pageViewDocRef, {
                        views: increment(1), // Increment the view count by 1
                    });

                    // Fetch the updated view count and set it in state
                    const updatedDoc = await getDoc(pageViewDocRef);
                    setPageViews(updatedDoc.data().views);
                } else {
                    // If the document doesn't exist, initialize it with 1 view
                    await setDoc(pageViewDocRef, {
                        views: 1,
                    });
                    setPageViews(1); // Set initial page view count to 1
                }
            } catch (error) {
                console.error("Error incrementing page view:", error);
            }
        };

        incrementPageView(); 
    }, []);

    return (
        <div className="page">
            <Router>
                {auth.currentUser == null ? (
                    <p className="logged-text">Logged Out</p>
                ) : (
                    <>
                        <span className="analytics">
                            <img src = {theme == "light" ? "svgs/eye.svg" : "svgs/eye-white.svg"} alt="Analytics" />
                            <p>{pageViews != null && pageViews}</p>
                            {pageViews == null && <Loading />}
                        </span>
                        <p className="logged-text">Logged In</p>
                    </>
                )}
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
};

export default ContentHolder;
