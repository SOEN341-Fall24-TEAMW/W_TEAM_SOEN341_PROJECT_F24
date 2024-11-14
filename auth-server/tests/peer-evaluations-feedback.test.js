const express = require("express");
const bodyParser = require("body-parser");
const request = require("supertest");

// Mock Database
let peerEvaluations = [];

// Mock App
const app = express();
app.use(bodyParser.json());

app.get("/peer-evaluations/feedback", (req, res) => {
    const { teamId } = req.query;

    if (!teamId) {
        return res.status(400).json({ message: "Team ID is required" });
    }

    // Filter peer evaluations for the specified teamId
    const feedbackData = peerEvaluations.filter((evaluation) => evaluation.team_id === teamId);

    if (feedbackData && feedbackData.length > 0) {
        return res.status(200).json({ message: "success", data: feedbackData });
    } else {
        return res.status(404).json({ message: "No peer feedback found" });
    }
});

describe("GET /peer-evaluations/feedback", () => {
    beforeEach(() => {
        // Reset mock data
        peerEvaluations = [
            { id: 1, team_id: "team123", feedback: "Great job" },
            { id: 2, team_id: "team123", feedback: "Needs improvement" },
            { id: 3, team_id: "team456", feedback: "Excellent collaboration" },
        ];
    });

    test("should return feedback for a valid team ID", async () => {
        const response = await request(app).get("/peer-evaluations/feedback").query({ teamId: "team123" });

        expect(response.status).toBe(200);
        expect(response.body.message).toBe("success");
        expect(response.body.data).toHaveLength(2);
    });

    test("should return 400 if teamId is missing", async () => {
        const response = await request(app).get("/peer-evaluations/feedback");

        expect(response.status).toBe(400);
        expect(response.body.message).toBe("Team ID is required");
    });

    test("should return 404 if no feedback is found for the team ID", async () => {
        const response = await request(app).get("/peer-evaluations/feedback").query({ teamId: "team999" });

        expect(response.status).toBe(404);
        expect(response.body.message).toBe("No peer feedback found");
    });
});
