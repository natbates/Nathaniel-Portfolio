import "../styles/hackathons.css";
import Hackthon from "../comps/hackathon";

const Hackathons = () =>
{
    return(
        <div id = "hackathons" className = "container">
            <div className = "text-container">
                <h1>Hackathons</h1>
                <p>These are all the Hackathons I have attended. I have learnt so much and met so many interesting people throughout these events! And it even landedd me my first job!</p>
                
                <div id = "hackathon-container">
                    <Hackthon title = {"Hackathon Title"}  info = {"blah blah blah blah blah blah blah blah blah blah"} link = {"https://google.com"} date = {"December 8th - 11th, 2024"} location = {"Sussex Uni, Brighton"}></Hackthon>
                    <Hackthon title = {"Hackathon Title"}  info = {"blah blah blah blah blah blah blah blah blah blah"} link = {"https://google.com"} date = {"December 8th - 11th, 2024"} location = {"Sussex Uni, Brighton"}></Hackthon>
                    <Hackthon title = {"Hackathon Title"}  info = {"blah blah blah blah blah blah blah blah blah blah"} link = {"https://google.com"} date = {"December 8th - 11th, 2024"} location = {"Sussex Uni, Brighton"}></Hackthon>
                </div>

            </div>
        </div>
    );
}

export default Hackathons;