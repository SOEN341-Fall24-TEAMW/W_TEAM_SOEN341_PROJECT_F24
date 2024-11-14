const express = require("express");
const bodyParser = require("body-parser");
const request = require("supertest");

const app = express();
app.use(bodyParser.json());

// Mock database
const mockDb = {
    teams: [
        { id: "team1", maxSize: 5 },
        { id: "team2", maxSize: 10 },
    ],
};

// Middleware
const isInstructor = (req, res, next) => {
    next(); // Simulate instructor middleware for testing
};

// Endpoint to test
app.put("/teams/:id/size", isInstructor, (req, res) => {
    const teamId = req.params.id;
    const { newSize } = req.body;

    const team = mockDb.teams.find((team) => team.id === teamId);
    if (!team) {
        return res.status(404).json({ message: "Team not found" });
    }

    team.maxSize = newSize;

    res.status(200).json({ message: "Team size updated successfully" });
});

// Test suite
describe("PUT /teams/:id/size", () => {
    test("should update the team size successfully", async () => {
        const response = await request(app)
            .put("/teams/team1/size")
            .send({ newSize: 7 })
            .expect(200);

        expect(response.body.message).toBe("Team size updated successfully");

        // Verify the size is updated in the mock database
        const team = mockDb.teams.find((t) => t.id === "team1");
        expect(team.maxSize).toBe(7);
    });

    test("should return 404 if the team is not found", async () => {
        const response = await request(app)
            .put("/teams/nonexistentTeam/size")
            .send({ newSize: 7 })
            .expect(404);

        expect(response.body.message).toBe("Team not found");
    });

    test("should handle invalid newSize input", async () => {
        const response = await request(app)
            .put("/teams/team1/size")
            .send({ newSize: null })
            .expect(200);

        expect(response.body.message).toBe("Team size updated successfully");

        // Ensure the team size is updated even with null (to simulate handling edge cases)
        const team = mockDb.teams.find((t) => t.id === "team1");
        expect(team.maxSize).toBe(null);
    });
});
