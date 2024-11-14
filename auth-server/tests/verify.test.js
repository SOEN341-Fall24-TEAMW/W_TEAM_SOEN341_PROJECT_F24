const express = require("express");
const bodyParser = require("body-parser");
const request = require("supertest");
const jwt = require("jsonwebtoken");

// Mock JWT Secret Key
const jwtSecretKey = "test-secret-key";

// App Implementation
const app = express();
app.use(bodyParser.json());

app.post("/verify", (req, res) => {
    const tokenHeaderKey = "jwt-token";
    const authToken = req.headers[tokenHeaderKey];

    console.log("Received Token:", authToken);
    try {
        const verified = jwt.verify(authToken, jwtSecretKey);
        console.log("verified 1: ", verified);
        if (verified) {
            return res.status(200).json({ status: "logged in", message: "success", role: verified.role });
        } else {
            return res.status(401).json({ status: "invalid auth", message: "error" });
        }
    } catch (error) {
        return res.status(401).json({ status: "invalid auth", message: "error" });
    }
});

// Test Suite
describe("POST /verify", () => {
    test("should return 'logged in' for a valid token", async () => {
        // Generate a valid token
        const validToken = jwt.sign({ role: "instructor" }, jwtSecretKey);

        const response = await request(app)
            .post("/verify")
            .set("jwt-token", validToken);

        expect(response.status).toBe(200);
        expect(response.body.status).toBe("logged in");
        expect(response.body.message).toBe("success");
        expect(response.body.role).toBe("instructor");
    });

    test("should return 'invalid auth' for an invalid token", async () => {
        const invalidToken = "invalid-token";

        const response = await request(app)
            .post("/verify")
            .set("jwt-token", invalidToken);

        expect(response.status).toBe(401);
        expect(response.body.status).toBe("invalid auth");
        expect(response.body.message).toBe("error");
    });

    test("should return 'invalid auth' if no token is provided", async () => {
        const response = await request(app).post("/verify");

        expect(response.status).toBe(401);
        expect(response.body.status).toBe("invalid auth");
        expect(response.body.message).toBe("error");
    });
});
