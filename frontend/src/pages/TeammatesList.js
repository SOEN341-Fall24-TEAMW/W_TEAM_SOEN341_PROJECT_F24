import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Button, Title, List, Center, Text } from '@mantine/core';
import { useNavigate } from 'react-router-dom';

import PeerEvaluationIntro from './peerEvaluationIntro.js';


const TeammatesList = ({ teamId }) => { // Accept teamId as a prop
    const [teammates, setTeammates] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchTeammates = async () => {
            try {
                const response = await axios.get(`/teams/${teamId}/members`, { // Adjust endpoint to fetch members
                    headers: { 'jwt-token': localStorage.getItem('jwt-token') } // Assuming you store the token in local storage
                });
                setTeammates(response.data.teammates || []); // Adjust based on your backend response structure
            } catch (error) {
                console.error('Error fetching teammates:', error);
            }
        };

        if (teamId) { // Fetch only if teamId is available
            fetchTeammates();
        }
    }, [teamId]); // Re-fetch when teamId changes

    return (
        <div style={{ paddingTop: '60px' }}> {/* Added padding to move content down */}
            <Title order={2}>Teammates</Title>
            {teammates.length === 0 ? ( // Check if teammates array is empty
                <Center>
                    <Text size="lg" color="dimmed">No Members Found</Text>
                </Center>
            ) : (
                <List spacing="sm" size="sm" center>
                    {teammates.map((teammate, index) => (
                        <List.Item key={index}>{teammate.name}</List.Item> 
                    ))}
                </List>
            )}
            <Center>
                <Button 
                    variant="filled" 
                    color="blue" 
                    style={{ marginTop: '20px' }} // Add margin for spacing
                    onClick={() => navigate('/PeerEvaluationIntro')} >Rate Teammates!
                </Button>
            </Center>
        </div>
    );
};

export default TeammatesList;



