const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const app = express();
let port = 3000;

// Middleware for parsing form data
app.use(bodyParser.urlencoded({ extended: true }));

// Middleware for session management
app.use(session({
  secret: 'yourSecretKey',
  resave: false,
  saveUninitialized: true,
}));

//in-memory user store
const users = {
  instructor: { username: 'instructor', password: 'password123', role: 'instructor' },
  student: { username: 'student', password: 'password123', role: 'student' }
};

var start = Date.now();


function startServer(port) {
  const server = app.listen(port, () => {
    const readyTime = Date.now() - start;

    console.log(`  - Local:        http://localhost:${port}`);
    console.log(`\n ✓ Ready in ${readyTime}ms`);
  });

  server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      console.log(`Port ${port} is already in use, trying port ${port + 1}...`);
      port += 1;
      startServer(port);
    } else {
      console.error('Server error:', err);
    }
  });
}

// Middleware
function ensureAuthenticated(req, res, next) {
  if (req.session.user) {
    return next();
  }
  res.redirect('/login');
}

function ensureRole(role) {
  return (req, res, next) => {
    if (req.session.user && req.session.user.role === role) {
      return next();
    }
    res.status(403).send('Forbidden');
  };
}

app.get('/', (req, res) => {
  res.redirect('/login');
});


app.get('/login', (req, res) => {
  res.send(`
    <form action="/login" method="post">
      <label for="username">Username:</label>
      <input type="text" id="username" name="username" required><br><br>
      <label for="password">Password:</label>
      <input type="password" id="password" name="password" required><br><br>
      <button type="submit">Login</button>
    </form>
  `);
});

// Handle login submission
app.post('/login', (req, res) => {
  const { username, password } = req.body;

  // Simple user authentication
  if (users[username] && users[username].password === password) {
    req.session.user = users[username]; // Store user info in session
    if (users[username].role === 'instructor') {
      return res.redirect('/instructor');
    } else {
      return res.redirect('/student');
    }
  } else {
    res.send('Invalid username or password');
  }
});

// Instructor dashboard (restricted to instructors only)
app.get('/instructor', ensureAuthenticated, ensureRole('instructor'), (req, res) => {
  res.send('Welcome to the instructor dashboard');
});

// Student dashboard (restricted to students only)
app.get('/student', ensureAuthenticated, ensureRole('student'), (req, res) => {
  res.send('Welcome to the student dashboard');
});

// Logout route
app.get('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).send('Failed to log out');
    }
    res.redirect('/login');
  });
});

// Start the server
startServer(port);