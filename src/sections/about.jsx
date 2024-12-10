import "../styles/about.css";
import { AuthContext } from "../comps/authContext";
import { useContext, useEffect, useState } from "react";
import { collection, addDoc, getDocs, deleteDoc, doc } from "firebase/firestore"; 
import { db } from "../firebaseConfig";
import { handleMultipleUpload } from "../services/upload-image";
import { LoadingSection } from "../comps/loading";

const About = () => {

    const { currentUser, logout } = useContext(AuthContext);
    const [aboutImages, setAboutImages] = useState([]);
    const [uploading, setUploading] = useState(false);
    const [imageFiles, setImageFiles] = useState([]);
    const [fetching, setFetching] = useState(false);

    useEffect(() => {
        fetchAboutImages();
    }, []);

    const fetchAboutImages = async () => {
        setFetching(true);
        try {
            const aboutImagesCollection = collection(db, "about-photos");
            const querySnapshot = await getDocs(aboutImagesCollection);
    
            const imageUrls = querySnapshot.docs.map(doc => ({
                url: doc.data().url,
                id: doc.id // Get the document ID to use for deletion
            }));
    
            setAboutImages(imageUrls); // Store both URLs and document IDs
        } catch (error) {
            console.error("Error fetching about images:", error);
        } finally {
            setFetching(false); // Stop loading when fetching is complete
        }
    };
    

    const handleUpload = async () => {
        if (uploading || imageFiles.length === 0) return;
    
        setUploading(true);
    
        try {
            console.log("Uploading images");
    
            // Upload the current files
            const urls = await handleMultipleUpload(imageFiles); // This will return an array of URLs
    
            // Reference to Firestore "about-photos" collection
            const batch = collection(db, "about-photos");
    
            // Prepare an array to hold the image objects with both `url` and `id`
            const newImages = [];
    
            // For each URL, add it to Firestore and store the `url` and `id`
            for (const url of urls) {
                // Add the image URL to Firestore and get the document reference
                const docRef = await addDoc(batch, {
                    url,
                    uploadedAt: new Date(),
                });
    
                // Push the image object (with url and Firestore docId) to the newImages array
                newImages.push({
                    url,
                    id: docRef.id,
                });
            }
    
            // Update the state to include both `url` and `id` of the newly uploaded images
            setAboutImages((prevImages) => [...prevImages, ...newImages]);
        } catch (error) {
            console.error("Error uploading photos:", error);
            alert("Error uploading photos. Please try again.");
        } finally {
            setImageFiles([]);  // Reset the image files after upload
            setUploading(false);
        }
    };
    
    
    const handleFileChange = (event) => {
        const files = event.target.files;
        if (files.length > 0) {
            setImageFiles(files);
        }
    };

    const handleDeleteImage = async (imageUrl, docId) => {


        console.log("IMAGE URL", imageUrl);
        console.log("DOC ID", docId);

        if (uploading) return;

        setUploading(true);

        try {
            // 1. Delete the image document from Firestore
            const docRef = doc(db, "about-photos", docId); // Reference to the specific document
            await deleteDoc(docRef); // Delete the document from Firestore
            
            console.log("Image deleted from Firestore");

            // 2. Update the UI state to remove the image
            setAboutImages((prevImages) => prevImages.filter((img) => img.url !== imageUrl));
        } catch (error) {
            console.error("Error deleting image:", error);
            alert("Error deleting image. Please try again.");
        } finally {
            setUploading(false);
        }
    };


    return (
        <div id="about" className="container">
            <div className="text-container">
                <h1>About</h1>
                <p>
                    I'm currently learning something new every day. My main passion involves computer
                    science and front-end web development, but I also love game design and creating software.
                    My hobbies involve going to the gym 💪, hiking 🥾, and playing the guitar 🎸.
                </p>
            </div>

            
            <div className="about-image-holder">
                {fetching && <LoadingSection />}

                {!fetching && aboutImages.length === 0 && <p>No About Images</p>}
                <>
                {aboutImages != null &&
                    aboutImages.map((img) => (
                        <div className="about-img-container" key={img.id}>
                            <img
                                className="about-img"
                                src={img.url}
                                alt={`About image`}
                                crossorigin="anonymous"
                            />
                            {currentUser && (
                                <img
                                    onClick={() => handleDeleteImage(img.url, img.id)}
                                    className="trash topright"
                                    src="svgs/trash-white.svg"
                                    alt="Delete"
                                />
                            )}
                        </div>
                    ))}
                </>
            </div>

            {currentUser !== null && (
                <div className="about-info">
                    <form className = {`${uploading ? "Loading" : ""}`}>
                        <div className="button-container-right">
                            <div>
                                <label htmlFor="github">Add Photo</label>
                                <input
                                    type="file" // Ensures the input is a valid URL
                                    id="about-photo"
                                    name="about-photo"
                                    accept="image/*"
                                    onChange={handleFileChange}
                                    required // Input is required
                                    multiple
                                />
                            </div>
                            <button type = "button" onClick={handleUpload} className="save-button" disabled={uploading}>
                                {uploading ? "Uploading..." : "Upload"}
                            </button>
                        </div>
                    </form>
                </div>
            )}
        </div>
    );
};

export default About;
