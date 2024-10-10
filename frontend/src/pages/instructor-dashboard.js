import React, { useState } from "react";
import { NavLink, AppShell, Table, Group, Space, Modal, Button, Title, TextInput, rem, Select, NumberInput, MultiSelect } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IconUsers, IconUsersGroup, IconSettings, IconSearch } from '@tabler/icons-react';
import { v4 as uuidv4 } from 'uuid';
import './styles.css';

const InstructorDashboard = ({ organizations, org, courses, teams, students, memberships, email }) => {

  const [active, setActive] = useState('Students');
  const [query, setQuery] = useState('');
  const [opened, { open, close }] = useDisclosure(false);
  const [step, setStep] = useState(1);

  // Single state object to hold all the form data
  const [formData, setFormData] = useState({
    organization_id: "",
    new_org_name: "",
    course_id: "",
    new_course_name: "",
    team_name: "",
    max_size: 5,
    instructor_id: email,
    selected_students: [],
  });

  // Handler to reset the formData and step
  const resetForm = () => {
    setFormData({
      organization_id: "",
      new_org_name: "",
      course_id: "",
      new_course_name: "",
      team_name: "",
      max_size: 5,
      instructor_id: email,
      selected_students: [],
    });
    setStep(1);
  };

  // Handler for moving to the next step
  const handleNextStep = () => {
    setStep(step + 1);
  };

  // Handler for updating formData
  const updateFormData = (key, value) => {
    setFormData((prevState) => ({
      ...prevState,
      [key]: value,
    }));
  };

  // Handler for closing form
  const modalClose = () => {
    resetForm();
    close();
  };

  // Handler for submitting the form data
  const handleSubmit = async () => {
    // Prepare the data to be submitted in one go
    const dataToSubmit = {
      ...formData,
      organization_id: formData.organization_id || uuidv4(), // Generate new ID if new org is created
      course_id: formData.course_id || uuidv4(), // Generate new ID if new course is created
    };

    try {
      // Single API call to submit all the data at once
      await fetch("http://localhost:3080/create-team", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dataToSubmit),
      });

      // After successful submission, close modal and reset form
      close();
      resetForm();
    } catch (error) {
      console.error("Error creating team:", error);
    }
  };

  const tabs = [
    { label: 'Students', icon: IconUsers },
    { label: 'Teams', icon: IconUsersGroup },
    { label: 'Admin', icon: IconSettings }
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
    ? (students || [])
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
        <Group justify="space-between">
          <Title>Students</Title>
          <Modal align="center" opened={opened} onClose={close} title="Authentication" centered>

          </Modal>

          <Button onClick={open}>Add New User</Button>
        </Group>
        <Space h="xl" />
        <Group justify="space-between">
          <TextInput value={query} placeholder="Search" leftSectionPointerEvents="none" leftSection={<IconSearch style={{ width: rem(16), height: rem(16) }} stroke={1.5} />} onChange={(event) => setQuery(event.currentTarget.value)} />
          {/*<Button variant="default">Second</Button>
              <Button variant="default">Third</Button>*/}
        </Group>
        <Space h="lg" />
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
      {(active === 'Teams') && (<AppShell.Main>
        <Space h="md" />
        <Group justify="space-between">
          <Title>Teams</Title>
          <Modal opened={opened} onClose={modalClose} title={<Title order={3}>Create a New Team</Title>} centered>
            {/* Step 1: Select or Add Organization */}
            {step === 1 && (
              <>
                <Title order={4}>Select an Organization</Title>
                <Select
                  label="Choose an existing organization"
                  placeholder="Select organization"
                  data={organizations.map((org) => ({ value: org.id, label: org.name }))}
                  value={formData.organization_id}
                  onChange={(value) => updateFormData("organization_id", value)}
                />
                <Space h="sm" />
                <TextInput
                  label="Or add a new organization"
                  placeholder="New Organization Name"
                  value={formData.new_org_name}
                  onChange={(event) => updateFormData("new_org_name", event.currentTarget.value)}
                />
                <Space h="md" />
                <Group justify="flex-end">
                  <Button
                    onClick={handleNextStep}
                    disabled={!formData.organization_id && !formData.new_org_name}
                  >
                    Next
                  </Button>
                </Group>
              </>
            )}

            {/* Step 2: Select or Add Course */}
            {step === 2 && (
              <>
                <Title order={4}>Select a Course</Title>
                <Select
                  label="Choose an existing course"
                  placeholder="Select course"
                  data={courses
                    .filter((course) => course.organization_id === formData.organization_id)
                    .map((course) => ({ value: course.id, label: course.name }))}
                  value={formData.course_id}
                  onChange={(value) => updateFormData("course_id", value)}
                />
                <Space h="sm" />
                <TextInput
                  label="Or add a new course"
                  placeholder="New Course Name"
                  value={formData.new_course_name}
                  onChange={(event) => updateFormData("new_course_name", event.currentTarget.value)}
                />
                <Space h="md" />
                <Group justify="flex-end">
                  <Button
                    onClick={handleNextStep}
                    disabled={!formData.course_id && !formData.new_course_name}
                  >
                    Next
                  </Button>
                </Group>
              </>
            )}

            {/* Step 3: Enter Team Details */}
            {step === 3 && (
              <>
                <Title order={4}>Enter Team Details</Title>
                <TextInput
                  label="Team Name"
                  placeholder="Team Name"
                  value={formData.team_name}
                  onChange={(event) => updateFormData("team_name", event.currentTarget.value)}
                />
                <Space h="sm" />
                <NumberInput
                  label="Max Team Size"
                  placeholder="Max Size"
                  value={formData.max_size}
                  onChange={(value) => updateFormData("max_size", value)}
                  min={1}
                  max={30}
                />
                <Space h="md" />
                <Group justify="flex-end">
                  <Button onClick={handleNextStep} disabled={!formData.team_name || formData.max_size < 1}>
                    Next
                  </Button>
                </Group>
              </>
            )}

            {/* Step 4: Add Students to the Team */}
            {step === 4 && (
              <>
                <Title order={4}>Add Students to the Team</Title>
                <MultiSelect
                  label="Select Students"
                  placeholder="Select students"
                  data={students.map((student) => ({ value: student.id, label: student.name }))}
                  value={formData.selected_students}
                  onChange={(value) => updateFormData("selected_students", value)}
                  multiple
                />
                <Space h="md" />
                <Group justify="flex-end">
                  <Button onClick={handleSubmit} disabled={formData.selected_students.length === 0}>
                    Add Students and Finish
                  </Button>
                </Group>
              </>
            )}
          </Modal>
          <Button onClick={open}>Add a New Team</Button>
        </Group>
        <Space h="xl" />
        <Group justify="space-between">
          <TextInput value={query} placeholder="Search" leftSectionPointerEvents="none" leftSection={<IconSearch style={{ width: rem(16), height: rem(16) }} stroke={1.5} />} onChange={(event) => setQuery(event.currentTarget.value)} />
          {/*<Button variant="default">Second</Button>
              <Button variant="default">Third</Button>*/}
        </Group>
        <Space h="lg" />
        <Table.ScrollContainer minWidth={500}>
          <Table stickyHeader verticalSpacing="md" striped highlightOnHover withTableBorder >
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
      </AppShell.Main>)}

    </AppShell>
  );
};

export default InstructorDashboard;
