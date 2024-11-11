import React, { useState, useEffect } from "react";
import { AppShell, Table, Group, Space, Button, Title } from '@mantine/core';
import { useNavigate } from "react-router-dom";

import './styles.css';

const InstructorFeedbackTab = ({ organizations, org, courses, teams, students, memberships, setLoggedIn }) => {
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem('user'));

    const [selectedCourse, setSelectedCourse] = useState(null);
    const [selectedTeam, setSelectedTeam] = useState(null);
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [detailedView, setDetailedView] = useState(false);
    const [studentFeedbacks, setStudentFeedbacks] = useState([]);
    const [studentPeers, setStudentPeers] = useState(null);
    const [averageCooperation, setAverageCooperation] = useState(null);
    const [averageConceptualContribution, setAverageConceptualContribution] = useState(null);
    const [averagePracticalContribution, setAveragePracticalContribution] = useState(null);
    const [averageWorkEthic, setAverageWorkEthic] = useState(null);
    const [averageOverall, setAverageOverall] = useState(null);
    const [setSummary] = useState([]);

    useEffect(() => {
        if (!user || !user.token) {
            console.error("JWT token not found. Please log in again.");
            setLoggedIn(false);
            navigate('/');
        }
    }, [user, navigate, setLoggedIn]);

    // Get the organization ID for the selected organization name
    const orgObject = organizations.find(organization => organization.name === org);
    const org_id = orgObject ? orgObject.id : null;

    // Filter courses to only those belonging to the selected organization
    const course_rows = courses
        .filter(course => course.organization_id === org_id)
        .map((course) => (
            <Table.Tr key={course.id} onClick={() => { setSelectedCourse(course); setSelectedTeam(null); }} style={{ cursor : 'pointer' }}>
                <Table.Td>{course.name || "No name"}</Table.Td>
                <Table.Td>{course.instructor_id || "No instructor"}</Table.Td>
                <Table.Td>{course.organization_id || "No organization"}</Table.Td>
            </Table.Tr>
        ));

    // Filter teams to only those belonging to the selected course
    const team_rows = selectedCourse
        ? teams.filter(team => team.course_id === selectedCourse.id)
            .map((team) => (
                <Table.Tr key={team.id} onClick={() => setSelectedTeam(team)} style={{ cursor : 'pointer' }}>
                    <Table.Td>{team.name || "No name"}</Table.Td>
                    <Table.Td>{team.max_size || "No max size"}</Table.Td>
                    <Table.Td>{team.instructor_id || "No instructor"}</Table.Td>
                </Table.Tr>
            ))
        : null;

    // Filter students based on memberships for the selected team
    const student_rows = selectedTeam
        ? memberships
            .filter(membership => membership.team_id === selectedTeam.id)
            .map(membership => {
                const student = students.find(s => s.id === membership.student_id);
                return student ? (
                    <Table.Tr key={student.id} onClick={() => setSelectedStudent(student)} style={{ cursor : 'pointer' }}>
                        <Table.Td>{student.name || "No name"}</Table.Td>
                        <Table.Td>{student.email || "No email"}</Table.Td>
                        <Table.Td>{student.role || "No role"}</Table.Td>
                    </Table.Tr>
                ) : null;
            })
        : null;

    useEffect(() => {

        if (selectedStudent) {
            try {
                fetch('http://localhost:3080/get-student-feedback', {
                    method: "POST",
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ student: selectedStudent }),
                })
                    .then((response) => response.json())
                    .then((data) => {
                        if (data.message === 'success') {
                            setStudentFeedbacks(data.feedbacks);
                        } else {
                            console.error('Failed to fetch options:', data.message);
                        }
                    })
            } catch (error) {
                console.error('Error fetching options:', error);
            }
        }
    }, [selectedStudent]);

    useEffect(() => {

        if (detailedView) {
            try {
                fetch('http://localhost:3080/get-student-peers', {
                    method: "POST",
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(studentFeedbacks),
                })
                    .then((response) => response.json())
                    .then((data) => {
                        if (data.message === 'success') {
                            setStudentPeers(data.peers);
                        } else {
                            console.error('Failed to fetch peers:', data.message);
                        }
                    })
            } catch (error) {
                console.error('Error fetching peers: ', error);
            }
        }
    }, [detailedView]);

    useEffect(() => {
        try {
            if (selectedStudent) {

                const totalFeedbacks = studentFeedbacks.length;

                if (totalFeedbacks === 0) {
                    // Handle the case where there is no feedback
                    setAverageCooperation("0.00");
                    setAverageConceptualContribution("0.00");
                    setAveragePracticalContribution("0.00");
                    setAverageWorkEthic("0.00");
                    setAverageOverall("0.00");
                    setSummary({
                        name: selectedStudent.name,
                        id: selectedStudent.id,
                        cooperation: "0.00",
                        conceptualContribution: "0.00",
                        practicalContribution: "0.00",
                        workEthic: "0.00",
                        overallAverage: "0.00",
                        peers: studentPeers
                    });
                }

                // Calculate total scores for each category
                const totalCooperation = studentFeedbacks.map(fb => fb.cooperation).reduce((sum, feedback) => sum + +feedback, 0);
                const totalConceptContr = studentFeedbacks.map(fb => fb.conceptual_contribution).reduce((sum, feedback) => sum + +feedback, 0);
                const totalPractContr = studentFeedbacks.map(fb => fb.practical_contribution).reduce((sum, feedback) => sum + +feedback, 0);
                const totalWorkEthic = studentFeedbacks.map(fb => fb.work_ethic).reduce((sum, feedback) => sum + +feedback, 0);
                console.log('test', totalCooperation, totalFeedbacks, studentFeedbacks, totalConceptContr, totalPractContr, totalWorkEthic)
                const average_cooperation = (totalCooperation / totalFeedbacks).toFixed(2);
                const average_conceptual_contribution = (totalConceptContr / totalFeedbacks).toFixed(2);
                const average_practical_contribution = (totalPractContr / totalFeedbacks).toFixed(2);
                const average_work_ethic = (totalWorkEthic / totalFeedbacks).toFixed(2);

                // Calculate overall average from computed values
                const average_overall = (
                    (parseFloat(average_cooperation) +
                        parseFloat(average_conceptual_contribution) +
                        parseFloat(average_practical_contribution) +
                        parseFloat(average_work_ethic)) / 4
                ).toFixed(2);

                // Update state
                setAverageCooperation(average_cooperation);
                setAverageConceptualContribution(average_conceptual_contribution);
                setAveragePracticalContribution(average_practical_contribution);
                setAverageWorkEthic(average_work_ethic);
                setAverageOverall(average_overall);
                setSummary([{
                    name: selectedStudent.name,
                    id: selectedStudent.id,
                    cooperation: averageCooperation,
                    conceptualContribution: averageConceptualContribution,
                    practicalContribution: averagePracticalContribution,
                    workEthic: averageWorkEthic,
                    overallAverage: averageOverall,
                    peers: studentPeers
                }]);

            }
        } catch (error) {
            console.error('Error calculating averages: ', error)
        }
    }, [selectedStudent, studentFeedbacks]);

    const feedback_rows = studentPeers ? studentPeers.map(peer => {

        const cooperation_score = parseFloat(studentFeedbacks.filter(feedback => feedback.evaluator_id === peer.id).map(feedback => feedback.cooperation)).toFixed(2);
        const conceptual_score = parseFloat(studentFeedbacks.filter(feedback => feedback.evaluator_id === peer.id).map(feedback => feedback.conceptual_contribution)).toFixed(2);
        const practical_score = parseFloat(studentFeedbacks.filter(feedback => feedback.evaluator_id === peer.id).map(feedback => feedback.practical_contribution)).toFixed(2);
        const ethics_score = parseFloat(studentFeedbacks.filter(feedback => feedback.evaluator_id === peer.id).map(feedback => feedback.work_ethic)).toFixed(2);
        const average = ((+cooperation_score + +conceptual_score + +practical_score + +ethics_score) / 4).toFixed(2);

        return (<Table.Tr key={peer.id}>
            <Table.Td>{peer.name}</Table.Td>
            <Table.Td>{cooperation_score || '0.00'}</Table.Td>
            <Table.Td>{conceptual_score || '0.00'}</Table.Td>
            <Table.Td>{practical_score || '0.00'}</Table.Td>
            <Table.Td>{ethics_score || '0.00'}</Table.Td>
            <Table.Td>{average || '0.00'}</Table.Td>
        </Table.Tr>)
    }) : null;


    return (
        <AppShell navbar={{ width: 250 }}>
            <AppShell.Main>
                <Space h="md" />
                <Group justify="space-between">
                    <Title>
                        {selectedStudent
                            ? `Student ${selectedStudent.name} records`
                            : selectedTeam
                                ? `Students in ${selectedTeam.name}`
                                : selectedCourse
                                    ? `Teams in ${selectedCourse.name}`
                                    : `Courses in ${org}`}
                    </Title>
                </Group>
                <Space h="md" />
                {org && (
                    <>
                        {/* Show courses table if no course is selected */}
                        {!selectedCourse && (
                            <Table.ScrollContainer minWidth={500}>
                                <Table stickyHeader verticalSpacing="md" striped highlightOnHover withTableBorder>
                                    <Table.Thead>
                                        <Table.Tr>
                                            <Table.Th>Course Name</Table.Th>
                                            <Table.Th>Instructor</Table.Th>
                                            <Table.Th>Organization ID</Table.Th>
                                        </Table.Tr>
                                    </Table.Thead>
                                    <Table.Tbody>
                                        {course_rows.length > 0 ? course_rows : <tr><td colSpan={3}>No courses found</td></tr>}
                                    </Table.Tbody>
                                </Table>
                            </Table.ScrollContainer>
                        )}

                        {/* Show selected course's teams table if a course is selected but no team is selected */}
                        {selectedCourse && !selectedTeam && (
                            <>
                                <Button onClick={() => setSelectedCourse(null)} className="button3">Back to Course List</Button>
                                <Space h="md" />
                                <Table.ScrollContainer minWidth={500}>
                                    <Table stickyHeader verticalSpacing="md" striped highlightOnHover withTableBorder>
                                        <Table.Thead>
                                            <Table.Tr>
                                                <Table.Th>Team Name</Table.Th>
                                                <Table.Th>Max Size</Table.Th>
                                                <Table.Th>Instructor</Table.Th>
                                            </Table.Tr>
                                        </Table.Thead>
                                        <Table.Tbody>
                                            {team_rows.length > 0 ? team_rows : <tr><td colSpan={3}>No teams found</td></tr>}
                                        </Table.Tbody>
                                    </Table>
                                </Table.ScrollContainer>
                            </>
                        )}

                        {/* Show selected team's students table if a team is selected */}
                        {selectedTeam && !selectedStudent && (
                            <>
                                <Button onClick={() => setSelectedTeam(null)} className="button3">Back to Team List</Button>
                                <Space h="md" />
                                <Table.ScrollContainer minWidth={500}>
                                    <Table stickyHeader verticalSpacing="md" striped highlightOnHover withTableBorder>
                                        <Table.Thead>
                                            <Table.Tr>
                                                <Table.Th>Student Name</Table.Th>
                                                <Table.Th>Email</Table.Th>
                                                <Table.Th>Role</Table.Th>
                                            </Table.Tr>
                                        </Table.Thead>
                                        <Table.Tbody>
                                            {student_rows.length > 0 ? student_rows : <tr><td colSpan={3}>No students found</td></tr>}
                                        </Table.Tbody>
                                    </Table>
                                </Table.ScrollContainer>
                            </>
                        )}

                        {selectedStudent && (
                            <>
                                <Button onClick={() => {setSelectedStudent(null); setDetailedView(false);}} className="button3">Back to Student List</Button>
                                <Space h="md" />
                                <Table.ScrollContainer minWidth={500}>
                                    <Table stickyHeader verticalSpacing="md" striped highlightOnHover withTableBorder style={{ width : '100%' }}>
                                        <Table.Thead>
                                            <Table.Tr >
                                                <Table.Th>Student ID</Table.Th>
                                                <Table.Th>Student Name</Table.Th>
                                                <Table.Th>Team Name</Table.Th>
                                                <Table.Th>Cooperation</Table.Th>
                                                <Table.Th>Conceptual Contribution</Table.Th>
                                                <Table.Th>Practical Contribution</Table.Th>
                                                <Table.Th>Work Ethic</Table.Th>
                                                <Table.Th>Average</Table.Th>
                                                <Table.Th>Peers Who Reviewed</Table.Th>
                                            </Table.Tr>
                                        </Table.Thead>

                                        <Table.Tbody>
                                            <Table.Tr onClick={() => setDetailedView(true)} style={{ cursor : 'pointer' }}>
                                                <Table.Td>{selectedStudent.name || 'no name'}</Table.Td>
                                                <Table.Td>{selectedStudent.id || 'no id'}</Table.Td>
                                                <Table.Td>{selectedTeam.name || 'no team'}</Table.Td>
                                                <Table.Td>{averageCooperation || '0.00'}</Table.Td>
                                                <Table.Td>{averageConceptualContribution || '0.00'}</Table.Td>
                                                <Table.Td>{averagePracticalContribution || '0.00'}</Table.Td>
                                                <Table.Td>{averageWorkEthic || '0.00'}</Table.Td>
                                                <Table.Td>{averageOverall || '0.00'}</Table.Td>
                                                <Table.Td>{studentFeedbacks.length || 'no name'}</Table.Td>
                                            </Table.Tr>
                                        </Table.Tbody>

                                    </Table>
                                </Table.ScrollContainer>

                            </>
                        )}
                        <Space h='md' />
                        {/* Show selected student's feedback table if a student is selected */}
                        {detailedView && (
                            <>
                                <Title order={2} style={{fontWeight : 'lighter'}}>
                                    {`Details: `}
                                </Title>
                                <Space h='md' />
                                <Button onClick={() => setDetailedView(false)}>Hide Details</Button>
                                <Space h="md" />
                                <Table.ScrollContainer minWidth={500}>
                                    <Table stickyHeader verticalSpacing="md" striped highlightOnHover withTableBorder>
                                        <Table.Thead>
                                            <Table.Tr>
                                                <Table.Th>Peer</Table.Th>
                                                <Table.Th>Cooperation</Table.Th>
                                                <Table.Th>Conceptual Contribution</Table.Th>
                                                <Table.Th>Practical Contribution</Table.Th>
                                                <Table.Th>Work Ethic</Table.Th>
                                                <Table.Th>Average</Table.Th>
                                            </Table.Tr>
                                        </Table.Thead>
                                        <Table.Tbody>
                                            {(feedback_rows !== null && feedback_rows.length > 0) ? feedback_rows : <tr><td colSpan={3}>No records found</td></tr>}
                                        </Table.Tbody>
                                    </Table>
                                </Table.ScrollContainer>
                            </>
                        )}
                    </>
                )}
            </AppShell.Main>
        </AppShell >
    );
};

export default InstructorFeedbackTab;
