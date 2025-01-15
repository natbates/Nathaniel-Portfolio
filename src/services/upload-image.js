import axios from "axios";

const handleUpload = async (file) => {
    const formData = new FormData();
    formData.append("file", file);

    try {
        const res = await axios.post("https://api.pinata.cloud/pinning/pinFileToIPFS", formData, {
            headers: {
                pinata_api_key: process.env.REACT_APP_PINATA_API_KEY,
                pinata_secret_api_key: process.env.REACT_APP_PINATA_SECRET_API_KEY,
            },
        });
        return `https://gateway.pinata.cloud/ipfs/${res.data.IpfsHash}`;
    } catch (error) {
        console.error("Error uploading to Pinata:", error);
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
}

export { handleUpload, handleMultipleUpload };
