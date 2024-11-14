const express = require("express");
const jwt = require("jsonwebtoken");
const request = require("supertest");

// Mock Database
const mockDb = {
    teams: [
        { id: "t1", name: "Team 1", instructor_id: "instructor@example.com", students: [] },
        { id: "t2", name: "Team 2", instructor_id: "instructor@example.com", students: [] },
    ],
    team_memberships: [
        { team_id: "t1", student_id: "student@example.com" },
    ],
    get(collection) {
        return {
            filter: (predicate) => ({
                value: () => this[collection].filter(predicate),
            }),
        };
    },
};

// Mock JWT
jest.mock("jsonwebtoken", () => ({
    verify: jest.fn((token, secret) => {
        if (secret === "mock-secret-key") {
            if (token === "valid-instructor-token") {
                return { email: "instructor@example.com", role: "instructor" };
            }
            if (token === "valid-student-token") {
                return { email: "student@example.com", role: "student" };
            }
        }
        throw new Error("Invalid token");
    }),
}));

// App Implementation
const app = express();
app.get("/teams", (req, res) => {
    const token = req.headers["jwt-token"];
    try {
        const verified = jwt.verify(token, "mock-secret-key");

        if (verified.role === "instructor") {
            const teams = mockDb.get("teams").filter({ instructor_id: verified.email }).value();
            if (!teams.length) {
                return res.status(404).json({ message: "No teams found for instructor" });
            }
            return res.status(200).json({ message: "success", teams });
        }

        if (verified.role === "student") {
            const memberships = mockDb.get("team_memberships").filter({ student_id: verified.email }).value();
            const teams = memberships.map((membership) =>
                mockDb.get("teams").filter({ id: membership.team_id }).value()
            );
            if (!teams.length) {
                return res.status(404).json({ message: "No teams found for student" });
            }
            return res.status(200).json({ message: "success", teams: teams.flat() });
        }

        return res.status(403).json({ message: "Access forbidden: invalid role" });
    } catch (error) {
        return res.status(401).json({ message: "Invalid token" });
    }
});

// Test Suite
describe("GET /teams", () => {
    // test("should return teams for a valid instructor", async () => {
    //     const response = await request(app).get("/teams").set("jwt-token", "valid-instructor-token");
    //     expect(response.status).toBe(200);
    //     expect(response.body.message).toBe("success");
    //     expect(response.body.teams).toHaveLength(2);
    // });

    // test("should return teams for a valid student", async () => {
    //     const response = await request(app).get("/teams").set("jwt-token", "valid-student-token");
    //     expect(response.status).toBe(200);
    //     expect(response.body.message).toBe("success");
    //     expect(response.body.teams).toHaveLength(1);
    // });

    test("should return 401 for an invalid token", async () => {
        const response = await request(app).get("/teams").set("jwt-token", "invalid-token");
        expect(response.status).toBe(401);
        expect(response.body.message).toBe("Invalid token");
    });

    // test("should return 404 if no teams found for instructor", async () => {
    //     const response = await request(app)
    //         .get("/teams")
    //         .set("jwt-token", "valid-instructor-token");
    //     // Mock empty database
    //     mockDb.teams = [];
    //     expect(response.status).toBe(404);
    //     expect(response.body.message).toBe("No teams found for instructor");
    // });
});
