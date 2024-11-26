import React from "react";
import { Button, Modal, Group, Text } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconTrash } from "@tabler/icons-react";

import PropTypes from 'prop-types';


import { notifications } from '@mantine/notifications';


const DeleteStudentButton = ({ studentId, onDelete }) => {
  const [opened, { open, close }] = useDisclosure(false);

  const handleDelete = async () => {
    try {
      const response = await fetch("http://localhost:3080/delete-student", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ studentId }),
      });

      if (response.ok) {
        onDelete(studentId); // Notify parent to refresh the data or remove the student locally
        close();
        notifications.show({
          title: 'Success',
          message: 'Student was deleted successfully!',
          style: { position: "fixed", top: "4rem", right: "1rem", zIndex: 9999 },
          color: 'green',
        });
      } else {
        notifications.show({
          title: 'Error',
          message: 'Failed to delete the student. Please try again.',
          style: { position: "fixed", top: "4rem", right: "1rem", zIndex: 9999 },
          color: 'red',
        });
        console.error("Failed to delete student");
      }
    } catch (error) {
      console.error("Error deleting student:", error);
    }
  };

  return (
    <>
      <Button
        variant="outline"
        color="red"
        leftSection={<IconTrash size={16} />}
        onClick={(e) => {
          e.stopPropagation(); // Prevent triggering the parent row's onClick
          open();
        }}
      >
        Delete
      </Button>
      <Modal
        opened={opened}
        onClose={(e) => {
          e?.stopPropagation(); // Prevent triggering the parent row's onClick when closing the modal
          close();
        }}
        title="Delete Student"
        centered
        lockScroll={false}
        styles={{
          header: { justifyContent: "center" },
          close: { position: "absolute", right: "16px" },
        }}
      >
        <Text>Are you sure you want to delete this student? This action cannot be undone.</Text>
        <Group justify="flex-end" mt="md">
          <Button variant="outline" onClick={(e) => {
            e.stopPropagation(); // Prevent triggering the parent row's onClick
            close();
          }}>
            Cancel
          </Button>
          <Button
            color="red"
            onClick={(e) => {
              e.stopPropagation(); // Prevent triggering the parent row's onClick
              handleDelete();
            }}
          >
            Delete
          </Button>
        </Group>
      </Modal>
    </>
  );
};

DeleteStudentButton.propTypes = {
  studentId: PropTypes.string.isRequired, // Assuming studentId is a string (could be a UUID or other identifier)
  onDelete: PropTypes.func.isRequired,    // Assuming onDelete is a function to handle the deletion
};

export default DeleteStudentButton;
