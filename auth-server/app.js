const express = require("express")
const bcrypt = require("bcrypt") //for hashing and comparing passwords
var cors = require('cors')
const app = express();
const jwt = require("jsonwebtoken") // for generating and verifying JSON web tokens
const instructorRoutes = require('./instructorRoutes'); // Import the instructorRoutes module
var low = require("lowdb"); //for storing user details (email and hashed password)
var FileSync = require("lowdb/adapters/FileSync");
var adapter = new FileSync("./database.json");
var db = low(adapter);
const { v4: uuidv4 } = require('uuid');

//const router = express.Router();


app.use('/instructor', instructorRoutes);
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/organization_id', (req, res) => {
    const organization_id = db.get("organization_id ").value();
    res.status(200).json(organization_id);
});

// Helper function to anonymize data
function anonymizeData(data) {
    if (!data) return data;
    return data.replace(/./g, '*'); // Replace all characters with asterisks
}

// Set default structure for the database
db.defaults({ organizations: [], users: [], courses: [], teams: [], team_memberships: [], peer_evaluations: [], instructor_org_memberships: [] }).write();

const fs = require("fs"); // File system module to read CSV files
const csvParser = require("csv-parser"); // CSV parser library for reading the CSV file


// Real-time communication setup
const http = require('http');
const { Server } = require("socket.io");

const server = http.createServer(app);
const io = new Server(server);


// Define a JWT secret key. This should be isolated by using env variables for security
const jwtSecretKey = "dsfdsfsdfdsvcsvdfgefg"
module.exports = app;

// function isValidToken(token) {
//     try {
//         const decoded = jwt.verify(token, jwtSecretKey);
//         return decoded && decoded.role === 'instructor'; // Adjust if you need to check a specific role
//     } catch (error) {
//         return false;
//     }
// }

// Fetch student data for export, including team, course, and organization details
function fetchStudentDataToExport(organizationId) {
    return db.get("users")
        .filter({ role: 'student', organization_id: organizationId })
        .map(student => ({
            name: student.name || "No name",
            studentId: student.id || "No ID",
            email: student.email || "No email",
            team: db.get("teams").find({ id: student.team_id }).get("name").value() || "No team",
            course: db.get("courses").find({ id: student.course_id }).get("name").value() || "No course",
            organization: db.get("organizations").find({ id: student.organization_id }).get("name").value() || "No organization"
        }))
        .value();
}

app.get('/export', isInstructor, (req, res) => {
    const organizationId = req.query.organizationId;
    if (!organizationId) {
        return res.status(400).json({ message: "Organization ID is required" });
    }

    // Fetch the student data filtered by organization ID
    const studentData = fetchStudentDataToExport(organizationId);

    if (studentData.length === 0) {
        return res.status(404).json({ message: "No students found for this organization" });
    }

    const fields = ['name', 'studentId', 'email', 'team', 'course', 'organization'];
    const { Parser } = require('json2csv'); // Use require for CommonJS
    const json2csvParser = new Parser({ fields });
    const csvData = json2csvParser.parse(studentData);

    // Send the CSV data as a downloadable file
    res.header('Content-Type', 'text/csv');
    res.attachment(`students_${organizationId}.csv`);
    res.send(csvData);
});


// // Helper function to fetch students by organization ID
// function fetchStudentsByOrganization(orgId) {
//     return db.get("users")
//         .filter({ role: 'student', organization_id: orgId })
//         .map(student => ({
//             id: student.id,
//             email: student.email,
//             password: student.password,
//             name: student.name
//         }))
//         .value();
// }

// Function to export students for all organizations
// function exportAllOrganizationStudentsToCSV() {
//     const organizations = db.get("organizations").value();
//     const csvFiles = [];

//     organizations.forEach(org => {
//         const students = fetchStudentsByOrganization(org.id);

//         if (students.length > 0) {
//             const csvData = json2csvParser.parse(students);

//             const filename = `students_${org.name.replace(/ /g, "_").toLowerCase()}.csv`;
//             fs.writeFileSync(filename, csvData);
//             csvFiles.push(filename);
//             console.log(`CSV file ${filename} created successfully for organization: ${org.name}`);
//         }
//     });
//     return csvFiles;
// }


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
                res.status(200).json({ message: "success", id: user[0].id, token, role });
            }
        });
    }

})
// assign-random route here
app.post("/assign-random", (req, res) => {
    try {
        const { students, teams } = req.body;

        if (!students || !teams || students.length === 0 || teams.length === 0) {
            return res.status(400).json({ message: "Students or teams data missing" });
        }

        const shuffledStudents = students.sort(() => Math.random() - 0.5);
        const assignments = assignStudentsToTeams(shuffledStudents, teams);

        res.status(200).json({ message: "Students assigned successfully", assignments });
    } catch (error) {
        console.error("Error during student assignment:", error);
        res.status(500).json({ message: "Internal Server Error", error });
    }
});

function assignStudentsToTeams(students, teams) {
    const assignments = {};

    if (teams.length === 0) {
        return assignments; // Return an empty object if there are no teams
    }

    // Initialize all teams with empty arrays
    teams.forEach((team) => {
        assignments[team] = [];
    });

    let teamIndex = 0;

    students.forEach((student) => {
        const team = teams[teamIndex];
        if (!assignments[team]) assignments[team] = [];
        assignments[team].push(student);
        teamIndex = (teamIndex + 1) % teams.length;
    });


    return assignments;
}

module.exports = { assignStudentsToTeams };


app.post("/create-account", (req, res) => {

    const { role, firstName, lastName, id, email, password, organizationId, organizationIdInstructor } = req.body;

    bcrypt.hash(password, 10, function (_err, hash) {

        if (role === 'student') {
            db.get("users").push({ id, email, password: hash, role, name: firstName + " " + lastName, organization_id: organizationId }).write();
        }

        if (role === 'instructor') {
            db.get("users").push({ id: email, email, password: hash, role, name: firstName + " " + lastName }).write();
            db.get("instructor_org_memberships").push({ id: uuidv4(), instructor_id: email, organization_id: organizationIdInstructor }).write();
        }

        let creationData = {
            id,
            email,
            role,
            name: firstName + " " + lastName,
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
        console.error("JWT verification error:", error.message); // Log the error
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
    const tokenHeaderKey = "jwt-token";  // Define the token header key to extract the JWT from the headers
    const authToken = req.headers[tokenHeaderKey];  // Get the token from the request headers

    try {
        const verified = jwt.verify(authToken, jwtSecretKey);  // Verify the JWT with the secret key to extract the user's information

        // If the user is an instructor, fetch all teams managed by this instructor
        if (verified.role === "instructor") {
            // Filter teams where the instructor's email matches the verified email from the token
            const instructorTeams = db.get("teams").filter({ instructor_id: verified.email }).value();

            // Check if no teams were found for the instructor
            if (!instructorTeams || instructorTeams.length === 0) {
                return res.status(404).json({ message: "No teams found for instructor", teams: [] });
            }

            // Return the list of teams for the instructor
            return res.status(200).json({ message: "success", teams: instructorTeams });

            // If the user is a student, fetch the teams they are a part of
        }

        else if (verified.role === "student") {
            // Find all team memberships where the student's ID (email) matches the verified email
            const studentMemberships = db.get("team_memberships").filter({ student_id: verified.email }).value();

            // Map the memberships to actual teams and anonymize student data
            const studentTeams = studentMemberships.map(membership => {
                const team = db.get("teams").find({ id: membership.team_id }).value();
                return {
                    ...team,
                    students: team.students.map(student => ({
                        ...student,
                        name: anonymizeData(student.name), // Anonymize student name
                        email: anonymizeData(student.email) // Anonymize student email
                    }))
                };
            });

            // Check if no teams were found for the student
            if (!studentTeams || studentTeams.length === 0) {
                return res.status(404).json({ message: "No teams found for student", teams: [] });
            }

            // Return the list of teams for the student
            return res.status(200).json({ message: "success", teams: studentTeams });
        }


        // Find all team memberships where the student's ID (email) matches the verified email
        const studentMemberships = db.get("team_memberships").filter({ student_id: verified.email }).value();

        // Map the memberships to actual teams by finding each team based on its ID
        const studentTeams = studentMemberships.map(membership => {
            return db.get("teams").find({ id: membership.team_id }).value();
        });

        // Check if no teams were found for the student
        if (!studentTeams || studentTeams.length === 0) {
            return res.status(404).json({ message: "No teams found for student", teams: [] });
        }

        // Return the list of teams for the student
        return res.status(200).json({ message: "success", teams: studentTeams });


        // If the role is neither student nor instructor, return a 403 forbidden error
        //return res.status(403).json({ message: "Access forbidden: invalid role" });

    } catch (error) {
        // If there's an error (e.g., token is invalid), return a 401 unauthorized error
        return res.status(401).json({ message: "Invalid token", error });
    }
});

// Endpoint to get course information for students or instructors
app.post("/courses", (req, res) => {
    const tokenHeaderKey = "jwt-token";
    const authToken = req.headers[tokenHeaderKey];
    const instructor = req.body.instructor;
    console.log("Courses Token:", authToken);

    try {
        const verified = db.get('users').find(user => (user.email === instructor)).value();
        console.log("verified", verified);

        // If the user is an instructor, return all teams they manage
        if (verified.role === "instructor") {
            const courses = db.get("courses").filter({ instructor_id: verified.id }).value();
            const course_id = courses.map(course => course.id);

            const teams = db.get("teams").filter(team => course_id.includes(team.course_id)).value();
            const team_id = teams.map(team => team.id);

            const team_memberships = db.get("team_memberships").filter(membership => team_id.includes(membership.team_id)).value();

            const student_ids = team_memberships.map(membership => membership.student_id);
            const students = db.get("users").filter(student => student_ids.includes(student.id)).value();

            const organization_ids = [...new Set(students.map(student => student.organization_id))];
            const course_organizations = db.get("organizations").filter(organization => organization_ids.includes(organization.id)).value();

            const instructor_organization_ids = db.get("instructor_org_memberships").filter({ instructor_id: verified.id }).flatMap(membership => membership.organization_id).value();
            const instructor_organizations = db.get("organizations").filter(organization => instructor_organization_ids.includes(organization.id)).value();

            // Separating students already in the instructor's courses (students variable) from all students in the instructor organizations
            // alows for more control over display of information to different functionalities such as team editing or seeing all students in instructor's classes
            const all_students_in_instructor_orgs = db.get("users").filter(student => instructor_organization_ids.includes(student.organization_id)).value();

            return res.status(200).json({
                message: "success",
                organization_info: course_organizations,
                course_info: courses,
                team_info: teams,
                student_info: students,
                membership_info: team_memberships,
                instructor_organizations: instructor_organizations,
                all_students_in_instructor_orgs: all_students_in_instructor_orgs,
            });
        }

        // If the role is neither student nor instructor, return an error
        return res.status(403).json({ message: "Access forbidden: invalid role" });

    } catch (error) {
        return res.status(401).json({ message: "Invalid token", error });
    }
});

app.post("/courses-students", (req, res) => {
    const tokenHeaderKey = "jwt-token";
    const authToken = req.headers[tokenHeaderKey];
    const student = req.body.student;
    console.log("Courses Token:", authToken);

    try {
        const verified = db.get('users').find(user => (user.email === student)).value();
        console.log("verified", verified);

        // If the user is a student, retrieve the necessary information
        if (verified.role === "student") {
            const team_memberships = db.get("team_memberships").filter({ student_id: verified.id }).value();
            console.log("student memberships: ", team_memberships);

            // Fetch teams based on team IDs in memberships
            const team_ids = team_memberships.map(membership => membership.team_id);
            const team_list = db.get('teams').filter(team => team_ids.includes(team.id)).value();
            console.log('student team list: ', team_list);

            // Fetch teammates
            const teammates_student_ids = db.get("team_memberships").filter(membership => team_ids.includes(membership.team_id)).map(membership => membership.student_id).value();
            console.log("Peers' memberships: ", teammates_student_ids);
            const teammates = db.get("users").filter(user => teammates_student_ids.includes(user.id)).value();
            console.log("Peers: ", teammates);

            // Fetch courses based on course IDs in teams
            const course_ids = team_list.map(team => team.course_id);
            const course_list = db.get('courses').filter(course => course_ids.includes(course.id)).value();
            console.log('student course list: ', course_list);

            // Fetch organizations based on organization IDs in courses
            const organization_ids = course_list.map(course => course.organization_id);
            const organizations_list = db.get('organizations').filter(org => organization_ids.includes(org.id)).value();
            console.log('student org list: ', organizations_list);

            return res.status(200).json({
                message: "success",
                organization_info: organizations_list, // Full list of organization objects
                course_info: course_list,              // Full list of course objects
                team_info: team_list,                  // Full list of team objects
                membership_info: team_memberships,     // Full list of team membership objects
                peers_info: teammates,
            });
        }

        // If the role is neither student nor instructor, return an error
        return res.status(403).json({ message: "Access forbidden: invalid role" });

    } catch (error) {
        return res.status(401).json({ message: "Invalid token", error });
    }
});

app.post("/create-student", async (req, res) => {
    const { student_id, student_email, first_name, last_name, organization_id, new_org_name } = req.body;
    try {
        // Create new organization if needed
        let final_org_id = organization_id;
        if (new_org_name) {
            final_org_id = uuidv4();
            db.get('organizations').push({ id: final_org_id, name: new_org_name }).write();
        }

        // Hash password
        const account_password = student_email;
        const hashed_password = await bcrypt.hash(account_password, 10);

        // Add the new student
        const new_student = { id: student_id, email: student_email, password: hashed_password, role: "student", name: first_name + " " + last_name, organization_id: final_org_id };
        db.get("users").push(new_student).write();

        res.status(200).json({ message: "New student created successfully" });
    } catch (error) {
        console.error("Error creating new student:", error);
        res.status(500).json({ message: "Error creating new user" });
    }
});

app.post('/create-team', (req, res) => {
    const { organization_id, new_org_name, course_id, new_course_name, team_name, max_size, instructor_id, selected_students } = req.body;

    try {
        // Step 1: Add new organization if needed
        let final_org_id = organization_id;
        if (new_org_name) {
            final_org_id = uuidv4();
            db.get('organizations').push({ id: final_org_id, name: new_org_name }).write();
        }

        // Step 2: Add new course if needed
        let final_course_id = course_id;
        if (new_course_name) {
            final_course_id = uuidv4();
            db.get('courses').push({ id: final_course_id, name: new_course_name, instructor_id, organization_id: final_org_id }).write();
        }

        // Step 3: Add the new team
        const new_team = { id: uuidv4(), name: team_name, max_size, course_id: final_course_id, instructor_id };
        db.get('teams').push(new_team).write();

        // Step 4: Add students to the team
        selected_students.forEach((student_id) => {
            const membership = { id: uuidv4(), team_id: new_team.id, student_id };
            db.get('team_memberships').push(membership).write();
        });

        res.status(200).json({ message: "Team created successfully" });
    } catch (error) {
        console.error("Error creating team:", error);
        res.status(500).json({ message: "Error creating team" });
    }
});

app.post("/import-student-csv", async (req, res) => {
    console.log("Received data:", req.body);
    const instructor_email = req.body.instructor;
    const data = req.body.students;

    try {
        const errors = [];
        for (const student of data) {

            const { student_id, student_email, name, course_name, team_name, org_name } = student;
            console.log(student);
            // Check database for organization name
            let organization = db.get("organizations").find((org) => org.name === org_name).value();

            if (!organization) {
                // Add new organization to database if it doesn’t exist
                organization = { id: uuidv4(), name: org_name };
                db.get("organizations").push(organization).write();
            }

            // Check if student already exists
            const student_matched = db.get("users").find((user) => user.role === "student" && user.id === student_id).value();
            if (student_matched) {
                errors.push(`Student: ${name} with ID ${student_id} already exists`);
                continue;
            }

            if (!student_email) {
                console.error("Missing student_email for student:", student_matched);
                errors.push(`Email is required for student ${name || student_id}`);
                continue;
            }
            // Hash password
            const account_password = student_email;
            const hashed_password = await bcrypt.hash(account_password, 10);

            // Add new student
            db.get("users")
                .push({
                    id: student_id,
                    email: student_email,
                    password: hashed_password,
                    role: "student",
                    name: name,
                    organization_id: organization.id
                })
                .write();

            // Check for course
            let course = db.get("courses").find((course) => course.name === course_name && course.organization_id === organization.id).value();
            if (!course) {
                course = { id: uuidv4(), name: course_name, instructor_id: instructor_email, organization_id: organization.id };
                db.get("courses").push(course).write();
            }

            // Check for team
            let team = db.get("teams").find((team) => team.name === team_name && team.course_id === course.id).value();
            if (!team) {
                team = { id: uuidv4(), name: team_name, course_id: course.id, instructor_id: instructor_email, max_size: 5 };
                db.get("teams").push(team).write();
            }

            // Add student to team if not at max capacity
            const team_membership = db.get("team_memberships").filter((membership) => membership.team_id === team.id).value();
            if (team_membership.length < team.max_size) {
                db.get("team_memberships")
                    .push({ id: uuidv4(), team_id: team.id, student_id: student_id })
                    .write();
            } else {
                errors.push(`Team: ${team_name} is already at max limit`);
            }
        }
        if (errors.length > 0) {
            res.status(400).json({ message: "Some students could not be added", errors });
        } else {
            res.status(200).json({ message: "All students created and added to teams successfully" });
        }
    } catch (error) {
        console.error("Error creating new student:", error);
        res.status(500).json({ message: "Error creating new user" });
    }
});

app.get("/users", (req, res) => {
    console.log("GET /users endpoint hit");
    const tokenHeaderKey = "jwt-token";
    const authToken = req.headers[tokenHeaderKey];

    try {
        // Verify JWT token and extract user role
        const verified = jwt.verify(authToken, jwtSecretKey);

        // Fetch all users from the database
        const allUsers = db.get("users").value();

        // Filter out students from all users
        const students = allUsers.filter(user => user.role === 'student');
        console.log("Students:", students);

        if (verified.role === "instructor" || verified.role === "student") {
            const allUsers = db.get("users").value();
            const students = allUsers.filter(user => user.role === 'student');
            console.log("bowser", students);
            return res.status(200).json({ message: "success", data: students });
        }
        // Anonymize student data if the requester is a student
        if (verified.role === "student") {
            console.log("Anonymizing data for student requester...");
            students.forEach(student => {
                student.name = anonymizeData(student.name); // Anonymize student name
                student.email = anonymizeData(student.email); // Anonymize student email
            });
        }

        // If the role is neither student nor instructor, return an error
        return res.status(403).json({ message: "Access forbidden: invalid role" });

    } catch (error) {
        return res.status(401).json({ message: "Invalid token", error });
    }
});

app.post('/get-student-feedback', (req, res) => {
    const selected_student_id = req.body.student.id;
    console.log("DJ KHALED ID: ", selected_student_id);
    try {
        const feedbacks = db.get("peer_evaluations").value();
        const student_feedbacks = feedbacks.filter(feedback => feedback.evaluatee_id === selected_student_id);
        console.log('DJ KHALED FEEDBACK SENT: ', feedbacks);
        return res.status(200).json({ message: 'success', feedbacks: student_feedbacks });

    } catch (error) {
        return res.status(401).json({ message: "Invalid token", error });
    }
})

// Endpoint to edit student information
app.post("/edit-student", (req, res) => {
    const { studentData, selectedStudent } = req.body;
    console.log("selected_student", selectedStudent);
    console.log("student_data", studentData);

    if (!selectedStudent.id) {
        return res.status(400).json({ message: "Student ID is required" });
    }

    const oldId = selectedStudent.id;


    try {
        // Find the student by ID
        const student = db.get("users").find({ id: oldId }).value();

        if (!student) {
            return res.status(404).json({ message: "Student not found" });
        }

        // Update the student information
        db.get("users")
            .find({ id: oldId }) // Find by the old ID
            .assign({
                id: studentData.student_id, // Update to the new ID
                email: studentData.student_email, // Update email
                name: studentData.first_name + " " + studentData.last_name, // Update name
            })
            .write();

        //Update membership data
        db.get("team_memberships")
            .filter({ student_id: oldId }) // Find by the old ID
            .each((membership) => {
                membership.student_id = studentData.student_id; // Update to the new student ID
            })
            .write();

        res.status(200).json({ message: "Student updated successfully" });
    } catch (error) {
        console.error("Error updating student:", error);
        res.status(500).json({ message: "Internal Server Error", error });
    }
});

app.post("/edit-team", (req, res) => {
    const { teamData, selectedTeam } = req.body;

    const team_id = selectedTeam?.id;

    if (!team_id) {
        return res.status(400).json({ message: "No Team" });
    }

    try {
        // Find the team by ID
        const team = db.get("teams").find({ id: team_id }).value();

        if (!team) {
            console.error(`Error: Team with ID ${team_id} not found.`);
            return res.status(404).json({ message: "Team not found" });
        }

        if (!teamData?.team_name || typeof teamData.team_name !== "string") {
            console.error("Error: Invalid team name provided.");
            return res.status(400).json({ message: "Invalid Team Name" });
        }

        // Update the team information
        db.get("teams")
            .find({ id: team_id })
            .assign({
                name: teamData.team_name,
                max_size: teamData.max_size,
            })
            .write();

        console.log(`Team with ID ${team_id} updated successfully.`);

        // Get current team memberships (IDs) and resolve to names
        const currentMemberships = db.get("team_memberships").filter({ team_id }).map("student_id").value();
        const currentStudents = db.get("users")
            .filter((user) => currentMemberships.includes(user.id))
            .map("name")
            .value();

        // Determine additions and deletions
        if (Array.isArray(teamData.selected_students)) {
            const newStudentNames = teamData.selected_students; // New student names
            const studentsToAdd = newStudentNames.filter((studentName) => !currentStudents.includes(studentName));
            const studentsToRemove = currentStudents.filter((studentName) => !newStudentNames.includes(studentName));

            // Resolve names to IDs for addition and removal
            const studentsToAddIds = db
                .get("users")
                .filter((user) => studentsToAdd.includes(user.name))
                .map("id")
                .value();
            const studentsToRemoveIds = db
                .get("users")
                .filter((user) => studentsToRemove.includes(user.name))
                .map("id")
                .value();

            // Add new students to the team
            studentsToAddIds.forEach((studentId) => {
                db.get("team_memberships")
                    .push({ id: uuidv4(), team_id, student_id: studentId })
                    .write();
            });

            // Remove students no longer in the team
            studentsToRemoveIds.forEach((studentId) => {
                db.get("team_memberships")
                    .remove({ team_id, student_id: studentId })
                    .write();
            });
        }

        res.status(200).json({ message: "Team updated successfully" });
    } catch (error) {
        console.error("Error updating team:", error);
        res.status(500).json({ message: "Internal Server Error", error });
    }
});

app.post("/delete-student", (req, res) => {
    const { studentId } = req.body;

    if (!studentId) {
        return res.status(400).json({ message: "Student ID is required" });
    }

    try {
        // Remove the student
        db.get("users").remove({ id: studentId }).write();

        // Remove any memberships associated with this student
        db.get("team_memberships").remove({ student_id: studentId }).write();

        return res.status(200).json({ message: "Student deleted successfully" });
    } catch (error) {
        console.error("Error deleting student:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

app.post("/delete-team", (req, res) => {
    const { teamId } = req.body;

    if (!teamId) {
        return res.status(400).json({ message: "Team ID is required" });
    }

    try {
        // Find and delete the team
        const team = db.get("teams").find({ id: teamId }).value();
        if (!team) {
            return res.status(404).json({ message: "Team not found" });
        }

        db.get("teams").remove({ id: teamId }).write();

        // Optionally, remove related memberships or references
        db.get("team_memberships").remove({ team_id: teamId }).write();

        res.status(200).json({ message: "Team deleted successfully" });
    } catch (error) {
        console.error("Error deleting team:", error);
        res.status(500).json({ message: "Internal Server Error", error });
    }
});



app.post('/get-feedback-records', (req, res) => {
    const course = req.body.course;
    console.log("Course received:", course);
    const results = [];

    try {
        // Get all teams for the specified course
        const teams = db.get('teams')
            .filter((team) => course.id.includes(team.course_id))
            .value();
        console.log("Teams for the specified course:", teams);

        // Loop through each team and calculate the unique evaluators
        teams.forEach((team) => {
            console.log("Processing team:", team);

            const unique_evaluators = new Set(
                db.get('peer_evaluations')
                    .filter(evaluation => evaluation.team_id === team.id)
                    .map(evaluation => evaluation.evaluator_id)
                    .value()
            );
            console.log("Unique evaluators for team", team.name, ":", unique_evaluators);

            const team_size = new Set(
                db.get('team_memberships')
                    .filter(membership => membership.team_id === team.id)
                    .map(membership => membership.student_id)
                    .value()
            ).size;
            console.log("Team size for team", team.name, ":", team_size);

            // Add team name, team size, and number of unique feedbacks to the results array
            results.push({ name: team.name, size: team_size, numberOfFeedbacks: unique_evaluators.size });
        });

        console.log("Final results:", results);

        // Send the results as JSON response
        res.status(200).json({ message: 'success', results });

    } catch (error) {
        console.error("Error occurred:", error);
        return res.status(500).json({ message: "Invalid input", error });
    }
});

app.post('/get-student-peers', (req, res) => {
    const feedbacks = req.body;
    console.log("DJ KHALED LOGGING: ", feedbacks);
    const peer_ids = feedbacks.map(feedback => feedback.evaluator_id);
    console.log("DJ KHALED IDDD: ", peer_ids);
    try {
        const students = db.get("users").filter((user) => (user.role === 'student' && peer_ids.includes(user.id))).value();
        console.log('DJ KHALED FEEDBACK SENT??????: ', students);
        return res.status(200).json({ message: 'success', peers: students });

    } catch (error) {
        return res.status(401).json({ message: "Invalid token", error });
    }
})

// Middleware function to check user role
const authorizeRole = (role) => {
    return (req, res, next) => {
        // Assuming req.user is set after authentication
        if (!req.user) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        if (req.user.role !== role) {
            return res.status(403).json({ message: 'Forbidden: Insufficient role' });
        }

        next(); // User has the correct role, proceed to the route handler
    };
};

module.exports = { authorizeRole };


// Protected route for instructor dashboard
app.get('/api/instructor-dashboard', authorizeRole('Instructor'), (req, res) => {
    res.status(200).json({ message: 'Instructor dashboard data' });
});

// Protected route for creating teams
app.post('/api/create-team', authorizeRole('Instructor'), (req, res) => {
    // Logic for creating a team
    res.status(200).send('Team created successfully');
});
// Protected route for student dashboard
app.get('/api/student-dashboard', authorizeRole('Student'), (req, res) => {
    res.status(200).json({ message: 'Student dashboard data' });
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

        const newTeam = { id: Date.now().toString(), name, instructorId, maxSize, courseId, students: [] }; // You can change `Date.now()` to a random number generator if preferred
        db.get("teams").push(newTeam).write();

        res.status(201).json({ message: "Team created successfully", team: newTeam });
    }).catch((error) => {
        res.status(500).json({ message: "Error creating team", error });
    });
});


// API to get a specific team by ID
app.get("/teams/:id", (req, res) => {
    const teamId = req.params.id;

    // Find the team by its ID
    const team = db.get("teams").find({ id: teamId }).value();
    if (!team) {
        return res.status(404).json({ message: "Team not found" });
    }

    // Return the team details
    return res.status(200).json({ message: "success", team });
});


// API to add a student to a team
app.post("/teams/:id/students", (req, res) => {
    const teamId = req.params.id;
    const { studentId, email } = req.body;

    // Find the team
    const team = db.get("teams").find({ id: teamId }).value();
    if (!team) {
        return res.status(404).json({ message: "Team not found" });
    }

    // Check if team is full
    const teamMemberships = db.get("team_memberships").filter({ team_id: teamId }).value();
    if (teamMemberships.length >= team.max_size) {
        return res.status(400).json({ message: "Team is full" });
    }

    // Check if the student is registered
    const registeredStudent = db.get("users").find({ email }).value();
    if (!registeredStudent) {
        console.warn(`Warning: Student ${email} is not registered in the database.`);
    }

    // Create a new team membership
    const newMembership = { id: `tm${Date.now()}`, team_id: teamId, student_id: studentId };
    db.get("team_memberships").push(newMembership).write();

    res.status(201).json({
        message: "Student added to team",
        membership: newMembership,
        warning: registeredStudent ? null : "Warning: Student is not registered in the database."
    });
});

app.post('/submit-evaluation', (req, res) => {
    const {
        evaluator_id,
        evaluatee_id,
        cooperation,
        conceptualContribution,
        practicalContribution,
        workEthic,
        cooperationComment,
        conceptualComment,
        practicalComment,
        ethicComment,
        team_id
    } = req.body;


    if (!evaluator_id || !evaluatee_id) {
        return res.status(400).send({ message: "Evaluator and evaluatee IDs are required." });
    }

    // Check for existing evaluation
    const existingEvaluation = db.get('peer_evaluations')
        .find({ evaluator_id, evaluatee_id, team_id })
        .value();

    if (existingEvaluation) {
        return res.status(400).json({ message: "Evaluation already exists for this teammate in the same team." });
    }

    try {
        const id = db.get('peer_evaluations').size().value() + 1;

        db.get('peer_evaluations')
            .push({
                id,
                evaluator_id,
                evaluatee_id,
                cooperation: parseInt(cooperation),
                conceptual_contribution: parseInt(conceptualContribution),
                practical_contribution: parseInt(practicalContribution),
                work_ethic: parseInt(workEthic),
                cooperation_comment: cooperationComment || "No comment",
                conceptual_comment: conceptualComment || "No comment",
                practical_comment: practicalComment || "No comment",
                ethic_comment: ethicComment || "No comment",
                team_id,
                timestamp: new Date().toISOString()
            })
            .write();

        res.status(200).json({ message: 'success' });
    } catch (error) {
        console.error("Error submitting evaluation:", error);
        res.status(500).json({ message: "Internal Server Error", error });
    }
});


app.get("/peer-evaluations/check", (req, res) => {
    const { evaluator_id, evaluatee_id, team_id } = req.query;

    if (!evaluator_id || !evaluatee_id || !team_id) {
        return res.status(400).json({ message: "Evaluator ID, evaluatee ID, and team ID are required." });
    }

    console.log("Received query:", req.query); // Log the incoming query

    // Find the evaluation that matches the evaluator_id, evaluatee_id, and team_id
    const evaluation = db.get("peer_evaluations")
        .find({ evaluator_id, evaluatee_id, team_id })
        .value();

    // Log the evaluation result
    console.log("Evaluation found:", evaluation);

    // Check if evaluation exists
    if (evaluation) {
        return res.status(200).json({ hasFeedback: true });
    } else {
        return res.status(200).json({ hasFeedback: false });
    }
});

app.get("/peer-evaluations/feedback", (req, res) => {
    const { teamId } = req.query;

    if (!teamId) {
        return res.status(400).json({ message: "Team ID is required" });
    }

    // Filter peer evaluations for the specified teamId
    const feedbackData = db.get("peer_evaluations")
        .filter({ team_id: teamId })
        .value();

    if (feedbackData && feedbackData.length > 0) {
        return res.status(200).json({ message: "success", data: feedbackData });
    } else {
        return res.status(404).json({ message: "No peer feedback found" });
    }
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


// Create a new roster
app.post('/rosters', (req, res) => {
    const { teamID, courseName } = req.body;

    const newRoster = {
        rosterID: uuidv4(),
        teamID,
        courseName
    };

    db.get('rosters').push(newRoster).write();  // Store the roster in the database
    res.status(201).send(newRoster);  // Send the created roster as a response
});
// Store a score for a team
// Example in a POST request
app.post('/scores', (req, res) => {
    const { teamID, score } = req.body;

    if (!teamID) {
        return res.status(400).json({ message: "teamID is required" });
    }

    const newScore = {
        scoreID: uuidv4(),
        teamID,
        score,
        date: new Date().toISOString()
    };

    db.get('scores').push(newScore).write();
    res.status(201).send(newScore);
});
// Start server
app.listen(3080, () => {
    console.log("Server running on port 3080");
});
