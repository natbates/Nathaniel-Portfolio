import "../styles/footer.css"; // Adjust the path as necessary
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import fetchData from "../services/fetch-info";
import { Loading } from "./loading";

const Footer = () => {

    const navigate = useNavigate();

    const [github, setGithub] = useState("");
    const [linkedin, setLinkedin] = useState("");
    const [x, setX] = useState("");

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchInfo = async () => {
            try {
                const data = await fetchData("socials");
                Object.entries(data.socials).forEach(([key, value]) => {
                    if (key === "github") {
                        setGithub(value);
                    } else if (key === "linkedin") {
                        setLinkedin(value);
                    } else if (key === "x") {
                        setX(value);
                    }
                });
            } catch (error) {
                console.error("Error fetching socials:", error);
            } finally {
                setLoading(false); 
            }
        };
        fetchInfo();
    }, []);

    return (
        <footer className="footer">
            <div className="footer-content">
                <div className="footer-text">
                    <p onClick={() => {navigate("/login")}} style={{cursor: "pointer"}}>© 2025 Nathaniel Bates.</p>
                </div>

                {!loading ? (
                <div className="social-media-icons">
                    <a href={github.startsWith('http') ? github : `https://${github}`} target='_blank' data-tooltip="Github" rel="noopener noreferrer">
                        <img src="/svgs/github.svg" alt="GitHub" />
                    </a>
                    <a href={linkedin.startsWith('http') ? linkedin : `https://${linkedin}`} target='_blank' data-tooltip="Linked In"  rel="noopener noreferrer">
                        <img src="/svgs/linkedin.svg" alt="LinkedIn" />
                    </a>
                    <a href={x.startsWith('http') ? x : `https://${x}`} target='_blank' data-tooltip="X" rel="noopener noreferrer">
                        <img src="/svgs/x.svg" alt="X" />
                    </a>
                </div>) :
                <div className="social-media-loading">
                    <Loading />
                </div>}
            </div>
            <div className="footer-bottom">
            </div>
        </footer>
    );
}

export default Footer;