import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { MantineProvider } from '@mantine/core';

import Header from './header';
import Home from './home';
import Login from './login';
import CreateNewAccount from './pages/create-new-account.js';
import StudentDashboard from './pages/student-dashboard.js';
import InstructorDashboard from './pages/instructor-dashboard.js';
import CreateTeams from './pages/CreateTeams';
import Teams from './pages/Teams';
import TeamList from './pages/TeamList';
import Footer from './footer.js';

import '@mantine/core/styles.css';

function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [email, setEmail] = useState("");
  const [course, setCourse] = useState("");

  useEffect(() => {
    // Fetch the user email and token from local storage
    const user = JSON.parse(localStorage.getItem("user"))

    // If the token/email does not exist, mark the user as logged out
    if (!user || !user.token) {
      setLoggedIn(false)
      return
    }

    // If the token exists, verify it with the auth server to see if it is valid
    fetch("http://localhost:3080/verify", {
            method: "POST",
            headers: {
                'jwt-token': user.token
              }
        })
        .then(r => r.json())
        .then(r => {
            setLoggedIn('success' === r.message)
            setEmail(user.email || "")
        })
  }, [])

  return (
    <div className="App">
      <MantineProvider>
        <BrowserRouter>
          <Header loggedIn={loggedIn} setLoggedIn={setLoggedIn} course={course} setCourse={setCourse}/>
          <Routes>
            <Route path="/" element={<Home email={email} loggedIn={loggedIn} setLoggedIn={setLoggedIn}/>} />
            <Route path="/login" element={<Login setLoggedIn={setLoggedIn} setEmail={setEmail} />} />
            <Route path='/create-new-account' element={<CreateNewAccount setLoggedIn={setLoggedIn} setEmail={setEmail} />} />
            <Route path="/student-dashboard" element={<StudentDashboard loggedIn={loggedIn} setLoggedIn={setLoggedIn} />} />
            <Route path="/instructor-dashboard" element={<InstructorDashboard setLoggedIn={setLoggedIn} course={course} />} />
            <Route path='/Teams' element={<Teams/>} />
            <Route path='/CreateTeams' element={<CreateTeams/>} />
            <Route path='/TeamList' element={<TeamList/>} />
          </Routes>
          <Footer />
        </BrowserRouter>
      </MantineProvider>
    </div>
  );
}

export default App;

