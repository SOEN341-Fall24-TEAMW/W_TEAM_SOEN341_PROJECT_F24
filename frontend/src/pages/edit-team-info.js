import React, { useState } from "react";
import { Modal, Button, TextInput, Title, Space, NumberInput, MultiSelect } from "@mantine/core";
import PropTypes from 'prop-types';

const EditTeamInfo = ({ isOpen, onClose, teamData, updateTeamData, handleSubmit, orgStudentList }) => {

    const [numberInputError, setNumberInputError] = useState("");
    const [multiSelectError, setMultiSelectError] = useState("");

    const selectedStudents = Array.isArray(teamData.selected_students)
        ? teamData.selected_students
        : teamData.selected_students.split(", ").map(student => student.trim());

    return (
        <Modal
            opened={isOpen}
            onClose={onClose}
            title={
                <div style={{ padding: "16px 0 0 0" }}>
                    <Title order={3}>Edit Team Information</Title>
                </div>
            }
            centered
            lockScroll={false}
            padding={0}
            styles={{
                header: { justifyContent: "center", padding: "0", margin: "0" },
                close: { position: "absolute", right: "16px" },
                overlay: { backgroundColor: "rgba(0, 0, 0, 0.5)" }, // Add a dark overlay
                content: { borderRadius: "8px", boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)" }, // Optional shadow for aesthetics
            }}
        >
            <div style={{ padding: "16px 24px" }}>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "0px 0px 16px 0px" }}>
                    <div style={{ display: "flex", justifyContent: "center" }}>
                        <img src="org-icon.svg" alt="Default Organization Icon"
                            style={{
                                display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center",
                                margin: 25, padding: 20, backgroundColor: "#fff", border: "none", borderRadius: 100,
                                boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1), 0 8px 16px rgba(0, 0, 0, 0.1)", boxSizing: "border-box"
                            }}
                        />
                    </div>
                </div>
                <div style={{ padding: "0px 25px 25px 25px" }}>
                    <div style={{ display: "flex", flexDirection: "row", justifyContent: "space-between" }}>
                        <TextInput
                            label="Team Name"
                            placeholder="Team's Name"
                            withAsterisk
                            value={teamData.team_name}
                            onChange={(event) => updateTeamData("team_name", event.currentTarget.value)}
                            style={{ maxWidth: "fit-content", padding: "0px 5px 0px 0px" }}
                        />
                        <NumberInput
                            label="Max Team Size"
                            placeholder="Max Size"
                            withAsterisk
                            value={teamData.max_size ? teamData.max_size : ""}
                            onChange={(value) => {
                                if (value < selectedStudents.length) {
                                    setNumberInputError(`Max size cannot be less than the number of currently selected students (${selectedStudents.length}).`);
                                } else {
                                    setNumberInputError("");
                                    setMultiSelectError("");
                                    updateTeamData("max_size", value);
                                }
                            }}
                            min={1}
                            max={30}
                            style={{ padding: "0px 0px 0 5px" }}
                            error={numberInputError ? numberInputError : ""}
                        />
                    </div>
                    <div>
                        <Space h="md" />
                        <MultiSelect
                            label="Team Students"
                            placeholder="Team Members"
                            data={
                                Array.isArray(orgStudentList)
                                    ? orgStudentList
                                        .filter(student => !teamData.selected_students.includes(student.name))
                                        .map(student => ({
                                            value: student.name,
                                            label: student.name
                                        }))
                                    : []
                            }
                            withAsterisk
                            value={selectedStudents}
                            onChange={(value) => {
                                if (value.length <= teamData.max_size) {
                                    updateTeamData("selected_students", value);
                                    setMultiSelectError("");
                                    setNumberInputError("");
                                } else {
                                    setMultiSelectError("Maximum allotted size exceeded");
                                }
                            }}
                            error={multiSelectError ? multiSelectError : ""}
                        />

                        <Space h="sm" />
                    </div>
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
        </Modal>
    );
};


EditTeamInfo.propTypes = {
    isOpen: PropTypes.bool.isRequired, // Assuming it's a boolean (open or closed state)
    onClose: PropTypes.func.isRequired, // Assuming it's a function to close the modal
    teamData: PropTypes.shape({
      selected_students: PropTypes.arrayOf(PropTypes.string).isRequired, // Assuming selected_students is an array of student IDs or names
      team_name: PropTypes.string.isRequired, // Assuming team_name is a string
      max_size: PropTypes.number.isRequired, // Assuming max_size is a number
    }).isRequired,
    updateTeamData: PropTypes.func.isRequired, // Assuming updateTeamData is a function
    handleSubmit: PropTypes.func.isRequired, // Assuming handleSubmit is a function
    orgStudentList: PropTypes.arrayOf(PropTypes.object).isRequired, // Assuming it's an array of student objects
  };
  
export default EditTeamInfo;
