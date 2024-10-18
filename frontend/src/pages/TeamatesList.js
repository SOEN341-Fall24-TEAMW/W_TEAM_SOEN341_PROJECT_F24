import React, { useEffect, useState } from 'react';
import axios from 'axios';

const TeammatesList = () => {
    const [teammates, setTeammates] = useState([]);

    useEffect(() => {
        const fetchTeammates = async () => {
            try {
                const response = await axios.get('/teams', {
                    headers: { 'jwt-token': localStorage.getItem('jwt-token') } // Assuming you store the token in local storage
                });
                setTeammates(response.data.teams); // Adjust based on your backend response structure
            } catch (error) {
                console.error('Error fetching teammates:', error);
            }
        };

        fetchTeammates();
    }, []);

    return (
        <div>
            <h2>Teammates</h2>
            <ul>
                {teammates.map((teammate, index) => (
                    <li key={index}>{teammate.name}</li> // Adjust based on the teammate data structure
                ))}
            </ul>
        </div>
    );
};

export default TeammatesList;
