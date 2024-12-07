// src/services/auth.js
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebaseConfig";

// Accept currentUser as a parameter
export const signIn = async (currentUser, email, password) => {
    console.log("Attempting to sign in");

    // Check if there's a current user and if the email matches
    if (currentUser && currentUser.email === email) {
        console.log("User is already signed in with this email.");
        return { status: "already_signed_in", user: currentUser }; // Return a special value
    }

    console.log("Attempting to log in");

    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        console.log("User signed in:", user);
        return { status: "success", user }; // Return success status and user
    } catch (error) {
        console.error("Error signing in:", error);
        throw error; // You can handle this further in the calling component
    }
};
