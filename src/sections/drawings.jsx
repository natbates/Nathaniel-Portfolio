import "../styles/drawings.css";

const Drawings = () => {

    return (
    <div id="drawing" className="container">
      <div className="text-container">
        <h1>Drawings</h1>
        <p>
          Here is a collection of {" "}
          <span className="highlighted">Drawings</span> i have workeed on over the years.
        </p>
      </div>
            <div className="drawings-gallery">

                <img className="drawing-image" src="images/drawing1.jpg" />
                <img className="drawing-image" src="images/drawing2.jpg" />
                <img className="drawing-image" src="images/drawing3.jpg" />
                <img className="drawing-image" src="images/drawing4.jpg" />
                <img className="drawing-image" src="images/drawing5.jpg" />
                <img className="drawing-image" src="images/drawing6.jpg" />

            </div>
        </div>
    );
}

export default Drawings;