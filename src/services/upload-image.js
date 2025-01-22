import axios from "axios";

const REPO_OWNER = "natbates"; 
const REPO_NAME = "portfolio-images"; 

const fileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
            const base64 = reader.result.split(",")[1]; // Remove the "data:*/*;base64," prefix
            resolve(base64);
        };
        reader.onerror = (error) => reject(error);
    });
};

const getFileSHA = async (fileName) => {
    try {
        const res = await axios.get(
            `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/${fileName}`,
            {
                headers: {
                    Authorization: `Bearer ${process.env.REACT_APP_GITHUB_TOKEN}`,
                },
            }
        );
        return res.data.sha;
    } catch (error) {
        if (error.response && error.response.status === 404) {
            // File doesn't exist
            return null;
        }
        throw error;
    }
};

const handleUpload = async (file) => {

    const base64Content = await fileToBase64(file);
    const fileName = file.name;
    const existingSHA = await getFileSHA(fileName);

    const payload = {
        message: "Uploading file to GitHub",
        content: base64Content,
        ...(existingSHA && { sha: existingSHA }), // Include `sha` if file exists
    };

    try {
        const res = await axios.put(
            `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/${fileName}`,
            payload,
            {
                headers: {
                    Authorization: `Bearer ${process.env.REACT_APP_GITHUB_TOKEN}`,
                },
            }
        );
        return res.data.content.download_url;
    } catch (error) {
        console.error("Error uploading to GitHub:", error);
        throw new Error("Error uploading file.");
    }
};


const handleMultipleUpload = async (files) => {
    const uploadedUrls = [];

    for (let i = 0; i < files.length; i++) {
        const file = files[i];
        try {
            const url = await handleUpload(file);
            uploadedUrls.push(url);
        } catch (error) {
            console.error("Error uploading file:", file.name);
        }
    }

    return uploadedUrls;
};

export { handleUpload, handleMultipleUpload };
