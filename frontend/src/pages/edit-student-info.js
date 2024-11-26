import React from "react";
import { Modal, Button, TextInput, Title, Space } from "@mantine/core";

const EditStudentModal = ({ isOpen, onClose, studentData, updateStudentData, handleSubmit }) => {

    // Generate initials from the first and last name
    const getInitials = (firstName, lastName) => {
        const firstInitial = firstName?.[0]?.toUpperCase() || "";
        const lastInitial = lastName?.[0]?.toUpperCase() || "";
        return `${firstInitial}${lastInitial}`;
    };

    return (
        <Modal
            opened={isOpen}
            onClose={onClose}
            title={
                <div style={{ padding: "16px 0 0 0" }}>
                    <Title order={3}>Edit Student Information</Title>
                </div>
            }
            centered
            lockScroll={false}
            padding={0}
            styles={{
                header: { justifyContent: "center" },
                close: { position: "absolute", right: "16px" },
            }}
        >
            <div>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "0px 0px 16px 0px" }}>
                    <div style={{
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                        alignItems: "center",
                        margin: 25,
                        padding: 20,
                        backgroundColor: "#fff",
                        border: "none",
                        borderRadius: 100,
                        boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1), 0 8px 16px rgba(0, 0, 0, 0.1)",
                        boxSizing: "border-box",
                        width: 100,
                        height: 100,
                        color: "#007BFF",
                        fontSize: "36px",
                        fontWeight: "bold",
                        textAlign: "center",
                        lineHeight: "60px"
                    }}>
                        {getInitials(studentData?.first_name, studentData?.last_name)}
                    </div>
                </div>
                <div style={{ padding: "0px 25px 25px 25px" }}>
                    <div style={{ display: "flex", flexDirection: "row", justifyContent: "space-between" }}>
                        <TextInput
                            label="First Name"
                            placeholder="Student's First Name"
                            withAsterisk
                            value={studentData.first_name}
                            onChange={(event) => updateStudentData("first_name", event.currentTarget.value)}
                            style={{ maxWidth: "fit-content" }}
                        />
                        <TextInput
                            label="Last Name"
                            placeholder="Student's Last Name"
                            withAsterisk
                            value={studentData.last_name}
                            onChange={(event) => updateStudentData("last_name", event.currentTarget.value)}
                            style={{ maxWidth: "fit-content" }}
                        />
                    </div>
                    <div>
                        <Space h="md" />
                        <TextInput
                            label="I.D."
                            placeholder="Student's Identification Number"
                            withAsterisk
                            value={studentData.student_id}
                            onChange={(event) => updateStudentData("student_id", event.currentTarget.value)}
                        />
                        <Space h="sm" />
                        <TextInput
                            label="Email"
                            placeholder="Student's Email Address"
                            withAsterisk
                            value={studentData.student_email}
                            onChange={(event) => updateStudentData("student_email", event.currentTarget.value)}
                        />
                        <Space h="md" />
                    </div>
                </div>
                <div
                    style={{
                        backgroundColor: "#f8f9fa",
                        borderTop: "1px solid #e3e3e3",
                        padding: "16px",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                    }}
                >
                    <Button
                        variant="outline"
                        style={{
                            borderRadius: "5px",
                            padding: "8px 16px",
                            fontSize: "16px",
                            color: "#6c757d",
                            border: "1px solid #ced4da",
                        }}
                        onClick={onClose}
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={handleSubmit}
                    >
                        Save Changes
                    </Button>
                </div>
            </div>
        </Modal>
    );
};

export default EditStudentModal;
