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
import Stats from "../sections/stats";

const Home = () =>
{

    return(
        <div id = "home">
            <Hero />
            <Projects />
            <Stats />
            <About />
            <Skills />
            <Experiences />
            {/* <Drawings /> */}
            <Contact />
            <Footer />
        </div>
    );
}

export default Home;