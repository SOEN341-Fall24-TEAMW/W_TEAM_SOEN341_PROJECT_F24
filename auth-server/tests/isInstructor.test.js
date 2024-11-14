const express = require("express");
const request = require("supertest");
const jwt = require("jsonwebtoken");

// Mock JWT secret key
const jwtSecretKey = "test_secret_key";

// Middleware function
function isInstructor(req, res, next) {
  const token = req.headers["jwt-token"];
  if (!token) {
    return res.status(401).json({ message: "Token not provided" });
  }
  try {
    const decodedToken = jwt.verify(token, jwtSecretKey);
    if (decodedToken.role !== "instructor") {
      return res.status(403).json({ message: "Access forbidden: not an instructor" });
    }
    next();
  } catch (error) {
    res.status(401).json({ message: "Invalid token" });
  }
}

// Mock Express app
const app = express();
app.get("/protected", isInstructor, (req, res) => {
  res.status(200).json({ message: "Access granted" });
});

// Tests
describe("isInstructor Middleware", () => {
  test("should allow access for valid instructor token", async () => {
    const token = jwt.sign({ role: "instructor" }, jwtSecretKey);

    const response = await request(app)
      .get("/protected")
      .set("jwt-token", token);

    expect(response.status).toBe(200);
    expect(response.body.message).toBe("Access granted");
  });

  test("should deny access if token is not provided", async () => {
    const response = await request(app).get("/protected");

    expect(response.status).toBe(401);
    expect(response.body.message).toBe("Token not provided");
  });

  test("should deny access for non-instructor role", async () => {
    const token = jwt.sign({ role: "student" }, jwtSecretKey);

    const response = await request(app)
      .get("/protected")
      .set("jwt-token", token);

    expect(response.status).toBe(403);
    expect(response.body.message).toBe("Access forbidden: not an instructor");
  });

  test("should deny access for invalid token", async () => {
    const invalidToken = "invalid.token.here";

    const response = await request(app)
      .get("/protected")
      .set("jwt-token", invalidToken);

    expect(response.status).toBe(401);
    expect(response.body.message).toBe("Invalid token");
  });
});
