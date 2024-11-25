import React from 'react';
import { useNavigate, useLocation } from "react-router-dom";
import { Select, AppShell } from '@mantine/core';
import { IconSchool } from '@tabler/icons-react';

const Header = ({ loggedIn, setLoggedIn, role, setRole, org, setOrg, instructorOrganizations }) => {
    const navigate = useNavigate();
    const location = useLocation();

    return (
        <AppShell header={{ height: 60 }}>
            <AppShell.Header zIndex={200} className="header">
                <div>
                    {!loggedIn && (location.pathname === "/login" || location.pathname === "/") && (
                        <>
                            <img src="/concordia-logo.svg" alt="Concordia Logo" id="logo" />
                            <img src="/50th-anniversary.svg" alt="Concordia Celebrating 50th Anniversary" id="logo" />
                            <img src="/gina-cody-logo.png" alt="Gina Cody Logo" id="logo" />
                        </>
                    )}
                    {loggedIn && <img src="/team-logo.svg" alt="Team Logo" id="teamLogo" />}
                    {loggedIn && role !== "student" && instructorOrganizations?.length > 0 && (
                        <Select
                            placeholder="Select School"
                            leftSection={<IconSchool size="1rem" stroke={1.5} />}
                            checkIconPosition="right"
                            data={instructorOrganizations.map((org) => org.name)}
                            value={org || null}
                            onChange={(value) => setOrg(value)}
                            allowDeselect={false}
                            searchable
                            comboboxProps={{ shadow: "md" }}
                        />
                    )}
                </div>
                <div className="header2">
                    {loggedIn && (
                        <input
                            type="button"
                            id="sessionManagement"
                            value="Logout"
                            onClick={() => {
                                localStorage.removeItem("user");
                                localStorage.removeItem("loggedIn");
                                localStorage.removeItem("role");
                                setLoggedIn(false);
                                setRole("");
                                setOrg("");
                                navigate("/login");
                            }}
                        />
                    )}
                </div>
            </AppShell.Header>
        </AppShell>
    );
};

export default Header;
