import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { React, useEffect, useState } from 'react';
import { MantineProvider } from '@mantine/core';
import { Notifications } from '@mantine/notifications';

import Header from './header.js';
import NotificationContainer from './pages/notification-container.js';
import Home from './home.js';
import Login from './login.js';
import CreateNewAccount from './pages/create-new-account.js';
import StudentDashboard from './pages/student-dashboard.js';
import InstructorDashboard from './pages/instructor-dashboard.js';
import CreateTeams from './pages/CreateTeams.js';
import Teams from './pages/Teams.js';
import TeamList from './pages/TeamList.js';
import TeamDetails from './pages/TeamDetails.js';
import TeammatesList from './pages/TeammatesList.js';
import PeerEvaluationForm from './pages/peerEvaluationForm.js';
import PeerEvaluationIntro from './pages/peerEvaluationIntro.js';

import Footer from './footer.js';

import '@mantine/notifications/styles.css';
import '@mantine/core/styles.css';

function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");
  const [organizations, setOrganizations] = useState([]);
  const [instructorOrganizations, setInstructorOrganizations] = useState([]);
  const [courses, setCourses] = useState([]);
  const [org, setOrg] = useState('');
  const [teams, setTeams] = useState([]);
  const [students, setStudents] = useState([]);
  const [orgStudentList, setOrgStudentList] = useState([]);
  const [memberships, setMemberships] = useState([]);
  const [userRole, setUserRole] = useState("");

  const fetchData = () => {
    const user = JSON.parse(localStorage.getItem("user"));

    if (!user || !user.token) {
      console.error("App: JWT token not found. Please log in again.");
      setLoggedIn(false);
      return;
    }

    try {
      fetch('http://localhost:3080/courses', {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
          'jwt-token': user.token,
        },
        body: JSON.stringify({ instructor: user.email }),
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.message === 'success') {
            setOrganizations(data.organization_info);
            setCourses(data.course_info);
            setTeams(data.team_info);
            setStudents(data.student_info);
            setMemberships(data.membership_info);
            setInstructorOrganizations(data.instructor_organizations);
            setOrgStudentList(data.all_students_in_instructor_orgs);
          } else {
            console.error('Failed to fetch options:', data.message);
          }
        })
    } catch (error) {
      console.error('Error fetching options:', error);
    }
  };

  useEffect(() => {
    const storedRole = localStorage.getItem("role");
    if (storedRole) {
      setRole(storedRole);
    }
  }, [setRole]);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));

    if (!user || !user.token) {
      setLoggedIn(false);
      return;
    }

    fetch("http://localhost:3080/verify", {
      method: "POST",
      headers: {
        'jwt-token': user.token,
      },
    })
      .then(r => r.json())
      .then(r => {
        setLoggedIn('success' === r.message);
        setEmail(user.email || "");
      });
  }, []);

  useEffect(() => {
    if (loggedIn) {
      fetchData();
    }
  }, [loggedIn]);

  return (
    <div className="App">
      <MantineProvider>
        <BrowserRouter>
          <Header loggedIn={loggedIn} setLoggedIn={setLoggedIn} role={role} setRole={setRole} org={org} setOrg={setOrg} instructorOrganizations={instructorOrganizations} />
          <Notifications />
          <Routes>
            <Route path="/" element={<Home email={email} loggedIn={loggedIn} setLoggedIn={setLoggedIn} />} />
            <Route path="/login" element={<Login role={role} setRole={setRole} email={email} setEmail={setEmail} loggedIn={loggedIn} setLoggedIn={setLoggedIn} />} />
            <Route path='/create-new-account' element={<CreateNewAccount setLoggedIn={setLoggedIn} setEmail={setEmail} />} />
            <Route path="/student-dashboard" element={<StudentDashboard email={email} loggedIn={loggedIn} setLoggedIn={setLoggedIn} />} />
            <Route path="/instructor-dashboard" element={<InstructorDashboard organizations={organizations} org={org} courses={courses} teams={teams} setTeams={setTeams} students={students} setStudents={setStudents} orgStudentList={orgStudentList} setOrgStudentList={setOrgStudentList} memberships={memberships} email={email} fetchData={fetchData} loggedIn={loggedIn} setLoggedIn={setLoggedIn} />} />
            <Route path='/Teams' element={<Teams />} />
            <Route path='/CreateTeams' element={<CreateTeams />} />
            <Route path='/TeamList' element={<TeamList />} />
            <Route path='/teams/:teamId' element={userRole === 'instructor' ? <TeamDetails />
              : <TeammatesList
              />}
            />
            <Route path='/peer-evaluation' element={<PeerEvaluationForm teams={teams} />} />
            <Route path="/PeerEvaluationIntro" element={<PeerEvaluationIntro />} />
          </Routes>
          <Footer />
        </BrowserRouter>
      </MantineProvider>
    </div>
  );
}

export default App;