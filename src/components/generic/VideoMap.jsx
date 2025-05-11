import React, { useEffect, useRef, useState } from "react";
import Map, { Marker, NavigationControl } from "react-map-gl/maplibre";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import "./VideoMap.scss";

const MAPTILER_API_KEY = "9ZAPtDmeN8XWksv8By2C";

function VideoMap({ locations = [] }) {
  const [hoveredId, setHoveredId] = useState(null);
  const [activeVideo, setActiveVideo] = useState(null);
  const mapRef = useRef(null);

  const initialView = {
    longitude: 23.7275,
    latitude: 37.9838,
    zoom: 6,
  };

  const handleMarkerClick = (lng, lat, videoUrl) => {
    if (mapRef.current) {
      mapRef.current.flyTo({
        center: [lng, lat],
        zoom: 20,
        speed: 4.8,
        curve: 2.42,
        easing: (t) => t,
        essential: true,
      });
    }

    setTimeout(() => {
      setActiveVideo(videoUrl);
    }, 800); // Wait for zoom to complete before showing video
  };

  const handleCloseVideo = () => {
    setActiveVideo(null);
    if (mapRef.current) {
      mapRef.current.flyTo({
        center: [23.7275, 37.9838],
        zoom: 6,
        speed: 4.8,
        curve: 2.42,
        easing: (t) => t,
        essential: true,
      });
    }
  };

  return (
    <div className={`video-map-container ${activeVideo ? "blurred" : ""}`}>
      <Map
        mapLib={maplibregl}
        initialViewState={initialView}
        style={{ width: "100%", height: "600px" }}
        mapStyle={`https://api.maptiler.com/maps/hybrid/style.json?key=${MAPTILER_API_KEY}`}
        onLoad={(e) => (mapRef.current = e.target)}
      >
        <NavigationControl position="top-right" />

        {locations.map((location) => (
          <Marker
            key={location.id}
            longitude={location.coordinates[0]}
            latitude={location.coordinates[1]}
          >
            <div
              className="marker"
              onMouseEnter={() => setHoveredId(location.id)}
              onMouseLeave={() => setHoveredId(null)}
              onClick={() =>
                handleMarkerClick(
                  location.coordinates[0],
                  location.coordinates[1],
                  location.videoSrc
                )
              }
            >
              <img
                src="images/pictures/marker.png"
                alt={location.name}
                className="marker-thumbnail"
              />
            </div>

            {hoveredId === location.id && (
              <div className="marker-preview">
                <img
                  src={`https://img.youtube.com/vi/${getYoutubeId(
                    location.videoSrc
                  )}/0.jpg`}
                  alt={location.name}
                />
              </div>
            )}
          </Marker>
        ))}
      </Map>

      {activeVideo && (
  <div className="map-video-popup">
    <iframe
      src={`https://www.youtube.com/embed/${getYoutubeId(activeVideo)}?autoplay=1`}
      title="Video Preview"
      frameBorder="0"
      allow="autoplay; fullscreen"
      allowFullScreen
    />
    <button className="close-button" onClick={handleCloseVideo}>×</button>
  </div>
)}
    </div>
  );
}

function getYoutubeId(url) {
  const match = url.match(/[?&]v=([^&#]+)/) || url.match(/youtu\.be\/([^&#]+)/);
  return match ? match[1] : "";
}

export default VideoMap;
