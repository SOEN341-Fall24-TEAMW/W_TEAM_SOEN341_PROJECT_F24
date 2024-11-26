import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { NavLink, AppShell, Table, Group, Space, Button, Title, TextInput, rem, Select, Alert } from '@mantine/core';
import { IconUsersGroup, IconMessageCircle, IconSearch, IconFileText , IconThumbUp} from '@tabler/icons-react';

import { NavbarStudentDashboard } from './NavbarStudentDashboard.js';
import PeerFeedback from './peerFeedback.js';
import TeammatesList from './TeammatesList.js';

import './styles.css';


const StudentDashboard = ({ email, loggedIn, setLoggedIn }) => {

  // Session management
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));
  useEffect(() => {
    if (!user || !user.token) {
        console.error("JWT token not found. Please log in again.");
        setLoggedIn(false);
        navigate('/');
    }
}, [user, navigate, setLoggedIn]);

  // Fetching current user ID 
  const currentUserId = JSON.parse(localStorage.getItem('user'))?.email; 


  const [selectedTeam, setSelectedTeam] = useState(null);
  const [active, setActive] = useState('Students');
  const [query, setQuery] = useState('');
  const [setShowForm] = useState(false);
  const [filteredTeamsByQuery, setFilteredTeamsByQuery] = useState([]); // State for filtered teams

  const [organizations, setOrganizations] = useState([]);
  const [courses, setCourses] = useState([]);
  const [teams, setTeams] = useState([]);
  const [memberships, setMemberships] = useState([]);
  const [students, setStudents] = useState([]);
  const [peerFeedbackData, setPeerFeedbackData] = useState([]);

  // Alert state for visibility
  const [isAlertVisible, setIsAlertVisible] = useState(true);

  // Function to handle the closing of the alert
  const handleCloseAlert = () => {
    setIsAlertVisible(false);
    console.log("Alert closed:", isAlertVisible);
  };

   // Alert state for visibility
   const [isAlertVisible2, setIsAlertVisible2] = useState(true);

   // Function to handle the closing of the alert
   const handleCloseAlert2 = () => {
     setIsAlertVisible2(false);
     console.log("Alert closed:", isAlertVisible2);
   };

  const fetchData = () => {
    const user = JSON.parse(localStorage.getItem("user"));

    if (!user || !user.token) {
      console.error("JWT token not found. Please log in again.");
      setLoggedIn(false);
      return;
    }

    try {
      fetch('http://localhost:3080/courses-students', {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
          'jwt-token': user.token,
        },
        body: JSON.stringify({ student: user.email }),
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.message === 'success') {
            setOrganizations(data.organization_info);
            setCourses(data.course_info);
            setTeams(data.team_info);
            setMemberships(data.membership_info);
            setStudents(data.peers_info);
          } else {
            console.error('Failed to fetch options:', data.message);
          }
        })
    } catch (error) {
      console.error('Error fetching options:', error);
    }
  };

  const fetchPeerFeedback = (teamId) => {
    const user = JSON.parse(localStorage.getItem("user"));
    fetch(`http://localhost:3080/peer-evaluations/feedback?teamId=${teamId}`, {
      method: "GET",
      headers: { 'jwt-token': user.token },
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.message === 'success') {
          setPeerFeedbackData(data.feedback);
        }
      })
      .catch((error) => console.error("Error fetching peer feedback:", error));
  };

  useEffect(() => {
    fetchData();
  }, [loggedIn]);

  useEffect(() => {
    if (selectedTeam) {
      fetch(`http://localhost:3080/peer-evaluations/feedback?teamId=${selectedTeam}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.message === "success") {
            setPeerFeedbackData(data.data); // Store the fetched feedback data
          } else {
            setPeerFeedbackData([]);
          }
        })
        .catch((error) => console.error("Error fetching peer feedback:", error));
    }
  }, [selectedTeam]);

  const rows2 = teams.map((team) => {
    const teamCourse = courses.find((course) => course.id === team.course_id);
    const courseName = teamCourse ? teamCourse.name : "No course";
    const organizationName = organizations.find((org) => org.id === teamCourse?.organization_id)?.name || "Unknown organization";

    return (
      <Table.Tr key={team.id} onClick={() => setSelectedTeam(team)} style={{ cursor: 'pointer' }}>
        <Table.Td>{team.name || "No name"}</Table.Td>
        <Table.Td>{team.max_size || "No max size"}</Table.Td>
        <Table.Td>{courseName}</Table.Td>
        <Table.Td>{organizationName}</Table.Td>
      </Table.Tr>
    );
  });

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));

    if (!user || !user.token) {
      console.error("JWT token not found. Please log in again.");
      setLoggedIn(false);
      return;
    }
    try {
      fetch('http://localhost:3080/courses-students', {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
          'jwt-token': user.token,
        },
        body: JSON.stringify({ student: user.email }),
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.message === 'success') {
            fetchData();
          } else {
            console.error('Failed to fetch options:', data.message);
          }
        })
    } catch (error) {
      console.error('Error fetching options:', error);
    }
  }, [loggedIn]);

  const tabs = [
    { label: 'My Teams', icon: IconUsersGroup },
    { label: 'Submissions', icon: IconFileText },
    { label: 'Feedback', icon: IconThumbUp }
  ];

  const navBarData = tabs.map((data) => (
    <NavLink
      key={data.label}
      leftSection={<data.icon size='1rem' stroke='1.5' />}
      label={data.label}
      active={data.label === active}
      variant="light"
      component="button"
      onClick={() => setActive(data.label)}
    />
  ));

  const handleTeamClick = (team) => {
    setSelectedTeam(team);
  };

  useEffect(() => {
    console.log("currently selected team: ", selectedTeam);
}, [selectedTeam]);

  console.log("value org: ", organizations);
  console.log("value course: ", courses);
  console.log("value teams: ", teams);
  console.log("value memb: ", memberships);
  console.log("value students", students);

  //const teamsToDisplay = query ? filteredTeamsByQuery : teams;
  //console.log("teams to display", teamsToDisplay);

  const rows = teams.map((team) => {
    const team_course = courses.find((course) => course.id === team.course_id); // Find course by course_id
    const course_name = team_course ? team_course.name : "No course"; // Get course name or fallback
    const organization_name = organizations.find((org) => org.id === team_course?.organization_id)?.name || "Unknown organization"; // Get organization name or fallback

    return (
      <Table.Tr key={team.id} onClick={() => handleTeamClick(team)}>
        <Table.Td>{team.name || "No name"}</Table.Td>
        <Table.Td>{team.max_size || "No max size"}</Table.Td>
        <Table.Td>{course_name}</Table.Td>
        <Table.Td>{organization_name}</Table.Td>
      </Table.Tr>
    );
  });

  const filteredFeedback = peerFeedbackData.filter((feedback) => {
    const evaluatee = students.find(student => student.id === feedback.evaluatee_id);  // Assuming `students` holds user data
    const evaluateeEmail = evaluatee ? evaluatee.email : null;
    console.log("Evaluatee email:", evaluateeEmail, "Current user email:", currentUserId);
    return feedback.team_id === selectedTeam && evaluateeEmail === currentUserId;
  });
  
  const evaluator = students.find(student => String(student.email) === String(currentUserId));

  // Peer submissions Table
  const submissionsTable = (
    <div>
    {/* Confidentiality message */}
    {isAlertVisible && (
        <Alert
          color="red"
          title="Confidentiality Reminder"
          style={{ marginBottom: '1em' }}
        >
          <div>
            Please maintain the confidentiality of all peer feedback information.
            {/* The 'X' button */}
            <button
              onClick={handleCloseAlert}
              style={{
                position: 'absolute', // Absolute positioning within the Alert container
                top: '10px',          // Top offset
                right: '10px',        // Right offset
                background: 'transparent',
                border: 'none',
                color: 'black',
                fontSize: '16px',
                cursor: 'pointer',
              }}
            >
              X
            </button>
          </div>
        </Alert>
      )}
    
    <Table striped highlightOnHover withBorder withColumnBorders>
      <thead>
        <tr>
        <th className="other-column">Teammate</th>
          <th className="other-column">Cooperation</th>
          <th className="other-column">Conceptual Contribution</th>
          <th className="other-column">Practical Contribution</th>
          <th className="other-column">Work Ethic</th>
          <th className="comment-column">Comments</th> {/* Wider comments column */}
          <th className="other-column">Average</th>
          <th className="other-column">Date</th>
        </tr>
      </thead>
          

      <tbody>
        {peerFeedbackData.filter(feedback => String(feedback.evaluator_id) === String(evaluator.id)).length > 0 ? (
          peerFeedbackData
          .filter(feedback => String(feedback.evaluator_id) === String(evaluator.id))
          .map((feedback, index) => {
            const averageScore = (
               (Number(feedback.cooperation) +
                Number(feedback.conceptual_contribution) +
                Number(feedback.practical_contribution) +
                Number(feedback.work_ethic)) / 4
            ).toFixed(2);
            
                return (
                  <tr key={index}>
                    <td>{students.find(student => student.id === feedback.evaluatee_id)?.name || feedback.evaluator_id}</td>
                    <td>{feedback.cooperation}</td>
                    <td>{feedback.conceptual_contribution}</td>
                    <td>{feedback.practical_contribution}</td>
                    <td>{feedback.work_ethic}</td>
                    <td>
                      <div>Cooperation: {feedback.cooperation_comment || 'No comment'}</div>
                      <div>Conceptual: {feedback.conceptual_comment || 'No comment'}</div>
                      <div>Practical: {feedback.practical_comment || 'No comment'}</div>
                      <div>Ethic: {feedback.ethic_comment || 'No comment'}</div>
                    </td>
                    <td>{averageScore}</td>
                    <td>{new Date(feedback.timestamp).toLocaleDateString()}</td>
                  </tr>
                );
              })
          ) : (
            <tr>
              <td colSpan="8">No peer feedback found.</td>
            </tr>
          )}
        </tbody>
      </Table>
    </div>
  );

  
  
  const feedbackTable = (
    <div>
      {/* Confidentiality message */}
      {isAlertVisible2 && (
        <Alert
          color="blue"
          title="Constructive Feedback Reminder"
          style={{ marginBottom: '1em', marginTop: '1em' }} 
        >
          <div>
            Peer feedback is intended to help everyone improve. Please take all ratings as constructive, not personal.
            <button
              onClick={handleCloseAlert2}
              style={{
                position: 'absolute',
                top: '10px',
                right: '10px',
                background: 'transparent',
                border: 'none',
                color: 'black',
                fontSize: '16px',
                cursor: 'pointer',
              }}
            >
              X
            </button>
          </div>
        </Alert>
      )}
      
      {/* Render the peer feedback table */}
      <Table striped highlightOnHover withBorder withColumnBorders>
        <thead>
          <tr>
            <th className="team-column">Team</th>
            <th className="comments-column">Comments</th>
            <th className="average-score-column">Average Score</th>
            <th>Average Score</th>
          </tr>
        </thead>
  
        <tbody>
          {filteredFeedback.length > 0 ? (
            filteredFeedback.map((feedback, index) => {
              if (index === 0 || filteredFeedback[index - 1].team_id !== feedback.team_id) {
                const team = teams.find((team) => team.id === feedback.team_id);

                // Concatenate all the comments into one string
              // Concatenate all comments from all teammates in the selected team
              const allComments = filteredFeedback
                .map(fb => [
                  fb.cooperation_comment,
                  fb.conceptual_comment,
                  fb.practical_comment,
                  fb.ethic_comment
                ].filter(comment => comment) // Filter out empty comments
                .join(' ')) // Join all comments into a single string
                .join(' '); // Join comments from all teammates into one string
    
                // Calculate average score across all criteria
                const totalScore = filteredFeedback.reduce((total, fb) => {
                  return total +
                    Number(fb.cooperation) +
                    Number(fb.conceptual_contribution) +
                    Number(fb.practical_contribution) +
                    Number(fb.work_ethic);
                }, 0);

                const averageOverallScore = (totalScore / (filteredFeedback.length * 4)).toFixed(2); // Divide by number of criteria * number of feedbacks

    
                return (
                  <tr key={index}>
                    <td>{team?.name || "No team name"}</td>
                    <td>{allComments}</td>
                    <td>{averageOverallScore}</td>
                  </tr>
                );
              } else {
                return null;
              }
            })
          ) : (
            <tr>
              <td colSpan="3">No feedback available for this team.</td>
            </tr>
          )}
        </tbody>
      </Table>
    </div>
  );
  

  return (
    <AppShell navbar={{ width: 250 }}>
      <AppShell.Navbar>{navBarData}</AppShell.Navbar>

      {active === 'My Teams' && (
        <AppShell.Main>
          <Space h="md" />
          <Group justify="space-between">
            <Title>My Teams</Title>
          </Group>
          <Space h="md" />
          <Group justify="space-between" style={{ alignItems: "center", height: "62.59px" }}>
            <TextInput value={query} placeholder="Search" leftSectionPointerEvents="none" leftSection={<IconSearch style={{ width: rem(20), height: rem(20) }} stroke={1.5} />} onChange={(event) => setQuery(event.currentTarget.value)} />
          </Group>
          <Space h="md" />
          <Table.ScrollContainer>
            <Table>
              <Table.Thead>
                <Table.Tr>
                  <Table.Th>Team</Table.Th>
                  <Table.Th>Size</Table.Th>
                  <Table.Th>Course</Table.Th>
                  <Table.Th>Organization</Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>{rows2.length > 0 ? rows2 : <tr><td colSpan={4}>No teams found</td></tr>}</Table.Tbody>
            </Table>
          </Table.ScrollContainer>

          {selectedTeam && (
            <div>
              <Button onClick={() => setSelectedTeam(null)} className="button3">Back to Team List</Button>
              <TeammatesList memberships={memberships.filter(m => m.team_id === selectedTeam.id)} teams={teams} students={students} email={email} selectedTeam={selectedTeam}/>
            </div>
          )}

        </AppShell.Main>
      )}


      {/* Peer Feedback Tab */}
      {active === 'Submissions' && (
        <AppShell.Main>
          <Space h="md" />
          <Title>Submissions</Title>

          {/* Dropdown to select the team. Implement actuall sorting logic here. */}
          <Select 
            label="Filter By Team"
            placeholder="Select a team"
            data={teams.map(team => ({ value: team.id, label: team.name }))}
            onChange={setSelectedTeam}
            style={{ width: '300px', marginBottom: '30px', marginTop: '20px' }}
            />

          {submissionsTable}
        </AppShell.Main>
      )}

{active === 'Feedback' && (
  <AppShell.Main>
    <Space h="md" />
    <Title>Peer Feedback</Title>

    {/* Dropdown to select the team. Implement actuall sorting logic here. */}
    <Select 
      label="Filter By Team"
      placeholder="Select a team"
      data={teams.map(team => ({ value: team.id, label: team.name }))}
      onChange={setSelectedTeam}
      style={{ width: '300px', marginBottom: '30px', marginTop: '20px' }}
    />

    {feedbackTable}
    
  </AppShell.Main>
)}



    </AppShell>
  );
};

export default StudentDashboard;

