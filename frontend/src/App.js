import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { MantineProvider } from '@mantine/core';

import Header from './header.js';
import Home from './home.js';
import Login from './login.js';
import CreateNewAccount from './pages/create-new-account.js';
import StudentDashboard from './pages/student-dashboard.js';
import InstructorDashboard from './pages/instructor-dashboard.js';
import CreateTeams from './pages/CreateTeams.js';
import Teams from './pages/Teams.js';
import TeamList from './pages/TeamList.js';
import PeerEvaluationForm from './pages/peerEvaluationForm.js';
import Footer from './footer.js';

import '@mantine/core/styles.css';

function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [email, setEmail] = useState("");
  const [organizations, setOrganizations] = useState([]);
  const [courses, setCourses] = useState([]);
  const [org, setOrg] = useState('');
  const [teams, setTeams] = useState([]);
  const [students, setStudents] = useState([]);
  const [memberships, setMemberships] = useState([]);

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
    const user = JSON.parse(localStorage.getItem("user"));

    if (!user || !user.token) {
      console.error("JWT token not found. Please log in again.");
      setLoggedIn(false);
      return;
    }

    fetch('http://localhost:3080/courses', {
      headers: {
        'Content-Type': 'application/json',
        'jwt-token': user.token,
      },
    })
    .then((response) => response.json())
    .then((data) => {
      if (data.message === 'success') {
        setOrganizations(data.organization_info);
        setCourses(data.course_info);
        setTeams(data.team_info);
        setStudents(data.student_info);
        setMemberships(data.membership_info);
      } else {
        console.error('Failed to fetch options:', data.message);
      }
    })
    .catch((error) => console.error('Error fetching options:', error));
  }, [loggedIn]);

  return (
    <div className="App">
      <MantineProvider>
        <BrowserRouter>
          <Header loggedIn={loggedIn} setLoggedIn={setLoggedIn} organizations={organizations} org={org} setOrg={setOrg} />
          <Routes>
            <Route path="/" element={<Home email={email} loggedIn={loggedIn} setLoggedIn={setLoggedIn}/>} />
            <Route path="/login" element={<Login setLoggedIn={setLoggedIn} setEmail={setEmail} />} />
            <Route path='/create-new-account' element={<CreateNewAccount setLoggedIn={setLoggedIn} setEmail={setEmail} />} />
            <Route path="/student-dashboard" element={<StudentDashboard loggedIn={loggedIn} setLoggedIn={setLoggedIn} />} />
            <Route path="/instructor-dashboard" element={<InstructorDashboard organizations={organizations} org={org} courses={courses} teams={teams} students={students} memberships={memberships} email={email} />} />
            <Route path='/Teams' element={<Teams/>} />
            <Route path='/CreateTeams' element={<CreateTeams/>} />
            <Route path='/TeamList' element={<TeamList/>} />
            <Route path='/peer-evaluation' element={<PeerEvaluationForm/>} />
          </Routes>
          <Footer />
        </BrowserRouter>
      </MantineProvider>
    </div>
  );
}

export default App;