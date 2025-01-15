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
        const handlePageView = async () => {
            try {
                const pageViewDocRef = doc(db, "pageViews", "siteViews"); // Reference to the page view document
    
                // Fetch the current view count
                const pageViewDoc = await getDoc(pageViewDocRef);
                if (pageViewDoc.exists()) {
                    setPageViews(pageViewDoc.data().views); // Set the current view count in state
    
                    // Increment the view count only if auth is null
                    if (auth === null) {
                        await updateDoc(pageViewDocRef, {
                            views: increment(1), // Increment the view count by 1
                        });
    
                        // Fetch the updated view count after increment
                        const updatedDoc = await getDoc(pageViewDocRef);
                        setPageViews(updatedDoc.data().views);
                    }
                } else {
                    // If the document doesn't exist, initialize it with 1 view if auth is null
                    if (auth === null) {
                        await setDoc(pageViewDocRef, {
                            views: 1,
                        });
                        setPageViews(1); // Set initial page view count to 1
                    } else {
                        setPageViews(0); // If the document doesn't exist and auth is not null, set views to 0
                    }
                }
            } catch (error) {
                console.error("Error handling page view:", error);
            }
        };
    
        handlePageView();
    }, [auth]); // Include auth in dependency array
    

    return (
        <div className="page">
            <Router>
                {auth.currentUser == null ? (
                    <></>
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
