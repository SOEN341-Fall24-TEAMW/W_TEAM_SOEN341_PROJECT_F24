import React from 'react';
import { useNavigate, useLocation } from "react-router-dom";
import { Select, AppShell } from '@mantine/core';
import { IconSchool } from '@tabler/icons-react';
import PropTypes from 'prop-types';

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

Header.propTypes = {
    loggedIn: PropTypes.bool.isRequired,              // loggedIn should be a boolean
    setLoggedIn: PropTypes.func.isRequired,           // setLoggedIn should be a function
    role: PropTypes.string.isRequired,                // role should be a string
    setRole: PropTypes.func.isRequired,               // setRole should be a function
    org: PropTypes.string.isRequired,                 // org should be a string
    setOrg: PropTypes.func.isRequired,                // setOrg should be a function
    instructorOrganizations: PropTypes.array.isRequired, // instructorOrganizations should be an array
  };

export default Header;
