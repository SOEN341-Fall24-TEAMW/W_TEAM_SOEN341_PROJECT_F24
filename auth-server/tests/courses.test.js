const express = require("express");
const bodyParser = require("body-parser");
const request = require("supertest");
const jwt = require("jsonwebtoken");

// Mock database
const mockDb = {
    users: [
        { id: "i1", email: "instructor1@example.com", role: "instructor" },
        { id: "s1", email: "student1@example.com", role: "student" },
    ],
    courses: [
        { id: "c1", name: "Course 1", instructor_id: "i1" },
        { id: "c2", name: "Course 2", instructor_id: "i1" },
    ],
    teams: [
        { id: "t1", course_id: "c1" },
        { id: "t2", course_id: "c2" },
    ],
    team_memberships: [
        { id: "tm1", team_id: "t1", student_id: "s1" },
    ],
};

// Mock application
const app = express();
app.use(bodyParser.json());

app.post("/courses", (req, res) => {
    //const tokenHeaderKey = "jwt-token";
    //const authToken = req.headers[tokenHeaderKey];
    const instructor = req.body.instructor;

    try {
        //const verified = jwt.verify(authToken, "mockSecretKey");

        const user = mockDb.users.find((u) => u.email === instructor);
        if (user && user.role === "instructor") {
            const courses = mockDb.courses.filter((c) => c.instructor_id === user.id);
            const courseIds = courses.map((c) => c.id);

            const teams = mockDb.teams.filter((t) => courseIds.includes(t.course_id));
            const teamIds = teams.map((t) => t.id);

            const memberships = mockDb.team_memberships.filter((m) =>
                teamIds.includes(m.team_id)
            );

            return res.status(200).json({
                message: "success",
                course_info: courses,
                team_info: teams,
                membership_info: memberships,
            });
        }

        return res.status(403).json({ message: "Access forbidden: invalid role" });
    } catch (error) {
        return res.status(401).json({ message: "Invalid token", error });
    }
});

// Test cases
describe("POST /courses", () => {
    let validToken;

    beforeAll(() => {
        // Mock valid token
        validToken = jwt.sign(
            { id: "i1", email: "instructor1@example.com", role: "instructor" },
            "mockSecretKey"
        );

        jest.spyOn(jwt, "verify").mockImplementation((token, secret) => {
            if (token === validToken && secret === "mockSecretKey") {
                return { id: "i1", email: "instructor1@example.com", role: "instructor" };
            }
            throw new Error("Invalid token");
        });
    });

    afterAll(() => {
        jest.restoreAllMocks();
    });

    test("should return courses, teams, and memberships for a valid instructor", async () => {
        const response = await request(app)
            .post("/courses")
            .set("jwt-token", validToken)
            .send({ instructor: "instructor1@example.com" });

        console.log("Response Body:", response.body); // Debugging

        expect(response.status).toBe(200);
        expect(response.body.message).toBe("success");
        expect(response.body.course_info).toHaveLength(2);
        expect(response.body.team_info).toHaveLength(2);
        expect(response.body.membership_info).toHaveLength(1);
    });

    test("should return 403 for an invalid role", async () => {
        const response = await request(app)
            .post("/courses")
            .set("jwt-token", validToken)
            .send({ instructor: "student1@example.com" });

        console.log("Response Body:", response.body); // Debugging

        expect(response.status).toBe(403);
        expect(response.body.message).toBe("Access forbidden: invalid role");
    });

    test("should return 401 for invalid token", async () => {
        const response = await request(app)
            .post("/courses")
            .set("jwt-token", "invalid-token")
            .send({ instructor: "instructor1@example.com" });

        console.log("Response Body:", response.body); // Debugging

        expect(response.status).toBe(401);
        expect(response.body.message).toBe("Invalid token");
    });
});
