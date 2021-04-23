import React from "react";

export default function MapDetails({ osm }) {
  const getEmbedUrl = (osmUrl) => {
    const info = osmUrl.split("#map=");
    const infoArr = info[1] ? info[1].split("/") : null;
    const lat = infoArr[1] ? infoArr[1] : null;
    const lon = infoArr[2] ? infoArr[2] : null;
    const zoom = infoArr[0] ? infoArr[0] : null;

    return `https://maps.google.com/maps?width=100%&height=100%&hl=en&ll=${lat},${lon}&q=+()&ie=UTF8&t=&z=${
      zoom - 2
    }&iwloc=B&output=embed`;
  };

  return (
    <div className="map-container">
      <iframe
        title="gmap"
        width="300"
        height="200"
        frameBorder="0"
        scrolling="no"
        marginHeight="0"
        marginWidth="0"
        src={getEmbedUrl(osm)}
      />
    </div>
  );
}
