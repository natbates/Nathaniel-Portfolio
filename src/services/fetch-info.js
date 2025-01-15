import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebaseConfig"; // Import your Firestore configuration

const fetchData = async (collectionName) => {
  try {
    // Reference to the collection in Firestore
    const collectionRef = collection(db, collectionName);
    const querySnapshot = await getDocs(collectionRef);
    const data = {};

    querySnapshot.forEach((doc) => {
      data[doc.id] = doc.data(); // Use the document ID as the key
    });
    return data; // Return the object containing data
  } catch (error) {
    // Optionally handle the error silently without logging to the console
    throw error; // Re-throw the error for error handling
  }
};

export default fetchData;
