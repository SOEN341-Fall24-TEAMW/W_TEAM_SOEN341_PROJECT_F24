import React from "react";
import { Button, Modal, Group, Text } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconTrash } from "@tabler/icons-react";

import PropTypes from 'prop-types';

import { notifications } from '@mantine/notifications';


const DeleteTeamButton = ({ teamId, onDelete }) => {
    const [opened, { open, close }] = useDisclosure(false);

    const handleDelete = async () => {
        try {
            const response = await fetch("http://localhost:3080/delete-team", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ teamId }),
            });

            if (response.ok) {
                onDelete(teamId); // Notify parent to refresh or remove the team locally
                notifications.show({
                    title: 'Success',
                    message: 'Team was deleted successfully!',
                    style: { position: "fixed", top: "4rem", right: "1rem", zIndex: 9999 },
                    color: 'green',
                });
                close();
            } else {
                notifications.show({
                    title: 'Error',
                    message: 'Failed to delete the team. Please try again.',
                    style: { position: "fixed", top: "4rem", right: "1rem", zIndex: 9999 },
                    color: 'red',
                });
                console.error("Failed to delete team");
            }
        } catch (error) {
            console.error("Error deleting team:", error);
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
                title="Delete Team"
                centered
                lockScroll={false}
                styles={{
                    header: { justifyContent: "center" },
                    close: { position: "absolute", right: "16px" },
                }}
            >
                <Text>Are you sure you want to delete this team? This action cannot be undone.</Text>
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

DeleteTeamButton.propTypes = {
  teamId: PropTypes.string.isRequired, // Assuming teamId is a string (can be UUID or other identifier)
  onDelete: PropTypes.func.isRequired, // Assuming onDelete is a function to handle the deletion
};

export default DeleteTeamButton;