const express = require("express");
const bodyParser = require("body-parser");
const request = require("supertest");

const app = express();
app.use(bodyParser.json());

// Mock database
const mockDb = {
    teams: [
        {
            id: "team1",
            students: [{ studentId: "student1" }, { studentId: "student2" }],
        },
    ],
};

// Middleware
const isInstructor = (req, res, next) => {
    next(); // Simulate instructor middleware for testing
};

// Endpoint to test
app.delete("/teams/:id/students/:studentId", isInstructor, (req, res) => {
    const teamId = req.params.id;
    const studentId = req.params.studentId;

    // Find the team
    const team = mockDb.teams.find((team) => team.id === teamId);
    if (!team) {
        return res.status(404).json({ message: "Team not found" });
    }

    // Remove the student
    team.students = team.students.filter((student) => student.studentId !== studentId);

    res.status(200).json({ message: "Student removed from team" });
});

// Test suite
describe("DELETE /teams/:id/students/:studentId", () => {
    test("should remove a student from a team", async () => {
        const response = await request(app)
            .delete("/teams/team1/students/student1")
            .expect(200);

        expect(response.body.message).toBe("Student removed from team");

        // Check if the student is removed
        const team = mockDb.teams.find((t) => t.id === "team1");
        expect(team.students).not.toContainEqual({ studentId: "student1" });
    });

    test("should return 404 if the team is not found", async () => {
        const response = await request(app)
            .delete("/teams/nonexistentTeam/students/student1")
            .expect(404);

        expect(response.body.message).toBe("Team not found");
    });

    test("should not fail if the student is not in the team", async () => {
        const response = await request(app)
            .delete("/teams/team1/students/nonexistentStudent")
            .expect(200);

        expect(response.body.message).toBe("Student removed from team");

        // Ensure the existing students are unchanged
        const team = mockDb.teams.find((t) => t.id === "team1");
        expect(team.students).toEqual([{ studentId: "student2" }]);
    });
});
