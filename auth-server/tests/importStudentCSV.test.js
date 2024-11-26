const express = require("express");
const bodyParser = require("body-parser");
const request = require("supertest");
const bcrypt = require("bcrypt");
const { v4: uuidv4 } = require("uuid");

// Mock database
const db = {
    data: {
        users: [],
        organizations: [],
        courses: [],
        teams: [],
        team_memberships: [],
    },
    get: function (collection) {
        return {
            find: (predicate) => ({
                value: () => this.data[collection].find(predicate),
            }),
            filter: (predicate) => ({
                value: () => this.data[collection].filter(predicate),
            }),
            push: (item) => ({
                write: () => this.data[collection].push(item),
            }),
        };
    },
};

// Express app setup
const app = express();
app.use(bodyParser.json());

app.post("/import-student-csv", async (req, res) => {
    const instructor_email = req.body.instructor;
    const data = req.body.students;

    try {
        const errors = [];
        for (const student of data) {
            const { student_id, student_email, name, course_name, team_name, org_name } = student;

            let organization = db.get("organizations").find((org) => org.name === org_name).value();
            if (!organization) {
                organization = { id: uuidv4(), name: org_name };
                db.get("organizations").push(organization).write();
            }

            const student_matched = db.get("users").find((user) => user.role === "student" && user.id === student_id).value();
            if (student_matched) {
                errors.push(`Student: ${name} with ID ${student_id} already exists`);
                continue;
            }

            if (!student_email) {
                errors.push(`Email is required for student ${name || student_id}`);
                continue;
            }

            const hashed_password = await bcrypt.hash(student_email, 10);

            db.get("users")
                .push({
                    id: student_id,
                    email: student_email,
                    password: hashed_password,
                    role: "student",
                    name: name,
                    organization_id: organization.id,
                })
                .write();

            let course = db.get("courses").find((course) => course.name === course_name && course.organization_id === organization.id).value();
            if (!course) {
                course = { id: uuidv4(), name: course_name, instructor_id: instructor_email, organization_id: organization.id };
                db.get("courses").push(course).write();
            }

            let team = db.get("teams").find((team) => team.name === team_name && team.course_id === course.id).value();
            if (!team) {
                team = { id: uuidv4(), name: team_name, course_id: course.id, instructor_id: instructor_email, max_size: 5 };
                db.get("teams").push(team).write();
            }

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
        console.error("Error during token verification:", error.message);
        res.status(500).json({ message: "Error creating new user" });
    }
});

// Tests
describe("POST /import-student-csv", () => {
    beforeEach(() => {
        // Reset mock database
        db.data = {
            users: [],
            organizations: [],
            courses: [],
            teams: [],
            team_memberships: [],
        };
    });

    it("should import students and create new records", async () => {
        const response = await request(app)
            .post("/import-student-csv")
            .send({
                instructor: "instructor@example.com",
                students: [
                    {
                        student_id: "s1",
                        student_email: "student1@example.com",
                        name: "Student One",
                        course_name: "Course 1",
                        team_name: "Team A",
                        org_name: "Organization One",
                    },
                ],
            });

        expect(response.status).toBe(200);
        expect(response.body.message).toBe("All students created and added to teams successfully");
        expect(db.data.users).toHaveLength(1);
        expect(db.data.teams).toHaveLength(1);
    });

    it("should return errors for students with missing email", async () => {
        const response = await request(app)
            .post("/import-student-csv")
            .send({
                instructor: "instructor@example.com",
                students: [
                    {
                        student_id: "s2",
                        name: "Student Two",
                        course_name: "Course 2",
                        team_name: "Team B",
                        org_name: "Organization Two",
                    },
                ],
            });

        expect(response.status).toBe(400);
        expect(response.body.message).toBe("Some students could not be added");
        expect(response.body.errors).toContain("Email is required for student Student Two");
    });

    it("should return errors for duplicate students", async () => {
        db.data.users.push({
            id: "s3",
            email: "student3@example.com",
            password: "hashedpassword",
            role: "student",
            name: "Student Three",
            organization_id: "org1",
        });

        const response = await request(app)
            .post("/import-student-csv")
            .send({
                instructor: "instructor@example.com",
                students: [
                    {
                        student_id: "s3",
                        student_email: "student3@example.com",
                        name: "Student Three",
                        course_name: "Course 3",
                        team_name: "Team C",
                        org_name: "Organization Three",
                    },
                ],
            });

        expect(response.status).toBe(400);
        expect(response.body.errors).toContain("Student: Student Three with ID s3 already exists");
    });
});
