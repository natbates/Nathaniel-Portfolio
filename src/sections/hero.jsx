import "../styles/hero.css";
import { useState, useEffect, useContext, useRef } from "react";
import { Loading, LoadingSection } from "../comps/loading";
import { AuthContext } from "../comps/authContext";
import fetchData from "../services/fetch-info";
import { handleUpload } from "../services/upload-image";
import { db } from "../firebaseConfig";
import { doc, updateDoc, getDoc } from "firebase/firestore";

const Hero = () => {
    const [currentSongData, setCurrentSongData] = useState(null);
    const [discordStatus, setDiscordStatus] = useState(null);
    const [spotifyError, setSpotifyError] = useState(null);
    const [discordError, setDiscordError] = useState(null);
    const [socket, setSocket] = useState(null);
    const { currentUser, logout } = useContext(AuthContext);

    const [profilePicture, setProfilePicture] = useState(null);
    const [saving, setSaving] = useState(false);
    const [isUploading, setIsUploading] = useState(false);  // Track upload status
    const fileInputRef = useRef(null);

    const [discordUserID, setDiscordUserID] = useState("");
    const [formspreeKey, setFormspreeKey] = useState("");

    useEffect(() => {
        fetchInfo();
        fetchProfilePicture();
    }, []);

    const fetchInfo = async () => {
        try {
            const data = await fetchData("keys");
            Object.entries(data.keys).forEach(([key, value]) => {
                if (key === "discordUserID") {
                    setDiscordUserID(value);
                } else if (key === "formspreeKey") {
                    setFormspreeKey(value);
                }
            });
            // Fetch profile picture after fetching other data
            fetchProfilePicture();
        } catch (error) {
            console.error("Error fetching keys:", error);
        }
    };

    const fetchProfilePicture = async () => {
        try {
            const data = await fetchData("socials");
            // Ensure that the profile pic is set only if it exists
            if (data && data.socials && data.socials.profile_pic) {
                setProfilePicture(data.socials.profile_pic);
            } else {
                console.warn("Profile picture not found in fetched data.");
            }
        } catch (error) {
            console.error("Error fetching profile picture:", error);
        }
    };

    const handleInputChange = (event) => {
        const { id, value } = event.target;

        if (id === "discord-user-id") {
            setDiscordUserID(value);
        } else if (id === "formspree-key") {
            setFormspreeKey(value);
        }
    };

    const handleSave = async (event) => {
        event.preventDefault();
        setSaving(true);
        try {
            // Reference to the Firestore document
            const keysDoc = doc(db, "keys", "keys"); // Replace 'keys' with the document ID
    
            // Update the document with new values
            await updateDoc(keysDoc, {
                discordUserID,
                formspreeKey,
            });

            // Only update the state if the save was successful
            fetchInfo();  // Re-fetch after save to ensure that the UI reflects the updated data
        } catch (error) {
            console.error("Error updating keys:", error);
            alert("Failed to update keys. Please try again.");
        } finally {
            setSaving(false);
        }
    };

    const handleClear = () => {
        fetchInfo();  // Re-fetch info when clear is pressed
    };

    const handleProfilePictureUpload = async (file) => {
        if (isUploading) return; // Prevent multiple uploads

        setIsUploading(true);

        try {
            console.log("Uploading file...");

            const url = await handleUpload(file); // Assuming handleUpload returns the file URL
            
            if (url) {
                setProfilePicture(url);
                await updateProfilePictureInFirestore(url); // Update Firestore DB
            }
        } catch (error) {
            console.log("Error uploading profile picture", error);
        } finally {
            setIsUploading(false);  // Reset uploading status
        }
    };

    const updateProfilePictureInFirestore = async (newProfilePicUrl) => {
        try {
            const socialsDocRef = doc(db, "socials", "socials"); // Collection: socials, Document: socials
            
            await updateDoc(socialsDocRef, {
                profile_pic: newProfilePicUrl, // Setting the new URL
            });

            console.log("Successfully updated profile pic in Firestore");
        } catch (error) {
            console.error("Error updating profile picture in Firestore", error);
        }
    };

    const handleProfileClick = () => {
        fileInputRef.current.click();
    };

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            handleProfilePictureUpload(file);  
        }
    };

    useEffect(() => {
        let retryCount = 0;
        const maxRetries = 3;

        const connectWebSocket = () => {
            const newSocket = new WebSocket("wss://api.lanyard.rest/socket");

            newSocket.onopen = () => {
                newSocket.send(JSON.stringify({
                    op: 2,
                    d: {
                        subscribe_to_id: discordUserID
                    }
                }));
                setSocket(newSocket);
                setDiscordError(null);
            };

            newSocket.onmessage = (event) => {
                const data = JSON.parse(event.data);

                switch (data.op) {
                    case 0:
                        handlePresenceUpdate(data.d);
                        break;
                    case 1:
                        const heartbeat = setInterval(() => {
                            if (newSocket.readyState === WebSocket.OPEN) {
                                newSocket.send(JSON.stringify({ op: 3 }));
                            }
                        }, data.d.heartbeat_interval);

                        newSocket.heartbeatInterval = heartbeat;
                        break;
                    default:
                        console.log("Unhandled message type:", data.op);
                }
            };

            newSocket.onerror = (error) => {
                console.log("WebSocket Error: ", error);
                if (retryCount < maxRetries) {
                    retryCount++;
                    console.log(`Connection failed, retrying... (${retryCount}/${maxRetries})`);
                    setTimeout(connectWebSocket, 2000);
                } else {
                    setDiscordError("Unable to connect to Discord after multiple attempts");
                }
            };

            newSocket.onclose = (event) => {
                if (newSocket.heartbeatInterval) {
                    clearInterval(newSocket.heartbeatInterval);
                }

                if (retryCount < maxRetries) {
                    retryCount++;
                    setTimeout(connectWebSocket, 2000);
                }
            };

            return newSocket;
        };

        const wsConnection = connectWebSocket();

        return () => {
            if (wsConnection) {
                if (wsConnection.heartbeatInterval) {
                    clearInterval(wsConnection.heartbeatInterval);
                }
                wsConnection.close();
            }
        };
    }, [discordUserID]);

    const handlePresenceUpdate = (data) => {


        if (Object.keys(data).length !== 0)
        {
            if (data.discord_status != undefined){
                console.log("STATUS", data.discord_status);
                const status = data.discord_status || "offline";
                setDiscordStatus({ status });
            }

            console.log(data);

            if (data.spotify && data.listening_to_spotify) {
                setCurrentSongData({
                    item: {
                        name: data.spotify.song,
                        artists: [{ name: data.spotify.artist, external_urls: { spotify: data.spotify.artist_url } }],
                        external_urls: {
                            songlink: `https://open.spotify.com/track/${data.spotify.track_id}`,
                            artist_url: `https://open.spotify.com/search/${data.spotify.artist}`
                        },
                    },
                });
                setSpotifyError(null);
            } else {
                setCurrentSongData(null);  // Reset to null if not listening to Spotify
                setSpotifyError("User is not currently listening to Spotify.");
            }
        }
    };
    return (
        <div id="hero">
            <div className="container-profile">
                <div className="text-container">
                    <a href="https://docs.google.com/document/d/1z1ZhAOo5Xm14Zn8l6D2DmgzzzgykIuJBRXjiSrFTrRc/edit" target="_blank" >
                        <h1 id="name">Hi, I'm <span className="nowrap"> Nathaniel 👋</span></h1>
                    </a>
                    <p>Front end React web developer currently working for Hastings Direct. Student at the <span className="highlighted">University of Sussex</span></p>
                </div>
                <div className="img-container">
                    {profilePicture == null && <LoadingSection/>}
                    <img 
                        onClick={handleProfileClick} 
                        className={`${currentUser !== null ? "edit" : ""} ${isUploading ? "uploading" : ""}`} 
                        src={profilePicture || "default-image-url.jpg"} 
                    />
                    <input 
                        ref={fileInputRef} 
                        type="file" 
                        accept="image/*" 
                        style={{ display: "none" }} 
                        onChange={handleFileChange} 
                        disabled={currentUser==null}
                    />
                </div>
            </div>

            <div className="service-text">
                <span>
                    <img className="service-image" src="svgs/spotify.svg" alt="Spotify logo" />
                    Listening to: {currentSongData === null && spotifyError === null ? (
                        <div className="service-loader"><Loading /></div>
                    ) : (
                        spotifyError !== null ? <a>&nbsp; Nothing</a> :
                            currentSongData.item ? (
                                <>
                                    <a className="song" href={currentSongData.item.external_urls.songlink} target="_blank" rel="noopener noreferrer">
                                        &nbsp; {currentSongData.item.name}
                                    </a>
                                    {' '}&nbsp; by &nbsp;{' '}
                                    <a className="song" href={currentSongData.item.external_urls.artist_url} target="_blank" rel="noopener noreferrer">
                                        {currentSongData.item.artists[0].name}
                                    </a>
                                </>
                            ) : (
                            <div className="service-loader"><Loading /></div>
                        )
                    )}
                </span>
            </div>

            <div className="service-text">
                <span className="discord-span">
                    <img className="service-image" src="svgs/discord.svg" alt="Discord logo" />
                    <a target="_blank" href={`https://discord.com/users/${discordUserID}`}>Discord</a>&nbsp; 
                    status: {discordStatus === null ? (
                        <div className="service-loader"><Loading /></div>
                    ) : (
                        <>
                            {(() => {
                                try {
                                    // Attempt to access discordStatus.status
                                    const status = discordStatus.status || "offline";
                                    return (
                                        <>
                                            <div className={`${status} circle`}></div>
                                            {' '}{status}
                                        </>
                                    );
                                } catch (error) {
                                    // If an error occurs, default to offline status
                                    console.error("Error reading discordStatus:", error);
                                    return (
                                        <>
                                            <div className="offline circle"></div>
                                            {' offline'}
                                        </>
                                    );
                                }
                            })()}
                        </>
                    )}
                </span>
            </div>

            {currentUser !== null && (
                <>
                    <div className="hero-api-info">
                        <form className = {`${saving ? "Loading" : ""}`}>
                            <label htmlFor="discord-user-id">Discord User ID*</label>
                            <input
                                type="text"
                                id="discord-user-id"
                                name="discord-user-id"
                                value={discordUserID}
                                onChange={handleInputChange}
                                placeholder="Enter Discord User ID..."
                                required
                            />
                            <div className = "button-container-right">
                                <div>
                                    <label htmlFor="formspree-key">Form Spree Key*</label>
                                    <input
                                        type="text"
                                        id="formspree-key"
                                        name="formspree-key"
                                        value={formspreeKey}
                                        onChange={handleInputChange}
                                        placeholder="Enter Form Spree Key..."
                                        required
                                    />
                                </div>
                                <button type = "button" onClick={handleClear} className="save-button clear" disabled={saving}>
                                    Clear
                                </button>
                                <button onClick={handleSave} className="save-button" disabled={saving}>
                                    {saving ? "Saving..." : "Save"}
                                </button>
                            </div>
                        </form>
                    </div>
                    <div id = "analytic-information">
                    </div>
                </>
            )}
        </div>
    );
};

export default Hero;
