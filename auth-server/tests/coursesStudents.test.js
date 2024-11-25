const express = require("express");
const request = require("supertest");

// Mock database setup
const mockDb = {
  users: [
    { id: "s1", email: "student1@example.com", role: "student" },
    { id: "s2", email: "student2@example.com", role: "student" },
  ],
  team_memberships: [
    { id: "tm1", student_id: "s1", team_id: "t1" },
    { id: "tm2", student_id: "s2", team_id: "t1" },
  ],
  teams: [
    { id: "t1", course_id: "c1" },
  ],
  courses: [
    { id: "c1", name: "Course 1", organization_id: "org1" },
  ],
  organizations: [
    { id: "org1", name: "Organization 1" },
  ],
  get(collection) {
    return {
      find: (predicate) => ({
        value: () => this[collection].find(predicate),
      }),
      filter: (predicate) => ({
        value: () => this[collection].filter(predicate),
      }),
      map: (mapper) => ({
        value: () => this[collection].map(mapper),
      }),
    };
  },
};

// Mock application
const app = express();
app.use(express.json());

app.post("/courses-students", (req, res) => {
  try {
    const studentEmail = req.body.student;
    const student = mockDb.get("users").find((user) => user.email === studentEmail).value();

    if (!student || student.role !== "student") {
      return res.status(403).json({ message: "Access forbidden: invalid role" });
    }

    const memberships = mockDb.get("team_memberships").filter((m) => m.student_id === student.id).value();
    const teamIds = memberships.map((m) => m.team_id);

    const teams = mockDb.get("teams").filter((team) => teamIds.includes(team.id)).value();
    const courseIds = teams.map((team) => team.course_id);

    const courses = mockDb.get("courses").filter((course) => courseIds.includes(course.id)).value();
    const orgIds = courses.map((course) => course.organization_id);

    const organizations = mockDb.get("organizations").filter((org) => orgIds.includes(org.id)).value();

    return res.status(200).json({
      message: "success",
      organization_info: organizations,
      course_info: courses,
      team_info: teams,
      membership_info: memberships,
    });
  } catch (error) {
    console.error("Error in /courses-students:", error);
    res.status(500).json({ message: "Internal Server Error", error });
  }
});

// Test suite
describe("POST /courses-students", () => {
  it("should return student-related information for a valid student", async () => {
    const response = await request(app)
      .post("/courses-students")
      .send({ student: "student1@example.com" });

    console.log("Response Body:", response.body); // Debugging response body

    expect(response.status).toBe(200);
    expect(response.body.message).toBe("success");

    expect(response.body.organization_info).toEqual([
      { id: "org1", name: "Organization 1" },
    ]);

    expect(response.body.course_info).toEqual([
      { id: "c1", name: "Course 1", organization_id: "org1" },
    ]);

    expect(response.body.team_info).toEqual([
      { id: "t1", course_id: "c1" },
    ]);

    expect(response.body.membership_info).toEqual([
      { id: "tm1", student_id: "s1", team_id: "t1" },
    ]);
  });

  it("should return 403 if the user is not a student", async () => {
    const response = await request(app)
      .post("/courses-students")
      .send({ student: "invalid_user@example.com" });

    expect(response.status).toBe(403);
    expect(response.body.message).toBe("Access forbidden: invalid role");
  });

  it("should return 403 if the student email is invalid", async () => {
    const response = await request(app)
      .post("/courses-students")
      .send({ student: "nonexistent@example.com" });

    expect(response.status).toBe(403);
    expect(response.body.message).toBe("Access forbidden: invalid role");
  });
});
