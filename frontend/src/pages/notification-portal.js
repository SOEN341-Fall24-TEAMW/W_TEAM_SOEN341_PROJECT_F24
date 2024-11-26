import React, { useEffect } from "react";
import { Notification, Portal } from "@mantine/core";
import { IconCheck, IconAlertCircle } from "@tabler/icons-react";

const NotificationPortal = ({ notification, setNotification }) => {
  useEffect(() => {
    // Automatically dismiss the notification after 3 seconds
    if (notification) {
      const timer = setTimeout(() => {
        setNotification(null);
      }, 3000);
      return () => clearTimeout(timer); // Cleanup on unmount
    }
  }, [notification, setNotification]);

  if (!notification) return null; // Don't render anything if no notification

  return (
    <Portal target="#notification-container">
      <Notification
        color={notification.type === "success" ? "green" : "red"}
        icon={
          notification.type === "success" ? (
            <IconCheck size={18} />
          ) : (
            <IconAlertCircle size={18} />
          )
        }
        title={notification.type === "success" ? "Success" : "Error"}
        onClose={() => setNotification(null)}
        style={{
          width: "300px",
          zIndex: 1000,
        }}
      >
        {notification.message}
      </Notification>
    </Portal>
  );
};

export default NotificationPortal;
