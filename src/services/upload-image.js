import axios from "axios";

const handleUpload = async (file) => {
    const formData = new FormData();
    formData.append("file", file);

    try {
        const res = await axios.post("https://api.pinata.cloud/pinning/pinFileToIPFS", formData, {
            headers: {
                pinata_api_key: "016ee06283bd28f58f65",
                pinata_secret_api_key: "560004237e1b411365aedba212c2bbf9938fcc2cfc1db9fe54ee8f723b2cf111",
            },
        });
        console.log("Uploaded Image URL:", `https://gateway.pinata.cloud/ipfs/${res.data.IpfsHash}`);
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
