import React, { useState } from "react";
import { NavLink, AppShell, Table, Group, Space, Modal, Button, Title, TextInput, rem, Input, InputBase, Combobox, useCombobox } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IconUsers, IconUsersGroup, IconSettings, IconSearch } from '@tabler/icons-react';
import './styles.css';

const InstructorDashboard = ({ course, enlistedCourses }) => {

    const [active, setActive] = useState('Students');
    const [query, setQuery] = useState('');
    const [opened, { open, close }] = useDisclosure(false);
    const [value, setValue] = useState('');

    const combobox = useCombobox({
      onDropdownClose: () => combobox.resetSelectedOption(),
    });

    const groceries = ['🍎 Apples', '🍌 Bananas', '🥦 Broccoli', '🥕 Carrots', '🍫 Chocolate'];

    const options = groceries.map((item) => (
      <Combobox.Option value={item} key={item}>
        {item}
      </Combobox.Option>
    ));

    const tabs = [
        { label: 'Students', icon: IconUsers },
        { label: 'Teams', icon: IconUsersGroup },
        { label: 'Admin', icon: IconSettings }
    ];

    const html = <p>Create a New Team</p>

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

    const rows2 = enlistedCourses
    .filter((courses) => !(course) || courses.organization === course)
    .flatMap((filteredCourse) =>
        filteredCourse.teams.flatMap((team) =>
            team.students.filter((student) =>
              // Check if the student's name or ID includes the search query (case insensitive)
              student.name.toLowerCase().includes(query.toLowerCase()) ||
              student.studentId.toString().includes(query)
            ).map((student) => (
                <Table.Tr key={`${team.id}-${student.studentId}`}>
                    <Table.Td>{student.name}</Table.Td>
                    <Table.Td>{student.studentId}</Table.Td>
                    <Table.Td>{student.email}</Table.Td>
                    <Table.Td>{team.name}</Table.Td>
                    <Table.Td>{filteredCourse.name}</Table.Td>
                    <Table.Td>{filteredCourse.organization}</Table.Td>
                </Table.Tr>
            ))
        )
    );

    return (
        <AppShell navbar={{ width : 250 }}>
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
                <TextInput value={query} placeholder="Search" leftSectionPointerEvents="none" leftSection= {<IconSearch style={{ width: rem(16), height: rem(16) }} stroke={1.5} />} onChange={(event) => setQuery(event.currentTarget.value)} />
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
                      <Table.Tbody>{rows2}</Table.Tbody>
                  </Table>
              </Table.ScrollContainer>
            </AppShell.Main>)}
            {(active === 'Teams') && (<AppShell.Main>
            <Space h="md" />
            <Group justify="space-between">
                <Title>Teams</Title>
                <Modal align opened={opened} onClose={close} title={<Title order={3}>Create a New Team</Title>} centered>
                  <Title order>Teams</Title>
                  <TextInput variant="filled" label="Team Name" placeholder="Team Name" />
                  <Space h="sm" />
                  <Combobox
                    store={combobox}
                    onOptionSubmit={(val) => {
                      setValue(val);
                      combobox.closeDropdown();
                    }}
                  >
                    <Combobox.Target>
                      <InputBase
                        component="button"
                        type="button"
                        pointer
                        rightSection={<Combobox.Chevron />}
                        rightSectionPointerEvents="none"
                        onClick={() => combobox.toggleDropdown()}
                      >
                        {value || <Input.Placeholder>Pick value</Input.Placeholder>}
                      </InputBase>
                    </Combobox.Target>

                    <Combobox.Dropdown>
                      <Combobox.Options>{options}</Combobox.Options>
                    </Combobox.Dropdown>
                  </Combobox>
                </Modal>

                <Button onClick={open}>Add a New Team</Button>
              </Group>
              <Space h="xl" />
              <Group justify="space-between">
                <TextInput value={query} placeholder="Search" leftSectionPointerEvents="none" leftSection= {<IconSearch style={{ width: rem(16), height: rem(16) }} stroke={1.5} />} onChange={(event) => setQuery(event.currentTarget.value)} />
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
                      <Table.Tbody>{rows2}</Table.Tbody>
                  </Table>
              </Table.ScrollContainer>
            </AppShell.Main>)}

        </AppShell>
    );  
};

export default InstructorDashboard;
