import React, { useState } from "react";
import { NavLink, AppShell, Table, Group, TextInput, Title } from '@mantine/core';
import { IconUsersGroup, IconSettings } from '@tabler/icons-react';

import './styles.css';

const StudentDashboard = ({ organizations, courses, teams, email }) => {
    const [active, setActive] = useState('My Teams');
    const [query, setQuery] = useState('');
  
    const tabs = [
      { label: 'My Teams', icon: IconUsersGroup },
      { label: 'Courses', icon: IconSettings }
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
  
    const rows = (teams || [])
      .filter((team) => {
        // Logic to filter teams based on the student's memberships
        return team.members.includes(email); // Assuming you have a way to check memberships
      })
      .filter((team) => team.name.toLowerCase().includes(query.toLowerCase()))
      .map((team) => (
        <Table.Tr key={team.id}>
          <Table.Td>{team.name || "No name"}</Table.Td>
          {/* Add more team-related details as needed */}
        </Table.Tr>
      ));
  
    return (
      <AppShell navbar={{ width: 250 }}>
        <AppShell.Navbar>{navBarData}</AppShell.Navbar>
        {active === 'My Teams' && (
          <AppShell.Main>
            <Group justify="space-between">
              <Title>My Teams</Title>
            </Group>
            <TextInput value={query} placeholder="Search Teams" onChange={(event) => setQuery(event.currentTarget.value)} />
            <Table.ScrollContainer>
              <Table>
                <Table.Thead>
                  <Table.Tr>
                    <Table.Th>Team</Table.Th>
                    {/* Other headers */}
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody>{rows}</Table.Tbody>
              </Table>
            </Table.ScrollContainer>
          </AppShell.Main>
        )}
      </AppShell>
    );
  };
  
  export default StudentDashboard;
  