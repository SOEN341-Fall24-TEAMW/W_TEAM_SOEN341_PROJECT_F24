const request = require("supertest");
const express = require("express");
const app = express();

app.use(express.json());

// Mock `assignStudentsToTeams` function
const assignStudentsToTeams = jest.fn((students, teams) => {
    const assignments = {};
    teams.forEach(team => (assignments[team] = []));
    let teamIndex = 0;
    students.forEach(student => {
        assignments[teams[teamIndex]].push(student);
        teamIndex = (teamIndex + 1) % teams.length;
    });
    return assignments;
});

// Define `/assign-random` route
app.post("/assign-random", (req, res) => {
    try {
        const { students, teams } = req.body;

        if (!students || !teams || students.length === 0 || teams.length === 0) {
            return res.status(400).json({ message: "Students or teams data missing" });
        }

        const assignments = assignStudentsToTeams(students, teams);
        res.status(200).json({ message: "Students assigned successfully", assignments });
    } catch (error) {
        console.error("Error during student assignment:", error);  // Log the error
        res.status(500).json({ message: "Internal Server Error" });
    }
});

// Tests for `/assign-random`
describe("POST /assign-random", () => {
    test("should assign students to teams successfully", async () => {
        const response = await request(app)
            .post("/assign-random")
            .send({
                students: ["Alice", "Bob", "Charlie", "Diana"],
                teams: ["Team1", "Team2"]
            });

        expect(response.status).toBe(200);
        expect(response.body.message).toBe("Students assigned successfully");
        expect(Object.keys(response.body.assignments)).toEqual(["Team1", "Team2"]);
    });

    test("should return 400 if students or teams data is missing", async () => {
        const response = await request(app)
            .post("/assign-random")
            .send({ students: [], teams: [] });

        expect(response.status).toBe(400);
        expect(response.body.message).toBe("Students or teams data missing");
    });

    test("should return 500 on server error", async () => {
        // Force the mock function to throw an error
        assignStudentsToTeams.mockImplementationOnce(() => {
            throw new Error("Mocked function failure");
        });

        const response = await request(app)
            .post("/assign-random")
            .send({
                students: ["Alice", "Bob"],
                teams: ["Team1"]
            });

        expect(response.status).toBe(500);
        expect(response.body.message).toBe("Internal Server Error");
    });
});
