import "../styles/footer.css"; // Adjust the path as necessary
import { useNavigate } from "react-router-dom";

const Footer = () => {

    const navigate = useNavigate();

    return (
        <footer className="footer">
            <div className="footer-content">
                <div className="footer-text">
                    <p onClick={() => {navigate("/login")}} style={{cursor: "pointer"}}>© 2025 Nathaniel Bates.</p>
                </div>
                <div className="social-media-icons">
                    <a href="" target="_blank" rel="noopener noreferrer">
                        <img src="/svgs/github.svg" alt="GitHub" />
                    </a>
                    <a href="" target="_blank" rel="noopener noreferrer">
                        <img src="/svgs/linkedin.svg" alt="LinkedIn" />
                    </a>
                    <a href="" target="_blank" rel="noopener noreferrer">
                        <img src="/svgs/x.svg" alt="X" />
                    </a>
                </div>
            </div>
            <div className="footer-bottom">
            </div>
        </footer>
    );
}

export default Footer;