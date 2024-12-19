import "../styles/home.css";

import Hero from "../sections/hero";
import About from "../sections/about";
import Experiences from "../sections/experiences";
import Skills from "../sections/skills";
import Projects from "../sections/projects";
import Hackathons from "../sections/hackathons";
import Contact from "../sections/contact";

const Home = () =>
{

    return(
        <div id = "home">
            <Hero />
            <About />
            <Experiences />
            <Skills />
            <Projects />
            <Hackathons />
            <Contact />
        </div>
    );
}

export default Home;