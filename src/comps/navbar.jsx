import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useContext, useState, useEffect } from 'react';
import '../styles/navBar.css'; // Ensure this path is correct based on your folder structure
import { ThemeContext } from './App';
import fetchData from '../services/fetch-info';

const Navbar = () => {
    const location = useLocation(); // Get current location
    const navigate = useNavigate(); // Get the navigate function
    const {theme, toggleTheme} = useContext(ThemeContext);

    const [github, setGithub] = useState("");
    const [linkedin, setLinkedin] = useState("");
    const [x, setX] = useState("");
    const [saving, setSaving] = useState(false);

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
            }
        };
        fetchInfo();
    }, []);

    const handleContactClick = () => {
        // If the user is not on the home page, scroll to home section first
        if (location.pathname !== '/') {
            navigate('/'); // Navigate to home
            setTimeout(() => {
                document.getElementById('contact').scrollIntoView({ behavior: 'smooth' });
            }, 300); // Adjust the delay (in milliseconds) as needed
        } else {
            // If already on the home page, just scroll to the contact section
            document.getElementById('contact').scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <div className="nav-bar">
            <nav>
                <section id="navigate-page">
                    <Link
                        to="/"
                        className={location.pathname === '/' ? 'active' : ''}
                        data-tooltip="Home"
                    >
                        <img alt="home" src="/svgs/home.svg" />
                    </Link>
                    <a
                        href="#contact"
                        className={location.pathname === '/contact' ? 'active' : ''}
                        onClick={(e) => {
                            e.preventDefault(); // Prevent default anchor behavior
                            handleContactClick(); // Handle contact button click
                        }}
                        data-tooltip="Contact"
                    >
                        <img alt="contact" src="/svgs/contact.svg" />
                    </a>
                    <Link
                        to="/login"
                        className={location.pathname === '/login' ? 'active' : ''}
                        data-tooltip="Login"
                    >
                        <img alt="login" src="/svgs/login.svg" />
                    </Link>
                </section>
                <section id="socials">
                    <a href={linkedin.startsWith('http') ? linkedin : `https://${linkedin}`} target='_blank' data-tooltip="Linked In">
                        <img alt="linkedin" src="/svgs/linkedin.svg" />
                    </a>
                    <a href={github.startsWith('http') ? github : `https://${github}`} target='_blank' data-tooltip="Github">
                        <img alt="github" src="/svgs/github.svg" />
                    </a>
                    <a href={x.startsWith('http') ? x : `https://${x}`} target='_blank' data-tooltip="X">
                        <img alt="x" src="/svgs/x.svg" />
                    </a>
                </section>
                <section id="page-settings">
                    <a data-tooltip= {`${theme} Mode`} onClick={toggleTheme}>
                        <img alt="lightmode" src="/svgs/lightmode.svg" />
                    </a>
                </section>
            </nav>
        </div>
    );
};

export default Navbar;
