import "../styles/skills.css";
import { AuthContext } from "../comps/authContext";
import { useState, useEffect, useContext } from "react";
import fetchData from "../services/fetch-info";
import { db } from "../firebaseConfig";
import { doc, updateDoc, deleteField } from "firebase/firestore";

const Skills = () => {
  const [skills, setSkills] = useState();
  const [newSkill, setNewSkill] = useState("");
  const [loading, setLoading] = useState(false);
  const { currentUser, logout } = useContext(AuthContext);

  useEffect(() => {
    const fetchInfo = async () => {
      const data = await fetchData("skills");
      console.log(data.skills);
      setSkills(data.skills);
    };
    fetchInfo();
  }, []);


  const handleDelete = async (skillName) => {
    if (!currentUser) {
      return;
    }
  
    try {
      setLoading(true); // Set loading state to true while the deletion is happening
  
      const skillsDocRef = doc(db, "skills", "skills"); // Referring to the "skills" document inside the "skills" collection
  
      // Prepare the update data: we want to delete the field corresponding to the skill name
      const updatedSkills = {
        [skillName]: deleteField(), // Firebase's deleteField() function removes the field
      };
  
      // Perform the update operation on the Firestore document
      await updateDoc(skillsDocRef, updatedSkills);
  
      // After successful deletion, update the local state to remove the skill
      setSkills((prevSkills) => {
        const newSkills = { ...prevSkills };
        delete newSkills[skillName]; // Remove the skill from local state
        return newSkills;
      });
  
    } catch (error) {
      console.error("Error deleting skill:", error);
      alert("An error occurred while deleting the skill.");
    } finally {
      setLoading(false); // Set loading state to false once the deletion is complete
    }
  };  

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!newSkill) {
      alert("Please enter a skill name.");
      return;
    }

    try {
      setLoading(true);

      const skillsDocRef = doc(db, "skills", "skills");

      // Update Firestore document by adding a new skill (using the skill name as the field name)
      const updatedSkills = {
        [newSkill]: true,  // We add the new skill as a field with a placeholder value (true)
      };

      // Use `updateDoc` to add the new skill to the Firestore document
      await updateDoc(skillsDocRef, updatedSkills);

      // Update the state to reflect the new skill
      setSkills((prevSkills) => ({
        ...prevSkills,
        [newSkill]: true,
      }));

      setNewSkill(""); // Clear the input after adding the skill
    } catch (error) {
      console.error("Error adding skill:", error);
      alert("An error occurred while adding the skill.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div id="skill" className="container">
      <div className="text-container">
        <h1>Skills</h1>
        <p>
          Here are the main skills I have developed throughout my time at
          University, working, and self-studying. These are just the technical
          skills I have acquired, and there are plenty of{" "}
          <span className="highlighted">interpersonal skills</span> I haven't
          included.
        </p>
        <div className="skill-container">
        {(!skills || Object.keys(skills).length === 0) ? (
            <p>No Skills Listed.</p>
        ) : (
            skills && Object.entries(skills).map(([skill, _]) => (
            <span
                key={skill}
                className={`skill ${currentUser ? "deletion" : ""}`}
                onClick={() => handleDelete(skill)}  // Pass the skill name to delete
            >
                {skill}
            </span>
            ))
        )}
        </div>
      </div>

      {currentUser && (
        <div className="add-skill">
          <form
            className={`add-skill-form${loading ? " Loading" : ""}`}
            onSubmit={handleSubmit}
          >
            <div className="add-skill-container">
              <label htmlFor="skill">Skill Name*</label>
              <input
                id="skill"
                type="text"
                placeholder="Type new skill name..."
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}  // Corrected input change handler
                required
              />
            </div>
            <button
              type="button"
              className="clear"
              onClick={() => setNewSkill("")} // Clear the form on click
            >
              Clear
            </button>
            <button disabled={loading} type="submit">
              {!loading ? "Add" : "Loading..."}
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default Skills;
