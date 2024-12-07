import "../styles/hackathons.css";

const Hackthon = ({title, info, link, date, location}) =>
    {
        return (
            <div className = "hackathon" href={link} target="blank">
                <a className = "hackathon-image"></a>
                <div className="hackathon-text">
                    <h1>{title}</h1>
                    <p>At <span className="hackathon-important">{location}</span> During <span className="hackathon-important">{date}</span></p>
                    <p className = "hackathon-info">{info}</p>

                    <div className="link-container">
                        <span className="link">Website</span>
                        <span className="link">Source</span>
                    </div>
                </div>
            </div>
        );
    }
    
export default Hackthon;