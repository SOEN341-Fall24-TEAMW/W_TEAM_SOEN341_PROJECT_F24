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

// Mock route handler for /submit-evaluation
app.post("/submit-evaluation", (req, res) => {
    const {
        evaluator_id,
        evaluatee_id,
        cooperation,
        conceptualContribution,
        practicalContribution,
        workEthic,
        cooperationComment,
        conceptualComment,
        practicalComment,
        ethicComment,
        team_id,
    } = req.body;

    if (!evaluator_id || !evaluatee_id) {
        return res.status(400).send({ message: "Evaluator and evaluatee IDs are required." });
    }

    try {
        const existingEvaluation = mockDb.get("peer_evaluations")
            .find({ evaluator_id, evaluatee_id, team_id })
            .value();

        if (existingEvaluation) {
            return res.status(400).json({ message: "Evaluation already exists for this teammate in the same team." });
        }

        const id = mockDb.get("peer_evaluations").size().value() + 1;
        mockDb.get("peer_evaluations")
            .push({
                id,
                evaluator_id,
                evaluatee_id,
                cooperation: parseInt(cooperation),
                conceptual_contribution: parseInt(conceptualContribution),
                practical_contribution: parseInt(practicalContribution),
                work_ethic: parseInt(workEthic),
                cooperation_comment: cooperationComment || "No comment",
                conceptual_comment: conceptualComment || "No comment",
                practical_comment: practicalComment || "No comment",
                ethic_comment: ethicComment || "No comment",
                team_id,
                timestamp: new Date().toISOString(),
            })
            .write();

        res.status(200).json({ message: "success" });
    } catch (error) {
        console.error("Error submitting evaluation:", error);
        res.status(500).json({ message: "Internal Server Error", error });
    }
});

// Tests
describe("POST /submit-evaluation", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test("should add a new evaluation successfully", async () => {
        mockDb.get.mockReturnValue({
            find: () => ({
                value: () => null,
            }),
            size: () => ({
                value: () => 0,
            }),
            push: jest.fn(() => ({
                write: jest.fn(),
            })),
        });

        const evaluationData = {
            evaluator_id: "e1",
            evaluatee_id: "e2",
            cooperation: 5,
            conceptualContribution: 4,
            practicalContribution: 5,
            workEthic: 5,
            cooperationComment: "Great teamwork",
            conceptualComment: "Good understanding",
            practicalComment: "Excellent execution",
            ethicComment: "Hard worker",
            team_id: "team1",
        };

        const response = await request(app)
            .post("/submit-evaluation")
            .send(evaluationData)
            .expect(200);

        expect(response.body.message).toBe("success");
    });

    test("should return error if evaluator_id or evaluatee_id is missing", async () => {
        const evaluationData = {
            conceptualContribution: 4,
            practicalContribution: 5,
            workEthic: 5,
            team_id: "team1",
        };

        const response = await request(app)
            .post("/submit-evaluation")
            .send(evaluationData)
            .expect(400);

        expect(response.body.message).toBe("Evaluator and evaluatee IDs are required.");
    });

    test("should return error if evaluation already exists", async () => {
        mockDb.get.mockReturnValue({
            find: () => ({
                value: () => ({ id: 1 }),
            }),
        });

        const evaluationData = {
            evaluator_id: "e1",
            evaluatee_id: "e2",
            cooperation: 5,
            conceptualContribution: 4,
            practicalContribution: 5,
            workEthic: 5,
            cooperationComment: "Great teamwork",
            conceptualComment: "Good understanding",
            practicalComment: "Excellent execution",
            ethicComment: "Hard worker",
            team_id: "team1",
        };

        const response = await request(app)
            .post("/submit-evaluation")
            .send(evaluationData)
            .expect(400);

        expect(response.body.message).toBe("Evaluation already exists for this teammate in the same team.");
    });

    test("should handle server errors gracefully", async () => {
        const evaluationData = {
            evaluator_id: "e1",
            evaluatee_id: "e2",
            cooperation: 5,
            conceptualContribution: 4,
            practicalContribution: 5,
            workEthic: 5,
            cooperationComment: "Great teamwork",
            conceptualComment: "Good understanding",
            practicalComment: "Excellent execution",
            ethicComment: "Hard worker",
            team_id: "team1",
        };

        // Simulate a database error
        const originalGet = mockDb.get; // Backup original function
        mockDb.get = () => { throw new Error("Database error"); };

        const response = await request(app)
            .post("/submit-evaluation")
            .send(evaluationData)
            .expect(500);

        expect(response.body.message).toBe("Internal Server Error");
        expect(response.body.error).toBeDefined();

        // Restore original function
        mockDb.get = originalGet;
    });
});
