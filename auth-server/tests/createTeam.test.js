const request = require("supertest");
const express = require("express");

// Mock Express app
const app = express();
app.use(express.json());

// Mock in-memory database
let db = {
  teams: [],
};

// Mock isCourseValid function
const isCourseValid = jest.fn((courseId) => {
  return Promise.resolve(courseId === "validCourseId");
});

// Mock middleware
const isInstructor = (req, res, next) => {
  req.user = { role: "instructor" }; // Mock user with instructor role
  next();
};

// Endpoint to test
app.post("/teams", isInstructor, (req, res) => {
  const { name, instructorId, maxSize, courseId } = req.body;

  isCourseValid(courseId)
    .then((valid) => {
      if (!valid) {
        return res.status(400).json({ message: "Invalid course ID" });
      }

      const newTeam = {
        id: Date.now().toString(),
        name,
        instructorId,
        maxSize,
        courseId,
        students: [],
      };
      db.teams.push(newTeam);

      res.status(201).json({ message: "Team created successfully", team: newTeam });
    })
    .catch((error) => {
      res.status(500).json({ message: "Error creating team", error });
    });
});

// Tests
describe("POST /teams", () => {
  beforeEach(() => {
    // Reset the in-memory database before each test
    db.teams = [];
  });

  test("should create a new team successfully", async () => {
    const response = await request(app)
      .post("/teams")
      .send({
        name: "Team Alpha",
        instructorId: "i1",
        maxSize: 5,
        courseId: "validCourseId",
      });

    expect(response.status).toBe(201);
    expect(response.body.message).toBe("Team created successfully");
    expect(response.body.team).toMatchObject({
      name: "Team Alpha",
      instructorId: "i1",
      maxSize: 5,
      courseId: "validCourseId",
      students: [],
    });
  });

  test("should return an error for invalid course ID", async () => {
    const response = await request(app)
      .post("/teams")
      .send({
        name: "Team Beta",
        instructorId: "i2",
        maxSize: 5,
        courseId: "invalidCourseId",
      });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Invalid course ID");
  });

  test("should handle server errors gracefully", async () => {
    // Mock isCourseValid to throw an error
    isCourseValid.mockImplementationOnce(() => Promise.reject(new Error("Server error")));

    const response = await request(app)
      .post("/teams")
      .send({
        name: "Team Gamma",
        instructorId: "i3",
        maxSize: 5,
        courseId: "validCourseId",
      });

    expect(response.status).toBe(500);
    expect(response.body.message).toBe("Error creating team");
    expect(response.body.error).toBeDefined();
  });
});
