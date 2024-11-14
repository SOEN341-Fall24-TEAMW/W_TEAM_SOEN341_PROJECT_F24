const request = require("supertest");
const express = require("express");
const bodyParser = require("body-parser");

// Mock database
const mockDb = {
    get: jest.fn(),
    write: jest.fn(),
};

// Mock application
const app = express();
app.use(bodyParser.json());

// Mock route handler for /teams/:id/students
app.post("/teams/:id/students", (req, res) => {
    const teamId = req.params.id;
    const { studentId, name, email } = req.body;

    // Find the team
    const team = mockDb.get("teams").find({ id: teamId }).value();
    if (!team) {
        return res.status(404).json({ message: "Team not found" });
    }

    // Check if team is full
    const teamMemberships = mockDb.get("team_memberships").filter({ team_id: teamId }).value();
    if (teamMemberships.length >= team.max_size) {
        return res.status(400).json({ message: "Team is full" });
    }

    // Check if the student is registered
    const registeredStudent = mockDb.get("users").find({ email }).value();
    if (!registeredStudent) {
        console.warn(`Warning: Student ${email} is not registered in the database.`);
    }

    // Create a new team membership
    const newMembership = { id: `tm${Date.now()}`, team_id: teamId, student_id: studentId };
    mockDb.get("team_memberships").push(newMembership).write();

    res.status(201).json({
        message: "Student added to team",
        membership: newMembership,
        warning: registeredStudent ? null : "Warning: Student is not registered in the database.",
    });
});

// Tests
describe("POST /teams/:id/students", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test("should add a student to the team successfully", async () => {
        const teamId = "team1";
        const studentId = "student1";
        const email = "student1@example.com";

        mockDb.get.mockImplementation((collection) => {
            const data = {
                teams: [{ id: teamId, max_size: 3 }],
                team_memberships: [{ team_id: teamId }],
                users: [{ email }],
            };
            return {
                find: (query) => ({
                    value: () => data[collection].find((item) => Object.keys(query).every((key) => item[key] === query[key])),
                }),
                filter: (query) => ({
                    value: () => data[collection].filter((item) => Object.keys(query).every((key) => item[key] === query[key])),
                }),
                push: jest.fn(() => ({
                    write: jest.fn(),
                })),
            };
        });

        const response = await request(app)
            .post(`/teams/${teamId}/students`)
            .send({ studentId, email })
            .expect(201);

        expect(response.body.message).toBe("Student added to team");
        expect(response.body.membership).toHaveProperty("id");
        expect(response.body.membership).toMatchObject({ team_id: teamId, student_id: studentId });
    });

    test("should return an error if the team is not found", async () => {
        mockDb.get.mockImplementation(() => ({
            find: () => ({ value: () => null }),
        }));

        const response = await request(app)
            .post("/teams/nonexistent-team/students")
            .send({ studentId: "student1", email: "student1@example.com" })
            .expect(404);

        expect(response.body.message).toBe("Team not found");
    });

    test("should return an error if the team is full", async () => {
        const teamId = "team1";

        mockDb.get.mockImplementation((collection) => {
            const data = {
                teams: [{ id: teamId, max_size: 2 }],
                team_memberships: [{ team_id: teamId }, { team_id: teamId }],
            };
            return {
                find: (query) => ({
                    value: () => data[collection].find((item) => Object.keys(query).every((key) => item[key] === query[key])),
                }),
                filter: (query) => ({
                    value: () => data[collection].filter((item) => Object.keys(query).every((key) => item[key] === query[key])),
                }),
            };
        });

        const response = await request(app)
            .post(`/teams/${teamId}/students`)
            .send({ studentId: "student1", email: "student1@example.com" })
            .expect(400);

        expect(response.body.message).toBe("Team is full");
    });

    test("should add student with a warning if they are not registered", async () => {
        const teamId = "team1";
        const studentId = "student1";
        const email = "unregistered@example.com";

        mockDb.get.mockImplementation((collection) => {
            const data = {
                teams: [{ id: teamId, max_size: 3 }],
                team_memberships: [{ team_id: teamId }],
                users: [], // No users registered
            };
            return {
                find: (query) => ({
                    value: () => data[collection].find((item) => Object.keys(query).every((key) => item[key] === query[key])),
                }),
                filter: (query) => ({
                    value: () => data[collection].filter((item) => Object.keys(query).every((key) => item[key] === query[key])),
                }),
                push: jest.fn(() => ({
                    write: jest.fn(),
                })),
            };
        });

        const response = await request(app)
            .post(`/teams/${teamId}/students`)
            .send({ studentId, email })
            .expect(201);

        expect(response.body.message).toBe("Student added to team");
        expect(response.body.warning).toBe("Warning: Student is not registered in the database.");
    });
});
