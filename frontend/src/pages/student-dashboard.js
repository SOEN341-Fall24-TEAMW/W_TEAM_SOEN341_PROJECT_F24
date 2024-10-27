import React, { useState } from 'react';
import { NavLink, AppShell, Table, Group, Space, Button, Title, TextInput, rem } from '@mantine/core';
import { IconUsers, IconClipboardList, IconMessageCircle, IconSearch } from '@tabler/icons-react';
import { NavbarStudentDashboard } from './NavbarStudentDashboard.js';
import PeerEvaluationForm from './peerEvaluationForm.js';
import PeerFeedback from './peerFeedback.js';
import './styles.css';


const StudentDashboard = ({ students, email, teams, courses, feedbackData }) => {
  const [active, setActive] = useState('Students'); 
  const [query, setQuery] = useState(''); 
  const [setShowForm] = useState(false);

  const tabs = [
    { label: 'Students', icon: IconUsers },
    { label: 'Evaluate Peers', icon: IconClipboardList },
    { label: 'Peer Feedback', icon: IconMessageCircle }
  ];

  const navBarData = tabs.map((data) => (
    <NavLink
      key={data.label}
      leftSection={<data.icon size='1rem' stroke='1.5' />}
      label={data.label}
      active={data.label === active}
      variant="light"
      component="button"
      onClick={() => setActive(data.label)}
    />
  ));

  // Rows for displaying student information
  const studentRows = students
    ? students
        .filter((student) => student.name.toLowerCase().includes(query.toLowerCase()) || student.id.toString().includes(query.toLowerCase()))
        .map((student) => (
          <Table.Tr key={student.id}>
            <Table.Td>{student.name || 'No name'}</Table.Td>
            <Table.Td>{student.id || 'No ID'}</Table.Td>
            <Table.Td>{student.email || 'No email'}</Table.Td>
          </Table.Tr>
        ))
    : [];



  return (
    <AppShell navbar={{ width: 250 }}>
      <AppShell.Navbar>{navBarData}</AppShell.Navbar>

      {(active === 'Students') && (
        <AppShell.Main>
          <Space h="md" />
          <Group justify="space-between">
            <Title>Students</Title>
            <Button>Add New User</Button>
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
                  <Table.Th>Name</Table.Th>
                  <Table.Th>Student ID</Table.Th>
                  <Table.Th>Email Address</Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>{studentRows}</Table.Tbody>
            </Table>
          </Table.ScrollContainer>
        </AppShell.Main>
      )}

      {(active === 'Evaluate Peers') && (
        <AppShell.Main>
          <Space h="md" />
          <Title>Peer Evaluation</Title>
          
          {/* Introduction Paragraph with Button */}
          <PeerEvaluationIntro setShowForm={setShowForm} /> {/* This will render the intro text and button */}
          
          <Space h="md" />
        </AppShell.Main>
      )}

      {(active === 'Peer Feedback') && (
        <AppShell.Main>
          <Space h="md" />
          <Title>Peer Feedback</Title>
          <PeerFeedback feedbackData={feedbackData} /> {/* Pass feedback data */}
        </AppShell.Main>
      )}
    </AppShell>
  );
};

export default StudentDashboard;
