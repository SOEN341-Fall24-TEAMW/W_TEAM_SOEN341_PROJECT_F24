import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { NavLink, AppShell, Table, Group, Space, Button, Title, TextInput, rem } from '@mantine/core';
import { IconUsers,IconUsersGroup, IconClipboardList, IconMessageCircle, IconSearch } from '@tabler/icons-react';

import { NavbarStudentDashboard } from './NavbarStudentDashboard.js';
import PeerFeedback from './peerFeedback.js';
import TeammatesList from './TeammatesList.js';

import './styles.css';


const StudentDashboard = ({ organizations, courses, memberships, students, email, teams, feedbackData }) => {
  const navigate = useNavigate();

  const [selectedTeam, setSelectedTeam] = useState(null);
  const [active, setActive] = useState('Students'); 
  const [query, setQuery] = useState(''); 
  const [setShowForm] = useState(false);
  const [filteredTeamsByQuery, setFilteredTeamsByQuery] = useState([]); // State for filtered teams
  


  const tabs = [
    { label: 'My Teams', icon: IconUsersGroup },
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

  const handleTeamClick = (team) => {
    setSelectedTeam(team);
  };
  
  useEffect(() => {
    if (teams && memberships && email) { // Ensure data is loaded
      console.log("Teams:", teams);
      console.log("Email:", email);
      
      // Get team IDs for teams the student is part of
      const studentTeamIds = memberships
        .filter(membership => membership.student_id === email) // Match by student email
        .map(membership => membership.team_id); // Extract team IDs
  
      console.log("Student Team IDs:", studentTeamIds);
  
      // Filter teams based on the student's memberships
      const filteredTeams = (teams || []).filter((team) => studentTeamIds.includes(team.id));
      console.log("Filtered Teams:", filteredTeams);
  
      // Further filter based on the search query
      const updatedFilteredTeamsByQuery = filteredTeams.filter((team) =>
        team.name.toLowerCase().includes(query.toLowerCase())
      );
      console.log("Filtered Teams by Query:", updatedFilteredTeamsByQuery);
  
      // Update the state with the filtered teams
      setFilteredTeamsByQuery(updatedFilteredTeamsByQuery);
    }
  }, [teams, memberships, email]); // Dependencies will trigger only on initial load when these values are available
  

  const rows = filteredTeamsByQuery.map((team) => {
    const team_course = (courses || []).find((course) => course.id === team.course_id);
    const course_names = team_course ? team_course.name : "No course";
    const organization_name = (organizations.find((organization) => organization.id === team_course?.organization_id) || {}).name || "Unknown organization";

    return (
      <Table.Tr key={team.id} onClick={() => handleTeamClick(team)}>
        <Table.Td>
          <Link to={`/teams/${team.id}`}>{team.name || "No name"}</Link>
        </Table.Td>
        <Table.Td>{team.max_size || "No max size"}</Table.Td>
        <Table.Td>{course_names || "No course"}</Table.Td>
        <Table.Td>{organization_name || "No organization"}</Table.Td>
      </Table.Tr>
    );
  });

    return (
        <AppShell navbar={{ width: 250 }}>
        <AppShell.Navbar>{navBarData}</AppShell.Navbar>
        
        {active === 'My Teams' && (
          <AppShell.Main>
            <Space h="md" />
            <Group justify="space-between">
              <Title>My Teams</Title>
            </Group>
            <Space h="md" />
            <TextInput 
              value={query} 
              placeholder="Search Teams" 
              onChange={(event) => setQuery(event.currentTarget.value)} 
            />
            <Space h="md" />
            <Table.ScrollContainer>
              <Table>
                <Table.Thead>
                  <Table.Tr>
                    <Table.Th>Team</Table.Th>
                    <Table.Th>Size</Table.Th>
                    <Table.Th>Course</Table.Th>
                    <Table.Th>Organization</Table.Th>
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody>{rows.length > 0 ? rows : <tr><td colSpan={4}>No teams found</td></tr>}</Table.Tbody>
                </Table>
            </Table.ScrollContainer>

            {selectedTeam && (
            <div>
              <button onClick={() => setSelectedTeam(null)} className="button3">Back to Team List</button>
              <TeammatesList teamId={selectedTeam.id}  />
            </div>
          )}

          </AppShell.Main>
        )}

        {active === 'Peer Feedback' && (
        <AppShell.Main>
          <Space h="md" />
          <Title>Peer Feedback</Title>
          <PeerFeedback feedbackData={feedbackData} />
        </AppShell.Main>
      )}
      </AppShell>
    );
  };
  
  export default StudentDashboard;
  
