import React from "react";

const NotificationContainer = () => {
  return (
    <div
      id="notification-container"
      style={{
        position: "fixed", // Position the container relative to the viewport
        top: "4rem",       // Adjust this value to match your header height
        right: "1rem",     // Align it to the right side
        zIndex: 9999,      // Ensure it stays above other content
      }}
    />
  );
};

export default NotificationContainer;