const request = require("supertest");
const express = require("express");

// Mock database
const mockDb = {
    get: jest.fn(),
};

// Mock application
const app = express();

// Mock route handler for /teams/:id
app.get("/teams/:id", (req, res) => {
    const teamId = req.params.id;

    // Find the team by its ID
    const team = mockDb.get("teams").find({ id: teamId }).value();
    if (!team) {
        return res.status(404).json({ message: "Team not found" });
    }

    // Return the team details
    return res.status(200).json({ message: "success", team });
});

// Tests
describe("GET /teams/:id", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test("should return the team details if the team exists", async () => {
        const teamId = "team1";
        const teamData = { id: teamId, name: "Team Alpha", max_size: 5 };

        mockDb.get.mockImplementation((collection) => {
            const data = {
                teams: [teamData],
            };
            return {
                find: (query) => ({
                    value: () => data[collection].find((item) => Object.keys(query).every((key) => item[key] === query[key])),
                }),
            };
        });

        const response = await request(app).get(`/teams/${teamId}`).expect(200);

        expect(response.body.message).toBe("success");
        expect(response.body.team).toEqual(teamData);
    });

    test("should return a 404 error if the team does not exist", async () => {
        const teamId = "nonexistent-team";

        mockDb.get.mockImplementation(() => ({
            find: () => ({
                value: () => null,
            }),
        }));

        const response = await request(app).get(`/teams/${teamId}`).expect(404);

        expect(response.body.message).toBe("Team not found");
    });
});
