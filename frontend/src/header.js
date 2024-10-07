import React from 'react';
import { useNavigate, useLocation } from "react-router-dom";
import { Select, AppShell } from '@mantine/core';
import { IconSchool } from '@tabler/icons-react';

const Header = ({ loggedIn, setLoggedIn, course, setCourse, enlistedCourses }) => {
    const navigate = useNavigate();
    const location = useLocation();


    return (
        <AppShell header={{ height : 60 }}>
            <AppShell.Header zIndex={200} className='header'>
                <div>
                    {!(loggedIn) && (
                        <img src="/concordia-logo.svg" alt="Concordia Logo" id='logo'/>
                    )}
                    {!(loggedIn) && (
                        <img src="/50th-anniversary.svg" alt="Concordia Celebrating 50th  Anniversary" id='logo'/>
                    )}
                    {!(loggedIn) && (
                        <img src="/gina-cody-logo.png" alt="Gina Cody Logo" id='logo'/>
                    )}
                    {loggedIn && (
                        <img src="/team-logo.svg" alt="Team Logo" id='teamLogo' />
                    )}
                    {loggedIn && (
                        <Select
                        placeholder="Select School"
                        leftSection={<IconSchool size="1rem" stroke={1.5} />}
                        data={enlistedCourses ? enlistedCourses.map(course =>({ value : course.organization })) : []}
                        value={ course ? course : [] }
                        onChange={(value) => setCourse(value)}
                        clearable />
                    )}
                </div>
                <div className='header2'>
                    {!loggedIn && (
                        <input type="button" id='sessionManagement' onClick={() => navigate('/create-new-account')} value="Create Account" />
                    )}

                    {location.pathname !== '/login' && !loggedIn && (
                        <input type="button" id='sessionManagement' value={ "Login" } onClick={ () => navigate("/login")} />
                    )}
                    
                    {loggedIn && (
                        <input type="button" id='sessionManagement' value={ "Logout" } onClick={ () => {
                            localStorage.removeItem("user");
                            setLoggedIn(false);
                            navigate("/login");}
                        } />
                    )}
                </div>
            </AppShell.Header>
        </AppShell>
    );
};

export default Header;