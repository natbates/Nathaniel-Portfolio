// src/services/auth.js
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebaseConfig";

// Accept currentUser as a parameter
export const signIn = async (currentUser, email, password) => {

    // Check if there's a current user and if the email matches
    if (currentUser && currentUser.email === email) {
        return { status: "already_signed_in", user: currentUser }; // Return a special value
    }


    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        return { status: "success", user }; // Return success status and user
    } catch (error) {
        console.error("Error signing in:", error);
        throw error; // You can handle this further in the calling component
    }
};
