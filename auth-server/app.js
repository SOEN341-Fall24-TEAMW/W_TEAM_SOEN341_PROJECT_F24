const express = require("express")
const bcrypt = require("bcrypt") //for hashing and comparing passwords
var cors = require('cors')
const jwt = require("jsonwebtoken") // for generating and verifying JSON web tokens
var low = require("lowdb"); //for storing user details (email and hashed password)
var FileSync = require("lowdb/adapters/FileSync");
var adapter = new FileSync("./database.json");
var db = low(adapter);
const { v4: uuidv4 } = require('uuid');
const newId = uuidv4();

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
                    id: user[0].id,
                    email,
                    role,
                    signInTime: Date.now(),
                };
                console.log("login data: ", loginData);
                const token = jwt.sign(loginData, jwtSecretKey);
                console.log("auth token: ", token);
                res.status(200).json({ message: "success", id: user[0].id, token });
            }
        });
    } 

})

app.post("/create-account", (req, res) => {
    
    const { role, firstName, lastName, id, email, password } = req.body;

    bcrypt.hash(password, 10, function (_err, hash) {
        
        db.get("users").push({ id: email, email, password: hash, role, name : firstName + " " + lastName, organization_id : "" }).write();
        let creationData = {
            id,
            email,
            role,
            name : firstName + " " + lastName,
            creationTime: Date.now(),
        };
        console.log(creationData);

        const token = jwt.sign(creationData, jwtSecretKey);
        return res.status(200).json({ message: "success", token });
    });

})

// The verify endpoint that checks if a given JWT token is valid
app.post('/verify', (req, res) => {
    const tokenHeaderKey = "jwt-token";
    const authToken = req.headers[tokenHeaderKey];

    console.log("Received Token:", authToken);
    try {
      const verified = jwt.verify(authToken, jwtSecretKey);
      console.log("verified 1: ", verified);
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

    console.log("user: ", user)
    
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
    console.log("Courses Token:", authToken);

    try {
        const verified = jwt.verify(authToken, jwtSecretKey);
        console.log("verified", verified);
        
        // If the user is an instructor, return all teams they manage
        if (verified.role === "instructor") {
            const courses = db.get("courses").filter({ instructor_id: verified.id }).value();
            const course_id = courses.map(course => course.id);
            console.log(courses);
            console.log(course_id);
            const course_names = courses.map(course => course.name);
            console.log(course_names);
            const teams = db.get("teams").filter(team => course_id.includes(team.course_id)).value();
            console.log("teams: ", teams);
            const team_id = teams.map(team => team.id);
            console.log("team ids: ", team_id);
            const team_membership = db.get("team_memberships").filter(membership => team_id.includes(membership.team_id)).value();
            console.log("team membership: ", team_membership);
            const student_id =  db.get("users").filter(user => (user.role === "student")).map(user => user.id).value();
            console.log("student_id", student_id);
            const students = db.get("users").filter(student => student_id.includes(student.id)).value();
            console.log("students", students);
            const organization_id = students.map(student => student.organization_id);
            console.log("organization_id", organization_id);
            const organizations = db.get("organizations").filter(organization => organization_id.includes(organization.id)).value();
            console.log("organization", organizations);
            const organization_name = organizations.map(organization => organization.name);
            console.log("organization_name", organization_name);
            return res.status(200).json({ 
                message: "success", 
                organization_info: organizations, 
                course_info: courses, 
                team_info: teams,
                student_info: students,
                membership_info: team_membership,
             });
        
        // If the user is a student, return the team they belong to
        } else if (verified.role === "student") {
            const studentCourses = db.get("team_memberships").filter(team => {
                return team.some(team => team.student_id === verified.id);
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

app.post('/create-team', (req, res) => {
    const { organization_id, new_org_name, course_id, new_course_name, team_name, max_size, instructor_id, selected_students } = req.body;
  
    try {
      // Step 1: Add new organization if needed
      let final_org_id = organization_id;
      if (new_org_name) {
        final_org_id = newId;
        db.get('organizations').push({ id: final_org_id, name: new_org_name }).write();
      }
  
      // Step 2: Add new course if needed
      let final_course_id = course_id;
      if (new_course_name) {
        final_course_id = newId
        db.get('courses').push({ id: final_course_id, name: new_course_name, instructor_id, organization_id: final_org_id }).write();
      }
  
      // Step 3: Add the new team
      const new_team = { id: newId, name: team_name, max_size, course_id: final_course_id, instructor_id };
      db.get('teams').push(new_team).write();
  
      // Step 4: Add students to the team
      selected_students.forEach((student_id) => {
        const membership = { id: newId, team_id: new_team.id, student_id };
        db.get('team_memberships').push(membership).write();
      });
  
      res.status(200).json({ message: "Team created successfully" });
    } catch (error) {
      console.error("Error creating team:", error);
      res.status(500).json({ message: "Error creating team" });
    }
  });

app.get("/users", (req, res) => {
    console.log("GET /users endpoint hit");
    const tokenHeaderKey = "jwt-token";
    const authToken = req.headers[tokenHeaderKey];

    try {
        const verified = jwt.verify(authToken, jwtSecretKey);

        if (verified.role === "instructor" || verified.role === "student") {
            const allUsers = db.get("users").value();
            const students = allUsers.filter(user => user.role === 'student');
            console.log("bowser", students);
            return res.status(200).json({ message: "success", data: students });
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