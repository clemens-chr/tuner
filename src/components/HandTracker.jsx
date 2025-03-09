import React, { useState, useEffect } from "react";

const HandTracker = () => {
  const [imageLoaded, setImageLoaded] = useState(false);

  useEffect(() => {
    const img = new Image();
    img.src = "http://127.0.0.1:8000/video_feed";
    img.onload = () => setImageLoaded(true);
    img.onerror = () => setImageLoaded(false);
  }, []);

  return (
    <img
      src={imageLoaded ? "http://127.0.0.1:8000/video_feed" : "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='1920' height='1080' viewBox='0 0 1920 1080'%3E%3Crect width='1920' height='1080' fill='blue'/%3E%3C/svg%3E"}
      alt="Video Stream"
      style={{ width: "80%", height: "auto" }}
    />
  );
};

export default HandTracker;