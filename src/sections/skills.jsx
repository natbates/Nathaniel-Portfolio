import "../styles/skills.css";

const Skills = () =>
{
    return(
        <div id = "skill" className = "container">
            <div className = "text-container">
                <h1>Skills</h1>
                <p>Here are the main skills I have developed through out my time at University, Working and Self Studying. 
                    These are just the technical skills I have aquired, there are plenty of <span className="highlighted">interpersonal skills</span> I havent included.
                </p>
                <div className="skill-container">
                    <span className="skill">React</span>
                    <span className="skill">React</span>
                </div>
            </div>
        </div>
    );
}

export default Skills;