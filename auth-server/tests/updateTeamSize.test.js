const express = require("express");
const bodyParser = require("body-parser");
const request = require("supertest");

// Mock database
const mockDb = {
    teams: [
        { id: "team1", maxSize: 5 },
        { id: "team2", maxSize: 10 },
    ],
    get(collection) {
        return {
            find: (predicate) => ({
                assign: (newData) => ({
                    write: () => {
                        const item = this[collection].find(predicate);
                        Object.assign(item, newData);
                        return item;
                    },
                }),
            }),
        };
    },
};

// Middleware to simulate `isInstructor`
const isInstructor = (req, res, next) => {
    if (req.headers["role"] === "instructor") {
        return next();
    }
    return res.status(403).json({ message: "Forbidden: Not an instructor" });
};

// Express app
const app = express();
app.use(bodyParser.json());

app.put("/teams/:id/size", isInstructor, (req, res) => {
    const teamId = req.params.id;
    const { newSize } = req.body;

    mockDb.get("teams").find((team) => team.id === teamId).assign({ maxSize: newSize }).write();

    res.status(200).json({ message: "Team size updated successfully" });
});

// Tests
describe("PUT /teams/:id/size", () => {
    it("should update the team size successfully for an instructor", async () => {
        const response = await request(app)
            .put("/teams/team1/size")
            .set("role", "instructor") // Simulate instructor role
            .send({ newSize: 8 });

        expect(response.status).toBe(200);
        expect(response.body.message).toBe("Team size updated successfully");
        const updatedTeam = mockDb.teams.find((team) => team.id === "team1");
        expect(updatedTeam.maxSize).toBe(8);
    });

    it("should return 403 if the user is not an instructor", async () => {
        const response = await request(app)
            .put("/teams/team1/size")
            .set("role", "student") // Simulate non-instructor role
            .send({ newSize: 8 });

        expect(response.status).toBe(403);
        expect(response.body.message).toBe("Forbidden: Not an instructor");
    });
});
