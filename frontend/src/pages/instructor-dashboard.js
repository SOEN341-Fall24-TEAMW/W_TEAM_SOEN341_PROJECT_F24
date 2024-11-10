import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DashboardFilterSort from './DashboardFilterSort.js';
import { NavLink, AppShell, Table, Group, Space, Modal, Button, Title, TextInput, rem, Select, Menu, NumberInput, MultiSelect, Alert, Text, FileInput, Notification } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IconUsers, IconUsersGroup, IconMessage, IconSearch, IconDatabaseImport, IconCirclePlus, IconX, IconCheck } from '@tabler/icons-react';

import Papa from "papaparse";
import './styles.css';
import InstructorDashboardFeedbacks from "./instructor-dashboard-feedbacks.js";
// Filtering and sorting logic based on filterSortOptions
const applyFilterAndSort = (students, filterSortOptions) => {
  return students
    .filter((student) => {
      if (filterSortOptions.filterBy && filterSortOptions.filterValue) {
        const columnValue = student[filterSortOptions.filterBy]?.toString().toLowerCase();
        const filterValue = filterSortOptions.filterValue.toLowerCase();
        return columnValue && columnValue.includes(filterValue);
      }
      return true; // No filtering if filterBy or filterValue is not set
    })
    .sort((a, b) => {
      if (filterSortOptions.sortBy) {
        const aValue = a[filterSortOptions.sortBy];
        const bValue = b[filterSortOptions.sortBy];
        if (aValue < bValue) return filterSortOptions.sortOrder === 'asc' ? -1 : 1;
        if (aValue > bValue) return filterSortOptions.sortOrder === 'asc' ? 1 : -1;
      }
      return 0;
    });
};



const InstructorDashboard = ({organizations, org, courses, teams, students, memberships, email, fetchData, loggedIn, setLoggedIn }) => {
  const [filterSortOptions, setFilterSortOptions] = useState({
    filterBy: '',       // Column to filter by, e.g., 'Name'
    filterValue: '',    // Value to filter by, e.g., 'John'
    sortBy: '',         // Column to sort by, e.g., 'ID'
    sortOrder: 'asc'    // Sort order: 'asc' or 'desc'
  });
  const exportCSV = () => {
    fetch('/instructor/export', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${user.token}`,
      },
    })
    .then(response => {
      if (response.ok) {
        return response.blob();
      }
      throw new Error('Failed to fetch CSV data.');
    })
    .then(blob => {
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = 'students_export.csv';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
    })
    .catch(error => console.error('Error exporting CSV:', error));
  };
  
  
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    if (!user || !user.token) {
      console.error("JWT token not found. Please log in again.");
      setLoggedIn(false);
      navigate('/');
    }
  }, [user, navigate, setLoggedIn]);

  const [active, setActive] = useState('Students');
  const [query, setQuery] = useState('');
  const [opened, { open, close }] = useDisclosure(false);
  const [step, setStep] = useState(1);
  const [maxSizeError, setMaxSizeError] = useState("");

  const [importSuccess, setImportSuccess] = useState(false);
  const [importFail, setImportFail] = useState(false);
  const [notifySuccess, setNotifySuccess] = useState(false);
  const [notifyError, setNotifyError] = useState(false);

  const [firstNameError, setFirstNameError] = useState("");
  const [lastNameError, setLastNameError] = useState("");
  const [idError, setIdError] = useState("");
  const [emailError, setEmailError] = useState("");

  const icon = [<IconCirclePlus size={14} />, <IconDatabaseImport size={14} />];
  const xIcon = <IconX style={{ width: rem(20), height: rem(20) }} />;
  const checkIcon = <IconCheck style={{ width: rem(20), height: rem(20) }} />;

  const fileInputRef = useRef(null);

  const handleFileInputClick = () => {
    // the file input click
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileUpload = (event) => {

    if (!event.target) {
      console.error("File input event structure is invalid or files are missing");
      return;
    }
    const file = event.target.files[0];
    console.log('File selected:', file);
    // Logic to handle the file
    if (file) {
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: async function (results) {
          console.log("Parsed Data:", results.data);
          try {
            const response = await fetch("http://localhost:3080/import-student-csv", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ students: results.data, instructor: email }),
            });

            if (response.ok) {
              console.log("Data uploaded successfully.");
              setImportSuccess(true);
              setNotifySuccess(true);
              fetchData();
              setTimeout(() => { setImportSuccess(false); }, 5000);
              setTimeout(() => { setNotifySuccess(false); }, 10000);
            } else {
              console.error("Upload failed.");
              setImportFail(true);
              setNotifyError(true);
              fetchData();
              setTimeout(() => { setImportFail(false); }, 5000);
              setTimeout(() => { setNotifyError(false); }, 10000);
            }
          } catch (error) {
            console.error("Error:", error);
          }
        },
      });
    }
  };


  // Single state object to hold all team data
  const [teamData, setTeamData] = useState({
    organization_id: "",
    new_org_name: "",
    course_id: "",
    new_course_name: "",
    team_name: "",
    max_size: 5,
    instructor_id: email,
    selected_students: [],
  });

  const [studentData, setStudentData] = useState({
    student_id: "",
    student_email: "",
    first_name: "",
    last_name: "",
    organization_id: "",
    new_org_name: "",
  })

  // Handler to reset the teamData and step
  const resetForm = () => {
    setTeamData({
      organization_id: "",
      new_org_name: "",
      course_id: "",
      new_course_name: "",
      team_name: "",
      max_size: 5,
      instructor_id: email,
      selected_students: [],
    });
    setStudentData({
      student_id: "",
      student_email: "",
      first_name: "",
      last_name: "",
      organization_id: "",
      new_org_name: "",
    })
    setStep(1);
  };

  // Handler for moving to the next step
  const handleNextStep = () => {
    setStep(step + 1);
  };

  // Handler for moving to the next step
  const validateBeforeNextStep = () => {

    let hasError = false;

    setFirstNameError("");
    setLastNameError("");
    setIdError("");
    setEmailError("");

    const { student_id, student_email, first_name, last_name } = studentData;
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    if (first_name === "") {
      setFirstNameError("Please enter student's first name");
      hasError = true;
    }
    if (last_name === "") {
      setLastNameError("Please enter student's last name");
      hasError = true;
    }
    if (student_id === "" || isNaN(student_id)) {
      setIdError("Please enter a proper student ID");
      hasError = true;
    }
    if (student_email === "" || !emailPattern.test(student_email)) {
      setEmailError("Please enter a proper email address");
      hasError = true;
    }

    if (hasError) {
      return;

    }
    setStep(step + 1);
  };

  // Handler for updating teamData
  const updateTeamData = (key, value) => {
    setTeamData((prevState) => ({
      ...prevState,
      [key]: value,
    }));
  };

  //Handler for updating studentData
  const updateStudentData = (key, value) => {
    setStudentData((prevState) => ({
      ...prevState,
      [key]: value,
    }));
  };

  // Handler for closing form
  const modalClose = () => {

    setFirstNameError("");
    setLastNameError("");
    setIdError("");
    setEmailError("");

    resetForm();
    close();
  };

  // Handler for submitting the new user's form data
  const handleSubmit = async () => {
    try {
      // Single API call to submit all the user data at once
      await fetch("http://localhost:3080/create-student", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(studentData),
      });

      // After successful submission, close modal and reset form
      close();
      resetForm();
      fetchData();

    } catch (error) {
      console.error("Error creating user:", error);
    }
  };


  // Handler for submitting the new team's form data
  const handleSubmit2 = async () => {

    try {
      // Single API call to submit all the team data at once
      await fetch("http://localhost:3080/create-team", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(teamData),
      });

      // After successful submission, close modal and reset form
      close();
      resetForm();
      fetchData();
    } catch (error) {
      console.error("Error creating team:", error);
    }
  };

  const tabs = [
    { label: 'Students', icon: IconUsers },
    { label: 'Teams', icon: IconUsersGroup },
    { label: 'Feedbacks', icon: IconMessage }
  ];

  const navBarData = tabs.map((data) => (
    <NavLink
      key={data.label}
      leftSection={<data.icon size='1rem' stroke='1.5' />}
      childrenOffset={28}
      label={data.label}
      active={data.label === active}
      variant="light"
      component="button"
      onClick={() => setActive(data.label)}
    />
  ))

  const rows = org
  ? applyFilterAndSort(students || [], filterSortOptions)
  .filter(
    (student) =>
      student.organization_id === (organizations.find((organization) => organization.name === org) || {}).id
  )
  .filter(
    (student) =>
      student.name.toLowerCase().includes(query.toLowerCase()) ||
      student.id.toString().includes(query.toLowerCase())
  )
  .map((student) => {
    const student_memberships = (memberships || []).filter((membership) => membership.student_id === student.id);

    const team_names = student_memberships
      .map((membership) => (teams || []).find((team) => team.id === membership.team_id)?.name)
      .filter((team_name) => team_name)
      .join(", ");

    const team_courses = student_memberships
      .map((membership) => (teams || []).find((team) => team.id === membership.team_id)?.course_id)
      .filter((course_id) => course_id);
    const course_names = team_courses
      .map((course_id) => (courses || []).find((course) => course.id === course_id)?.name)
      .filter((course_name) => course_name)
      .join(", ");

    const organization_name = (organizations || []).find((organization) => organization.id === student.organization_id)?.name || "Unknown organization";

    return (
      <Table.Tr key={student.id}>
        <Table.Td>{student.name || "No name"}</Table.Td>
        <Table.Td>{student.id || "No id"}</Table.Td>
        <Table.Td>{student.email || "No email"}</Table.Td>
        <Table.Td>{team_names || "No team"}</Table.Td>
        <Table.Td>{course_names || "No course"}</Table.Td>
        <Table.Td>{organization_name || "No organization"}</Table.Td>
      </Table.Tr>
    );
  })
: [];

  const rows2 = org
    ? (teams || [])
      .filter((team) => {
        const selected_org_id = (organizations.find((organization) => organization.name === org) || {}).id;
        const team_course = (courses || []).find((course) => course.id === team.course_id);
        return team_course && team_course.organization_id === selected_org_id;
      })
      .filter((team) => team.name.toLowerCase().includes(query.toLowerCase())) // Filter teams based on query
      .map((team) => {
        const team_memberships = (memberships || []).filter((membership) => membership.team_id === team.id);

        const student_names = team_memberships
          .map((membership) => (students || []).find((student) => student.id === membership.student_id)?.name)
          .filter((student_name) => student_name)
          .join(", ");

        const team_course = (courses || []).find((course) => course.id === team.course_id);
        const course_names = team_course ? team_course.name : "No course";
        const organization_name = (organizations.find((organization) => organization.id === team_course?.organization_id) || {}).name || "Unknown organization";

        return (
          <Table.Tr key={team.id}>
            <Table.Td>{team.name || "No name"}</Table.Td>
            <Table.Td>{student_names || "No members"}</Table.Td>
            <Table.Td>{team.max_size || "No members"}</Table.Td>
            <Table.Td>{course_names || "No course"}</Table.Td>
            <Table.Td>{organization_name || "No organization"}</Table.Td>
          </Table.Tr>
        );
      })
    : [];


  return (
    <AppShell navbar={{ width: 250 }}>
      <AppShell.Navbar>{navBarData}</AppShell.Navbar>
      {(active === 'Students') && (<AppShell.Main>
        <Space h="md" />
        <Button
  style={{
    backgroundColor: "#4CAF50",
    color: "white",
    fontSize: "16px",
    fontWeight: "bold",
    padding: "10px 20px",
    margin: "10px 0",
    cursor: "pointer",
  }}
  onClick={exportCSV}
>
  Export Student Data
</Button>

        <DashboardFilterSort onApply={setFilterSortOptions} />
        <Group justify="space-between">
          <Title>Students</Title>
          <Modal
            opened={opened}
            onClose={modalClose}
            title={
              <div style={{ padding: "16px 0 0 0" }}>
                <Title order={3}>Add a New Student</Title>
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
            {step === 1 && (
              <div>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "0px 0px 16px 0px" }}>
                  <Text size="xl" style={{ color: "rgb(115, 115, 115)" }}>Enter Contact Information</Text>
                  <div style={{ display: "flex", justifyContent: "center" }}>
                    <img src="user-icon.svg" alt="Default User Icon"
                      style={{
                        display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center",
                        margin: 25, padding: 20, backgroundColor: "#fff", border: "none", borderRadius: 100,
                        boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1), 0 8px 16px rgba(0, 0, 0, 0.1)", boxSizing: "border-box"
                      }} />
                  </div>
                </div>
                <div style={{ padding: "0px 25px 25px 25px" }}>
                  <div style={{ display: "flex", flexDirection: "row", justifyContent: "space-between" }}>
                    <TextInput
                      label="First Name"
                      placeholder="Student's First Name"
                      withAsterisk
                      value={studentData.first_name}
                      onChange={(event) => { updateStudentData("first_name", event.currentTarget.value); setFirstNameError(""); }}
                      error={firstNameError ? firstNameError : ""}
                      style={{ maxWidth: "fit-content" }}
                    />
                    <TextInput
                      label="Last Name"
                      placeholder="Student's Last Name"
                      withAsterisk
                      value={studentData.last_name}
                      onChange={(event) => { updateStudentData("last_name", event.currentTarget.value); setLastNameError(""); }}
                      error={lastNameError ? lastNameError : ""}
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
                      onChange={(event) => { updateStudentData("student_id", event.currentTarget.value); setIdError(""); }}
                      error={idError ? idError : ""}
                    />
                    <Space h='sm' />
                    <TextInput
                      label="Email"
                      placeholder="Student's Email Address"
                      withAsterisk
                      value={studentData.student_email}
                      onChange={(event) => { updateStudentData("student_email", event.currentTarget.value); setEmailError(""); }}
                      error={emailError ? emailError : ""}
                    />
                    <Space h="md" />
                  </div>
                </div>
                <div style={{
                  backgroundColor: "#f8f9fa",
                  borderTop: "1px solid #e3e3e3",
                  padding: "16px",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center"
                }}>
                  <Button
                    variant="outline"
                    style={{
                      borderRadius: "5px",
                      padding: "8px 16px",
                      fontSize: "16px",
                      color: "#6c757d",
                      border: "1px solid #ced4da"
                    }}
                    onClick={modalClose}
                  >
                    Cancel
                  </Button>

                  <Button
                    onClick={validateBeforeNextStep}
                  >
                    Continue
                  </Button>
                </div>
              </div>
            )}

            {/* Step 2: Select or Add Organization */}
            {step === 2 && (
              <div>
                <div style={{ padding: "0px 25px 25px 25px" }}>
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "0px 0px 16px 0px" }}>
                    <Text size='xl' style={{ color: "rgb(115, 115, 115)" }}>Select an Organization</Text>
                    <Space h='xl' />
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
                  <Space h='lg' />
                  <Select id="org-select"
                    label="Choose an existing organization"
                    placeholder="Select organization"
                    data={organizations.map((org) => ({ value: org.id, label: org.name }))}
                    value={studentData.organization_id}
                    onChange={(value) => updateStudentData("organization_id", value)}
                  />
                  <Space h="sm" />
                  <TextInput
                    label="Or add a new organization"
                    placeholder="New Organization Name"
                    value={studentData.new_org_name}
                    onChange={(event) => { updateStudentData("new_org_name", event.currentTarget.value); updateStudentData("course_id", null) }}
                  />
                </div>

                <div justify="flex-end" style={{
                  backgroundColor: "#f8f9fa",
                  borderTop: "1px solid #e3e3e3",
                  padding: "16px",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center"
                }}>
                  <Button
                    variant="outline"
                    style={{
                      borderRadius: "5px",
                      padding: "8px 16px",
                      fontSize: "16px",
                      color: "#6c757d",
                      border: "1px solid #ced4da"
                    }}
                    onClick={modalClose}
                  >
                    Cancel
                  </Button>
                  <Button onClick={handleSubmit} disabled={!studentData.organization_id && !studentData.new_org_name} >
                    Add Organization and Finish
                  </Button>
                </div>
              </div>
            )}
          </Modal>
          <div>
            <Menu>
              <Menu.Target>
                <Button>Add a New Student</Button>
              </Menu.Target>
              <Menu.Dropdown>
                <Menu.Item
                  onClick={open}
                  leftSection={icon[0]}
                >
                  Create New Student
                </Menu.Item>
                <Menu.Item
                  onClick={handleFileInputClick}
                  leftSection={icon[1]}
                >
                  Import From File
                </Menu.Item>
              </Menu.Dropdown>
            </Menu>
            <input
              type="file"
              ref={fileInputRef}
              style={{ display: 'none' }}
              onChange={handleFileUpload}
              accept=".csv"
            />
          </div>
        </Group>
        <Space h="xl" />
        <Group justify="space-between" style={{ alignItems: "center", height: "62.59px" }}>
          <TextInput value={query} placeholder="Search" leftSectionPointerEvents="none" leftSection={<IconSearch style={{ width: rem(20), height: rem(20) }} stroke={1.5} />} onChange={(event) => setQuery(event.currentTarget.value)} />
          {(notifySuccess) && (<Notification icon={checkIcon} color="teal" title="Import Success!" mt="md" withCloseButton="false" style={{ opacity: `${importSuccess ? '1' : '0'}`, transition: `opacity 0.5s ease-in-out` }}>
            New Students were successfully imported from file!
          </Notification>)}
          {(notifyError) && (<Notification icon={xIcon} color="red" title="Oops..." withCloseButton={false} style={{ opacity: `${importFail ? '1' : '0'}`, transition: `opacity 0.5s ease-in-out` }}>
            Something went wrong
          </Notification>)}
        </Group>
        <Space h="sm" />
        <Table.ScrollContainer minWidth={500}>
          <Table stickyHeader verticalSpacing="md" striped highlightOnHover withTableBorder >
            <Table.Thead>
              <Table.Tr>
                <Table.Th>Name</Table.Th>
                <Table.Th>Student ID</Table.Th>
                <Table.Th>Email Address</Table.Th>
                <Table.Th>Team</Table.Th>
                <Table.Th>Course</Table.Th>
                <Table.Th>Organization</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>{rows}</Table.Tbody>
          </Table>
        </Table.ScrollContainer>
      </AppShell.Main>)}
      {(active === 'Teams') && (
        <AppShell.Main>
          <Space h="md" />
          <DashboardFilterSort onApply={setFilterSortOptions} />
          <Group justify="space-between">
            <Title>Teams</Title>
            <Modal
              opened={opened}
              onClose={modalClose}
              title={
                <div style={{ padding: "16px 0 0 0" }}>
                  <Title order={3}>Create a New Team</Title>
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
              {/* Step 1: Select or Add Organization */}
              {step === 1 && (
                <div>
                  <div style={{ padding: "0px 25px 25px 25px" }}>
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "0px 0px 16px 0px" }}>
                      <Text size="xl" style={{ color: "rgb(115, 115, 115)" }}>Select an Organization</Text>
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
                    <Select
                      id="org-select"
                      label="Choose an existing organization"
                      placeholder="Select organization"
                      data={organizations.map((org) => ({ value: org.id, label: org.name }))}
                      value={teamData.organization_id}
                      onChange={(value) => { updateTeamData("organization_id", value); updateTeamData("new_org_name", "") }}
                    />
                    <Space h="sm" />
                    <TextInput
                      label="Or add a new organization"
                      placeholder="New Organization Name"
                      value={teamData.new_org_name}
                      onChange={(event) => {
                        const newOrgName = event.currentTarget.value;
                        updateTeamData("new_org_name", newOrgName);
                        if (newOrgName) {
                          updateTeamData("organization_id", null);
                        }
                      }}
                    />
                  </div>
                  <Space h="md" />
                  <div style={{
                    backgroundColor: "#f8f9fa",
                    borderTop: "1px solid #e3e3e3",
                    padding: "16px",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center"
                  }}>
                    <Button variant="outline" onClick={modalClose}>Cancel</Button>
                    <Button onClick={handleNextStep} disabled={!teamData.organization_id && !teamData.new_org_name}>
                      Next
                    </Button>
                  </div>
                </div>
              )}

              {/* Step 2: Select or Add Course */}
              {step === 2 && (
                <div>
                  <div style={{ padding: "0px 25px 25px 25px" }}>
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "0px 0px 16px 0px" }}>
                      <Text size="xl" style={{ color: "rgb(115, 115, 115)" }}>Select a Course</Text>
                      <div style={{ display: "flex", justifyContent: "center" }}>
                        <img src="class-icon.svg" alt="Default Organization Icon"
                          style={{
                            display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center",
                            margin: 25, padding: 20, backgroundColor: "#fff", border: "none", borderRadius: 100,
                            boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1), 0 8px 16px rgba(0, 0, 0, 0.1)", boxSizing: "border-box"
                          }}
                        />
                      </div>
                    </div>
                    <Select
                      label="Choose an existing course"
                      placeholder="Select course"
                      data={courses.filter((course) => course.organization_id === teamData.organization_id).map((course) => ({ value: course.id, label: course.name }))}
                      value={teamData.course_id}
                      onChange={(value) => { updateTeamData("course_id", value); updateTeamData("new_course_name", ""); }}
                    />

                    <TextInput
                      label="Or add a new course"
                      placeholder="New Course Name"
                      value={teamData.new_course_name}
                      onChange={(event) => { updateTeamData("new_course_name", event.currentTarget.value); updateTeamData("course_id", null); }}
                    />
                  </div>
                  <Space h="md" />
                  <div style={{
                    backgroundColor: "#f8f9fa",
                    borderTop: "1px solid #e3e3e3",
                    padding: "16px",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center"
                  }}>
                    <Button variant="outline" onClick={modalClose}>Cancel</Button>
                    <Button onClick={handleNextStep}>Next</Button>
                  </div>
                </div>
              )}

              {/* Step 3: Enter Team Details */}
              {step === 3 && (
                <div>
                  <div style={{ padding: "0px 25px 25px 25px" }}>
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "0px 0px 16px 0px" }}>
                      <Text size="xl" style={{ color: "rgb(115, 115, 115)" }}>Enter Team Details</Text>
                      <div style={{ display: "flex", justifyContent: "center" }}>
                        <img src="team-icon.svg" alt="Default Organization Icon"
                          style={{
                            display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center",
                            margin: 25, padding: 20, backgroundColor: "#fff", border: "none", borderRadius: 100,
                            boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1), 0 8px 16px rgba(0, 0, 0, 0.1)", boxSizing: "border-box"
                          }}
                        />
                      </div>
                    </div>
                    <TextInput
                      label="Team Name"
                      placeholder="Team Name"
                      value={teamData.team_name}
                      onChange={(event) => updateTeamData("team_name", event.currentTarget.value)}
                    />
                    <Space h="sm" />
                    <NumberInput
                      label="Max Team Size"
                      placeholder="Max Size"
                      value={teamData.max_size}
                      onChange={(value) => updateTeamData("max_size", value)}
                      min={1}
                      max={30}
                    />
                  </div>
                  <Space h="md" />
                  <div style={{
                    backgroundColor: "#f8f9fa",
                    borderTop: "1px solid #e3e3e3",
                    padding: "16px",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center"
                  }}>
                    <Button variant="outline" onClick={modalClose}>Cancel</Button>
                    <Button onClick={handleNextStep} disabled={!teamData.team_name || teamData.max_size < 1}>Next</Button>
                  </div>
                </div>
              )}

              {/* Step 4: Add Students to the Team */}
              {step === 4 && (
                <div>
                  <div style={{ padding: "0px 25px 25px 25px" }}>
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "0px 0px 16px 0px" }}>
                      <Text size="xl" style={{ color: "rgb(115, 115, 115)" }}>Add Students to the Team</Text>
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
                    <MultiSelect
                      label="Select Students"
                      placeholder="Select students"
                      data={students.filter(student => student.organization_id === teamData.organization_id && !memberships.some(membership => membership.student_id === student.id)).map(student => ({ value: student.id, label: student.name }))}
                      value={teamData.selected_students}
                      onChange={(value) => {
                        if (value.length <= teamData.max_size) {
                          updateTeamData("selected_students", value);
                          setMaxSizeError("");
                        } else {
                          setMaxSizeError("Maximum allotted size exceeded");
                        }
                      }}
                      multiple
                    />
                    {maxSizeError && (
                      <><Space h="sm" /><Alert variant="light" color="red" title="Max Size Exceeded">{maxSizeError}</Alert></>
                    )}
                  </div>
                  <Space h="md" />
                  <div style={{
                    backgroundColor: "#f8f9fa",
                    borderTop: "1px solid #e3e3e3",
                    padding: "16px",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center"
                  }}>
                    <Button variant="outline" onClick={modalClose}>Cancel</Button>
                    <Button onClick={handleSubmit2} disabled={!teamData.selected_students.length || teamData.selected_students.length > teamData.max_size}>
                      Add Students and Finish
                    </Button>
                  </div>
                </div>
              )}
            </Modal>
            <div>
              <Menu>
                <Menu.Target>
                  <Button>Add a New Team</Button>
                </Menu.Target>
                <Menu.Dropdown>
                  <Menu.Item
                    onClick={open}
                    leftSection={icon[0]}
                  >
                    Create New Team
                  </Menu.Item>
                  <Menu.Item
                    onClick={handleFileInputClick}
                    leftSection={icon[1]}
                  >
                    Import From File
                  </Menu.Item>
                </Menu.Dropdown>
              </Menu>
              <FileInput
                ref={fileInputRef}
                style={{ display: 'none' }}
                onChange={handleFileUpload}
                accept="text/csv"
              />
            </div>
          </Group>
          <Space h="xl" />
          <Group justify="space-between">
            <TextInput
              value={query}
              placeholder="Search"
              leftSectionPointerEvents="none"
              leftSection={<IconSearch style={{ width: rem(16), height: rem(16) }} stroke={1.5} />}
              onChange={(event) => setQuery(event.currentTarget.value)}
            />
          </Group>
          <Space h="lg" />
          <Table.ScrollContainer minWidth={500}>
            <Table stickyHeader verticalSpacing="md" striped highlightOnHover withTableBorder>
              <Table.Thead>
                <Table.Tr>
                  <Table.Th>Team</Table.Th>
                  <Table.Th>Members</Table.Th>
                  <Table.Th>Maximum Size</Table.Th>
                  <Table.Th>Course</Table.Th>
                  <Table.Th>Organization</Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>{rows2}</Table.Tbody>
            </Table>
          </Table.ScrollContainer>
        </AppShell.Main>
      )}

      {(active === 'Feedbacks') && (
        <>
          <InstructorDashboardFeedbacks organizations={organizations} org={org} courses={courses} teams={teams} students={students} memberships={memberships} email={email} setLoggedIn={setLoggedIn}/>
        </>
      )}


    </AppShell>
  );
};

export default InstructorDashboard;