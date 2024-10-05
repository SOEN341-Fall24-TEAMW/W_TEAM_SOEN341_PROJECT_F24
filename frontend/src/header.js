import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from "react-router-dom";
import { Select } from '@mantine/core';

const Header = ({ loggedIn, setLoggedIn, course, setCourse }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const [enlistedCourses, setElistedCourses] = useState([]);

    useEffect(() => {
        // Retrieve the JWT token from localStorage using the key 'jwt-token'
        const token = localStorage.getItem('jwt-token'); // Ensure 'jwt-token' matches the backend key
    
        if (!token) {
          console.error("JWT token not found. Please log in again.");
          return;
        }
    
        // Send a request to the backend with the JWT token in the headers
        fetch('http://localhost:3080/courses', {
          headers: {
            'jwt-token': token, // Use 'jwt-token' as the header key to send the token
          },
        })
          .then((response) => response.json())
          .then((data) => {
            console.log(data.courses);
            if (data.message === 'success') {
              setElistedCourses(data.courses); // Set the courses array to options state
            } else {
              console.error('Failed to fetch options:', data.message);
            }
          })
          .catch((error) => console.error('Error fetching options:', error));
      }, []);

      return (
        <header className="header">
            
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
                    placeholder="Select a Course"
                    data={enlistedCourses ? enlistedCourses.map(course =>({ value : course.name })) : []}
                    value={ course ? course : [] }
                    onChange={(value) => setCourse(value)} />
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
        </header>
    );
};

export default Header;