import React, { useEffect, useState } from 'react';
import { Button, Title, List, Table, Center, Text } from '@mantine/core';
import { useNavigate, useParams } from 'react-router-dom';

import PeerEvaluationIntro from './peerEvaluationIntro.js';


const TeammatesList = ({ teams, memberships, students, email }) => {
    const navigate = useNavigate();
    const { teamId } = useParams(); // Extract teamId from URL parameters

    // Determine the current user's ID from the email
    const currentUserId = students.find(student => student.email === email)?.id;


    // Filter teammates based on memberships and teams, or however the data is structured.
    const filteredTeammates = memberships
        .filter(membership => membership.team_id === teamId) 
        .map(membership => {
            const student = students.find(student => student.id === membership.student_id);
            return {
                ...student,
                hasSubmittedFeedback: membership.hasSubmittedFeedback,
            };
        });

    // Logging the received props to confirm the data passed down
    console.log("Teams:", teams);
    console.log("Memberships:", memberships);
    console.log("Students:", students);
    console.log("Filtered Teammates:", filteredTeammates); 



    return (
        <div style={{ paddingTop: '60px' }}>
            <Title order={2}>Teammates</Title>
            {filteredTeammates.length === 0 ? (
                <Center>
                    <Text size="lg" color="dimmed">No Members Found</Text>
                </Center>
            ) : (
                <Table>
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Feedback Submitted</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredTeammates.map((teammate, index) => (
                            <tr key={index}>
                            <td>
                                {teammate.name || 'Unknown Name'}
                                {teammate.id === currentUserId ? ' (YOU)' : ''}
                            </td>
                            <td>{teammate.hasSubmittedFeedback ? 'Yes' : 'No'}</td>
                                <td>
                                    <Button 
                                        variant="outline" 
                                        color="blue" 
                                        onClick={() => navigate('/PeerEvaluationIntro', { state: { student: teammate } })}
                                        >
                                        Rate Student
                                    </Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            )}
        </div>
    );
};

export default TeammatesList;



