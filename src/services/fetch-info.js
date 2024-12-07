import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebaseConfig"; // Import your Firestore configuration

const fetchData = async (collectionName) => {
  try {
    // Reference to the collection in Firestore
    console.log("fetching ", collectionName);
    const collectionRef = collection(db, collectionName);
    const querySnapshot = await getDocs(collectionRef);
    const data = {};

    querySnapshot.forEach((doc) => {
      data[doc.id] = doc.data(); // Use the document ID as the key
    });
    console.log(data);
    return data; // Return the object containing data
  } catch (error) {
    console.error(`Error fetching ${collectionName}:`, error);
    throw error; // Re-throw the error for error handling
  }
};

export default fetchData;