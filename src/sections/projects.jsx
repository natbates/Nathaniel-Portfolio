import "../styles/projects.css";
import Project from "../comps/project.jsx"

const Projects = () =>
{
    return(
        <div id = "projects" className = "container">
            <div className = "text-container">
                <h1>Projects</h1>
                <p>Front end React web developer currently working for Hastings Direct. Student at the University of Sussex</p>
            
                <div id = "project-container">
                    <Project title = {"hello"}  info = {"blah blah"} link = {"https://google.com"}></Project>
                    <Project title = {"hello"}  info = {"blah blah"} link = {"https://google.com"}></Project>
                    <Project title = {"hello"}  info = {"blah blah"} link = {"https://google.com"}></Project>
                    <Project title = {"hello"}  info = {"blah blah"} link = {"https://google.com"}></Project>
                </div>

            </div>
        </div>
    );
}

export default Projects;