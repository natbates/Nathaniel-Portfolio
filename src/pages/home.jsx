import "../styles/home.css";

import Hero from "../sections/hero";
import About from "../sections/about";
import Experiences from "../sections/experiences";
import Skills from "../sections/skills";
import Projects from "../sections/projects";
import Hackathons from "../sections/hackathons";
import Contact from "../sections/contact";
import Footer from "../comps/Footer";
import Drawings from "../sections/drawings";

const Home = () =>
{

    return(
        <div id = "home">
            <Hero />
            <About />
            <Projects />
                        <Drawings />

            <Experiences />

            <div className="stats-container">
                <div className="stat">
                    <img className="stat-image"src="svgs/fish.svg" />
                    <p className="stat-number">5+</p>
                    <p>Years Experience</p>
                </div>
                <div className="stat">
                    <img  className="stat-image" src="svgs/fish.svg" />
                    <p className="stat-number">4</p>
                    <p>Hackathons Attended</p>
                </div>
                <div className="stat">
                    <img className="stat-image" src="svgs/fish.svg" />
                    <p className="stat-number">4</p>
                    <p>Live Websites</p>
                </div>
            </div>
            <Skills />
            <Contact />
            <Footer />
            {/* <About />
            <Experiences />
            <Hackathons />} */}
        </div>
    );
}

export default Home;