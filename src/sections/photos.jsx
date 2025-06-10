import "../styles/photos.css";

const Photos = () => {

    return (
    <div id="photos" className="container">
      <div className="text-container">
        <h1>Photos</h1>
        <p>
          Here is a collection of {" "}
          <span className="highlighted">Photos</span> 
          that capture some of my favorite moments, places, and experiences. 
        </p>
      </div>
            <div className="photos-gallery">

                <img className="photo-image" src="images/photos/1.jpg" />
                <img className="photo-image" src="images/photos/2.jpg" />
                <img className="photo-image" src="images/photos/3.jpg" />
                <img className="photo-image" src="images/photos/4.jpg" />
                <img className="photo-image" src="images/photos/5.jpg" />
                <img className="photo-image" src="images/photos/6.jpg" />

            </div>
        </div>
    );
}

export default Photos;