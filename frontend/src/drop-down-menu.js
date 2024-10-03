import React, { useEffect, useState } from 'react';

const DropdownMenu = ({onChange}) => {
  const [options, setOptions] = useState([]); // State to hold the options
  const [selectedOption, setSelectedOption] = useState(""); // State to track selected value

  // Fetch options from backend
  useEffect(() => {
    // Retrieve the JWT token from localStorage using the key 'jwt-token'
    const token = localStorage.getItem('jwt-token'); // Ensure 'jwt-token' matches the backend key

    if (!token) {
      console.error("JWT token not found. Please log in again.");
      return;
    }

    // Send a request to the backend with the JWT token in the headers
    fetch('http://localhost:3080/teams', {
      headers: {
        'jwt-token': token, // Use 'jwt-token' as the header key to send the token
      },
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.message === 'success') {
          setOptions(data.teams); // Set the teams array to options state
        } else {
          console.error('Failed to fetch options:', data.message);
        }
      })
      .catch((error) => console.error('Error fetching options:', error));
  }, []); // Empty dependency array means this effect runs only once on component mount

  return (
    <div>
      <label htmlFor="dynamicDropdown">Select a Team: </label>
      <select
        id="dynamicDropdown"
        value={selectedOption}
        onChange={(e) => {setSelectedOption(e.target.value); onChange(e.target.value)}}
        style={{ overflowY: 'scroll', height: '25px', maxWidth: 'fit-content' }} // Adds scroll bar to the dropdown
      >
        {/* Dynamically populate options */}
        {options.map((team) => (
          <option key={team.id} value={team.name}>
            {team.name}
          </option>
        ))}
      </select>
    </div>
  );
};

export default DropdownMenu;
