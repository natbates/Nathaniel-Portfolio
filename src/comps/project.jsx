import "../styles/projects.css";

const Project = ({title, info, link, date}) =>
    {
        return (
            <div className = "project" href={link} target="blank">
                <a className = "project-image"></a>
                <div className="project-text">
                    <h1>{title}</h1>
                    <p>{date}</p>
                    <p>{info}</p>
                </div>
                <div className="skill-container">
                    <span className="skill">Ass</span>
                    <span className="skill">Ass</span>
                    <span className="skill">Ass</span>
                    <span className="skill">Ass</span>
                    <span className="skill">Ass</span>
                    <span className="skill">Ass</span>
                    <span className="skill">Ass</span>
                    <span className="skill">Ass</span>

                </div>
                <div className="link-container">
                    <span className="link">Website</span>
                    <span className="link">Source</span>
                </div>
            </div>
        );
    }
    
export default Project;