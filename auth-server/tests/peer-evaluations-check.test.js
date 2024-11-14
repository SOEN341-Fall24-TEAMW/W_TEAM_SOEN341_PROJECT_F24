const request = require("supertest");
const express = require("express");

// Mock database setup
const db = {
  get: jest.fn().mockReturnThis(),
  find: jest.fn().mockReturnThis(),
  value: jest.fn(),
};

// Create the Express app
const app = express();
app.get("/peer-evaluations/check", (req, res) => {
  const { evaluator_id, evaluatee_id, team_id } = req.query;

  if (!evaluator_id || !evaluatee_id || !team_id) {
    return res.status(400).json({ message: "Evaluator ID, evaluatee ID, and team ID are required." });
  }

  // Mocked database query
  const evaluation = db.get("peer_evaluations").find({ evaluator_id, evaluatee_id, team_id }).value();

  if (evaluation) {
    return res.status(200).json({ hasFeedback: true });
  } else {
    return res.status(200).json({ hasFeedback: false });
  }
});

// Test Suite
describe("GET /peer-evaluations/check", () => {
  test("should return hasFeedback: true if evaluation exists", async () => {
    // Mock the database response to simulate an existing evaluation
    db.get.mockReturnThis();
    db.find.mockReturnThis();
    db.value.mockReturnValue({ evaluator_id: "e1", evaluatee_id: "e2", team_id: "t1" });

    const response = await request(app).get("/peer-evaluations/check").query({
      evaluator_id: "e1",
      evaluatee_id: "e2",
      team_id: "t1",
    });

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ hasFeedback: true });
  });

  test("should return hasFeedback: false if evaluation does not exist", async () => {
    // Mock the database response to simulate a non-existing evaluation
    db.get.mockReturnThis();
    db.find.mockReturnThis();
    db.value.mockReturnValue(null);

    const response = await request(app).get("/peer-evaluations/check").query({
      evaluator_id: "e1",
      evaluatee_id: "e3",
      team_id: "t1",
    });

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ hasFeedback: false });
  });

  test("should return 400 if required query parameters are missing", async () => {
    const response = await request(app).get("/peer-evaluations/check").query({
      evaluator_id: "e1",
    });

    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      message: "Evaluator ID, evaluatee ID, and team ID are required.",
    });
  });
});
