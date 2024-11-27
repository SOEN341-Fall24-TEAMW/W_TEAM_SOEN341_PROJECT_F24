import React, { useEffect, useState } from 'react';
import { Button, Title, Table, Center, Text, Modal } from '@mantine/core';
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';


const TeammatesList = ({ teams, memberships, students, email, selectedTeam }) => {
    const navigate = useNavigate();
    const teamId = selectedTeam.id;

    // Determine the current user's ID from the email
    const currentUserId = students.find(student => student.email.trim().toLowerCase() === email.trim().toLowerCase())?.id;
    console.log("Current User ID:", currentUserId); // Check the value here
    console.log("Current Peers: ", students);
    console.log("Current Teams: ", teams);
    console.log("Current memberships: ", memberships);
    console.log("Current teamID: ", teamId);


    // State to hold the feedback status for each teammate
    const [feedbackStatus, setFeedbackStatus] = useState({});

    // Function to fetch feedback status from the API
    const fetchFeedbackStatus = async (evaluatorId, evaluateeId, teamId) => {
        const response = await fetch(`/peer-evaluations/check?evaluator_id=${evaluatorId}&evaluatee_id=${evaluateeId}&team_id=${teamId}`);
        const data = await response.json();
        return data.hasFeedback; // Returns true or false
    };

    // Filter teammates based on memberships and teams
    const teammates = students
    .filter(student => {
        // Check if there is any membership where student_id matches and team_id matches the selected team
        return memberships.some(membership => 
            membership.team_id === teamId
        );
      })
    .map(student => ({
        ...student,
        hasSubmittedFeedback: feedbackStatus[student.id] || false, // Add feedback status directly
    }));

    console.log("filteredTeammates: ", teammates);

    // Fetch feedback statuses for all teammates
    useEffect(() => {
        const fetchAllFeedbackStatus = async () => {
            if (!currentUserId) {
                console.error("Current user ID not found.");
                return;
            }

            const statusPromises = memberships
            .filter(membership => String(membership.team_id) === String(teamId))
            .map(async membership => {
                    const teammate = students.find(student => student.id === membership.student_id);
                    if (!teammate) {
                        console.warn(`Teammate with ID ${membership.student_id} not found.`);
                        return null; // Skip this iteration
                    }

                    try {
                        const hasFeedback = await fetchFeedbackStatus(currentUserId, teammate.id, teamId);
                        return {
                            id: teammate.id,
                            hasFeedback,
                        };
                    } catch (error) {
                        console.error(`Error fetching feedback status for ${teammate.id}:`, error);
                        return {
                            id: teammate.id,
                            hasFeedback: false, // Default to false on error
                        };
                    }
                });

            // Wait for all fetch calls to complete
            const results = await Promise.all(statusPromises);

            // Filter out null results from skipped teammates
            const feedbackMap = results
                .filter(result => result) // Remove nulls
                .reduce((acc, curr) => {
                    acc[curr.id] = curr.hasFeedback;
                    return acc;
                }, {});

            setFeedbackStatus(feedbackMap);
        };

        fetchAllFeedbackStatus();
    }, [memberships, students, currentUserId, teamId]);


    // State to control the popup visibility
    const [showPopup, setShowPopup] = useState(false);

    // Check if all teammates have submitted feedback
    useEffect(() => {
        const allRated = teammates.every(teammate => teammate.hasSubmittedFeedback);
        if (allRated && teammates.length > 0) {
            setShowPopup(true);
        }
    }, [teammates]);

    return (
        <div style={{ paddingTop: '60px' }}>
            <Title order={2}>Teammates</Title>

            {/* Confirmation Popup */}
            <Modal
                opened={showPopup}
                onClose={() => setShowPopup(false)}
                title="Feedback Complete"
            >
                <Text size="lg">All teammates have been rated successfully!</Text>
            </Modal>


            {teammates.length === 0 ? (
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
                        {teammates.map((teammate, index) => (
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
                                        onClick={() => {
                                            // Navigate to PeerEvaluationIntro and pass the IDs via state
                                            navigate('/PeerEvaluationIntro', {
                                                state: {
                                                    evaluatorId: currentUserId,
                                                    evaluateeId: teammate.id,
                                                    teamId
                                                }
                                            });
                                        }}
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

TeammatesList.propTypes = {
    teams: PropTypes.array.isRequired,
    memberships: PropTypes.array.isRequired,
    students: PropTypes.array.isRequired,
    email: PropTypes.string.isRequired,
    selectedTeam: PropTypes.shape({
      id: PropTypes.string.isRequired,
    }).isRequired,
  };
  

export default TeammatesList;



