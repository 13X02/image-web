import React, { useState } from 'react';
import { Map, InfoWindow, Marker, GoogleApiWrapper } from 'google-maps-react';
import exif from 'exif-js';

function HomePage(props) {
  const [selectedImage, setSelectedImage] = useState(null);
  const [images, setImages] = useState([]);

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = (event) => {
      const image = new Image();
      image.src = event.target.result;

      image.onload = () => {
        exif.getData(image, function() {
          const latitude = exif.getTag(this, 'GPSLatitude');
          const longitude = exif.getTag(this, 'GPSLongitude');

          if (latitude && longitude) {
            setImages((prevImages) => [
              ...prevImages,
              {
                src: event.target.result,
                lat: latitude,
                lng: longitude,
              },
            ]);
          }
        });
      };
    };

    reader.readAsDataURL(file);
  };

  const onMapClick = (props, marker) => {
    setSelectedImage(marker.src);
  };

  return (
    <div className="container">
      <input type="file" onChange={handleImageUpload} />
      <div className="images">
        {images.map((image) => (
          <img
            src={image.src}
            onClick={() => setSelectedImage(image.src)}
            key={image.src}
            className="thumbnail"
          />
        ))}
      </div>
      {selectedImage && (
        <Map
          google={props.google}
          initialCenter={{
            lat: images.find((i) => i.src === selectedImage).lat,
            lng: images.find((i) => i.src === selectedImage).lng,
          }}
          zoom={14}
        >
          {images.map((image) => (
            <Marker
              onClick={onMapClick}
              src={image.src}
              position={{ lat: image.lat, lng: image.lng }}
              key={image.src}
            />
          ))}
          <InfoWindow marker={selectedImage} visible>
            <img src={selectedImage} />
          </InfoWindow>
        </Map>
      )}
    </div>
  );
}

export default GoogleApiWrapper({
  apiKey: 'YOUR_API_KEY',
})(HomePage);
