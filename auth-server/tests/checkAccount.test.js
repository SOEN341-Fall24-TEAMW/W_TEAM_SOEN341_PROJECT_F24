const express = require("express");
const bodyParser = require("body-parser");
const request = require("supertest");

// Mock Database
const mockDb = {
    users: [
        { email: "test@example.com", name: "Test User" },
        { email: "admin@example.com", name: "Admin User" },
    ],
    get(collection) {
        return {
            value: () => this[collection],
        };
    },
};

// App Implementation
const app = express();
app.use(bodyParser.json());

app.post("/check-account", (req, res) => {
    const { email } = req.body;

    console.log("Request Body:", req.body);

    const user = mockDb.get("users").value().filter((user) => email === user.email);

    console.log("user: ", user);

    res.status(200).json({
        status: user.length > 0 ? "User exists" : "User does not exist",
        userExists: user.length > 0,
    });
});

// Test Suite
describe("POST /check-account", () => {
    test("should return 'User exists' if the email matches a user", async () => {
        const response = await request(app).post("/check-account").send({ email: "test@example.com" });

        expect(response.status).toBe(200);
        expect(response.body.status).toBe("User exists");
        expect(response.body.userExists).toBe(true);
    });

    test("should return 'User does not exist' if the email does not match any user", async () => {
        const response = await request(app).post("/check-account").send({ email: "unknown@example.com" });

        expect(response.status).toBe(200);
        expect(response.body.status).toBe("User does not exist");
        expect(response.body.userExists).toBe(false);
    });

    test("should handle missing email in request body", async () => {
        const response = await request(app).post("/check-account").send({});

        expect(response.status).toBe(200); // Assuming your endpoint doesn't check for missing email
        expect(response.body.status).toBe("User does not exist");
        expect(response.body.userExists).toBe(false);
    });
});
