import React, { useEffect, useRef, useState } from "react";
import Map, { Marker, NavigationControl } from "react-map-gl/maplibre";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import "./VideoMap.scss";

const MAPTILER_API_KEY = "9ZAPtDmeN8XWksv8By2C";

function VideoMap({ locations = [] }) {
  const [hoveredPreview, setHoveredPreview] = useState(null);
  const [activeVideo, setActiveVideo] = useState(null);
  const mapRef = useRef(null);

  useEffect(() => {
    if (!mapRef.current || !hoveredPreview?.tracking) return;

    const map = mapRef.current;

    const updatePosition = () => {
      const location = locations.find((l) => l.id === hoveredPreview.id);
      if (!location) return;

      const { x, y } = map.project([
        location.coordinates[0],
        location.coordinates[1],
      ]);
      setHoveredPreview((prev) => ({ ...prev, x, y }));
    };

    map.on("move", updatePosition);

    return () => {
      map.off("move", updatePosition);
    };
  }, [hoveredPreview, locations]);

  const initialView = {
    longitude: 15,
    latitude: 40,
    zoom: 4.5,
  };

  const handleMouseEnter = (location) => {
    if (!mapRef.current) return;
    const { x, y } = mapRef.current.project({
      lon: location.coordinates[0],
      lat: location.coordinates[1],
    });
    setHoveredPreview({
      id: location.id,
      x,
      y,
      img: "images/pictures/project-logo-1.png",
      tracking: true,
    });
  };

  const handleMarkerClick = (lng, lat, videoUrl) => {
    if (mapRef.current) {
      setHoveredPreview(null);
      mapRef.current.flyTo({
        center: [lng, lat],
        zoom: 20,
        speed: 1.8,
        curve: 2.0,
        easing: (t) => t,
        essential: true,
      });
    }

    setTimeout(() => {
      setActiveVideo(videoUrl);
    }, 0);
  };

  const handleCloseVideo = () => {
    setActiveVideo(null);
    if (mapRef.current) {
      mapRef.current.flyTo({
        center: [23.7275, 38.7],
        zoom: 4.5,
        speed: 3.8,
        curve: 2.42,
        easing: (t) => t,
        essential: true,
      });
    }
  };

  return (
    <div className={`video-map-container ${activeVideo ? "video-active" : ""}`}>
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
              onMouseEnter={() => handleMouseEnter(location)}
              onMouseLeave={() => setHoveredPreview(null)}
              onClick={() =>
                handleMarkerClick(
                  location.coordinates[0],
                  location.coordinates[1],
                  location.videoSrc
                )
              }
            >
              <img
                src="images/svg/marker.svg"
                alt={location.name}
                className="marker-thumbnail"
              />
            </div>

            {/* {hoveredId === location.id && (
              <div className="marker-preview">
                <img
                  src={`https://img.youtube.com/vi/${getYoutubeId(
                    location.videoSrc
                  )}/0.jpg`}
                  alt={location.name}
                />
              </div>
            )} */}
          </Marker>
        ))}
      </Map>
      {hoveredPreview &&
        locations.find((loc) => loc.id === hoveredPreview.id) && (
          <div
            className="marker-preview"
            style={{
              top: hoveredPreview.y,
              left: hoveredPreview.x,
            }}
          >
            <img src={hoveredPreview.img} alt="" />
          </div>
        )}
      {activeVideo && (
        <div className="map-video-popup delayed-fadeIn">
          <video src={activeVideo} autoPlay playsInline controls />
          <button className="close-button" onClick={handleCloseVideo}>
            ×
          </button>
        </div>
      )}
    </div>
  );
}

export default VideoMap;
