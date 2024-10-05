const express = require("express")
const bcrypt = require("bcrypt") //for hashing and comparing passwords
var cors = require('cors')
const jwt = require("jsonwebtoken") // for generating and verifying JSON web tokens
var low = require("lowdb"); //for storing user details (email and hashed password)
var FileSync = require("lowdb/adapters/FileSync");
var adapter = new FileSync("./database.json");
var db = low(adapter);

// Set default structure for the database
db.defaults({ users: [], teams: [], courses: [] }).write();

const fs = require("fs"); // File system module to read CSV files
const csvParser = require("csv-parser"); // CSV parser library for reading the CSV file

// Real-time communication setup
const http = require('http');
const { Server } = require("socket.io");

// Initialize Express app
const app = express()
const server = http.createServer(app);
const io = new Server(server);


// Define a JWT secret key. This should be isolated by using env variables for security
const jwtSecretKey = "dsfdsfsdfdsvcsvdfgefg"

// Set up CORS and JSON middlewares
app.use(cors())
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Basic home route for the API
app.get("/", (_req, res) => {
    res.send("Auth API.\nPlease use POST /auth & POST /verify for authentication")
})

app.post("/", (req, res) => {
    res.status(405).send({ message: "Method Not Allowed" }); // Indicating that POST is not allowed
});

// The auth endpoint that creates a new user record or logs a user based on an existing record
app.post("/auth", (req, res) => {
    
    const { role, email, password } = req.body;

    // Look up the user entry in the database
    const user = db.get("users").value().filter(user => email === user.email)

    // If found, compare the hashed passwords and generate the JWT token for the user
    if (user.length === 1) {
        bcrypt.compare(password, user[0].password, function (_err, result) {
            if (!result) {
                return res.status(401).json({ message: "Invalid password" });
            } else if (role !== user[0].role) {
                return res.status(401).json({ message: "Invalid role" });
            } else {
                let loginData = {
                    email,
                    role,
                    signInTime: Date.now(),
                };

                const token = jwt.sign(loginData, jwtSecretKey);
                res.status(200).json({ message: "success", token });
            }
        });
    // If no user is found, hash the given password and create a new entry in the auth db with the email and hashed password
    } else {
        bcrypt.hash(password, 10, function (_err, hash) {
            console.log({ email, password: hash })
            db.get("users").push({ email, password: hash, role }).write()

            let loginData = {
                email,
                role,
                signInTime: Date.now(),
            };

            const token = jwt.sign(loginData, jwtSecretKey);
            res.status(200).json({ message: "success", token });
        });

    }


})

// The verify endpoint that checks if a given JWT token is valid
app.post('/verify', (req, res) => {
    const tokenHeaderKey = "jwt-token";
    const authToken = req.headers[tokenHeaderKey];
    try {
      const verified = jwt.verify(authToken, jwtSecretKey);
      if (verified) {
        return res.status(200).json({ status: "logged in", message: "success", role: verified.role });
      } else {
        // Access Denied
        return res.status(401).json({ status: "invalid auth", message: "error" });
      }
    } catch (error) {
      // Access Denied
      return res.status(401).json({ status: "invalid auth", message: "error" });
    }

})

// An endpoint to see if there's an existing account for a given email address
app.post('/check-account', (req, res) => {
    const { email } = req.body

    console.log("Request Body:", req.body);

    const user = db.get("users").value().filter(user => email === user.email)

    console.log(user)
    
    res.status(200).json({
        status: user.length > 0 ? "User exists" : "User does not exist", // Check length instead of truthy
        userExists: user.length > 0 // Update to check length
    })
})

// Endpoint to get teams information for students or instructors
app.get("/teams", (req, res) => {
    const tokenHeaderKey = "jwt-token";
    const authToken = req.headers[tokenHeaderKey];

    try {
        const verified = jwt.verify(authToken, jwtSecretKey);
        
        // If the user is an instructor, return all teams they manage
        if (verified.role === "instructor") {
            const instructorTeams = db.get("teams").filter({ instructorId: verified.email }).value();
            console.log("mario", instructorTeams);
            return res.status(200).json({ message: "success", teams: instructorTeams });
        
        // If the user is a student, return the team they belong to
        } else if (verified.role === "student") {
            const studentTeams = db.get("teams").filter(team => {
                return team.students.some(student => student.email === verified.email);
            }).value();

            return res.status(200).json({ message: "success", teams: studentTeams });
        }

        if (!teams || teams.length === 0) {
            return res.status(404).json({ message: "No teams found", teams: [] });
        }

        // If the role is neither student nor instructor, return an error
        return res.status(403).json({ message: "Access forbidden: invalid role" });

    } catch (error) {
        return res.status(401).json({ message: "Invalid token", error });
    }
});

// Endpoint to get course information for students or instructors
app.get("/courses", (req, res) => {
    const tokenHeaderKey = "jwt-token";
    const authToken = req.headers[tokenHeaderKey];

    try {
        const verified = jwt.verify(authToken, jwtSecretKey);
        
        // If the user is an instructor, return all teams they manage
        if (verified.role === "instructor") {
            const instructorCourses = db.get("courses").filter({ instructorId: verified.email }).value();
            console.log("luigi", instructorCourses);
            return res.status(200).json({ message: "success", courses: instructorCourses });
        
        // If the user is a student, return the team they belong to
        } else if (verified.role === "student") {
            const studentCourses = db.get("courses").filter(team => {
                return team.students.some(student => student.email === verified.email);
            }).value();

            return res.status(200).json({ message: "success", teams: studentCourses });
        }

        if (!teams || teams.length === 0) {
            return res.status(404).json({ message: "No teams found", teams: [] });
        }

        // If the role is neither student nor instructor, return an error
        return res.status(403).json({ message: "Access forbidden: invalid role" });

    } catch (error) {
        return res.status(401).json({ message: "Invalid token", error });
    }
});

// Middleware to verify if the user is an instructor
function isInstructor(req, res, next) {
    const token = req.headers["jwt-token"];
    if (!token) {
        return res.status(401).json({ message: "Token not provided" });
    }
    try {
        const decodedToken = jwt.verify(token, jwtSecretKey);
        // console.log("Decoded Token:", decodedToken); // Log the entire decoded token
        if (decodedToken.role !== "instructor") {
            return res.status(403).json({ message: "Access forbidden: not an instructor" });
        }
        next();
    } catch (error) {
        console.error("Token verification error:", error);
        res.status(401).json({ message: "Invalid token" });
    }
}
  
// API to create a team (instructors only)
app.post("/teams", isInstructor, (req, res) => {
    const { name, instructorId, maxSize, courseId } = req.body;
  
    // Check if courseId is valid
    isCourseValid(courseId).then((valid) => {
      if (!valid) {
        return res.status(400).json({ message: "Invalid course ID" });
      }
  
      const newTeam = { id: Date.now().toString(), name, instructorId, maxSize, courseId, students: [] }; //change id for random num generator?
      db.get("teams").push(newTeam).write();
  
      res.status(201).json({ message: "Team created successfully", team: newTeam });
    }).catch((error) => {
      res.status(500).json({ message: "Error creating team", error });
    });
});
  
// API to add a student to a team
app.post("/teams/:id/students", (req, res) => {
    const teamId = req.params.id;
    const { studentId, name, email } = req.body;
  
    // Find the team
    const team = db.get("teams").find({ id: teamId }).value();
    if (!team) {
      return res.status(404).json({ message: "Team not found" });
    }

    // Check if team is full
    if (team.students.length >= team.maxSize) {
      return res.status(400).json({ message: "Team is full" });
    }

    // Check if the student is registered
    const registeredStudent = db.get("users").find({ email }).value();
    if (!registeredStudent) {
        console.warn(`Warning: Student ${email} is not registered in the database.`);
    }

    const newStudent = { studentId, name, email };
    db.get("teams").find({ id: teamId }).get("students").push(newStudent).write();
  
    res.status(201).json({ 
        message: "Student added to team", 
        student: newStudent,
        warning: registeredStudent ? null : "Warning: Student is not registered in the database."
    });
});
  
// API to update team size (instructors only)
app.put("/teams/:id/size", isInstructor, (req, res) => {
    const teamId = req.params.id;
    const { newSize } = req.body;
  
    db.get("teams").find({ id: teamId }).assign({ maxSize: newSize }).write();
  
    res.status(200).json({ message: "Team size updated successfully" });
});
  
// API to remove a student from a team
app.delete("/teams/:id/students/:studentId", isInstructor, (req, res) => {
    const teamId = req.params.id;
    const studentId = req.params.studentId;

    // Find the team
    const team = db.get("teams").find({ id: teamId }).value();
    if (!team) {
      return res.status(404).json({ message: "Team not found" });
    }

    db.get("teams")
      .find({ id: teamId })
      .get("students")
      .remove({ studentId })
      .write();
  
    res.status(200).json({ message: "Student removed from team" });
});
  
// Function to validate course ID based on uploaded CSV
function isCourseValid(courseId) {
    const courses = [];
    return new Promise((resolve, reject) => {
      const stream = fs.createReadStream("../CU_SR_OPEN_DATA_CATALOG_utf8.csv")
      stream.on("error", (error) => {
        console.error("Error reading the file:", error.message); // Log the error message
        reject(error);
    });

    stream.pipe(csvParser())
        .on("data", (row) => {
            // console.log("Parsed Row: ", row); // Log each parsed row
            if (row["Course ID"]) {
                const courseID = row["Course ID"].trim();
                console.log("Found Course ID: ", courseID);
                courses.push(courseID);
            }
        })
        .on("end", () => {
            // console.log("Available Course IDs: ", courses); // Log available course IDs
            const validCourse = courses.includes(courseId);
            resolve(validCourse);
        });
    });
}
  
// Real-time Socket.IO connection handler
io.on('connection', (socket) => {
    console.log('A user connected');
    socket.on('disconnect', () => {
        console.log('User disconnected');
    });
});

// Start server
app.listen(3080, () => {
    console.log("Server running on port 3080");
});