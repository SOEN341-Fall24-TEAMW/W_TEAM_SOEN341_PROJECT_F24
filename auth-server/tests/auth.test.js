const express = require("express");
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const request = require("supertest");

// Mock Database
let users = [];

// Mock JWT Secret Key
const jwtSecretKey = "test-secret-key";

// App Implementation
const app = express();
app.use(bodyParser.json());

app.post("/auth", (req, res) => {
    const { role, email, password } = req.body;

    const user = users.filter((u) => u.email === email);

    if (user.length === 1) {
        bcrypt.compare(password, user[0].password, function (_err, result) {
            if (!result) {
                return res.status(401).json({ message: "Invalid password" });
            } else if (role !== user[0].role) {
                return res.status(401).json({ message: "Invalid role" });
            } else {
                const loginData = {
                    id: user[0].id,
                    email,
                    role,
                    signInTime: Date.now(),
                };

                const token = jwt.sign(loginData, jwtSecretKey);
                res.status(200).json({ message: "success", id: user[0].id, token });
            }
        });
    } else {
        res.status(401).json({ message: "User not found" });
    }
});

// Test Suite
describe("POST /auth", () => {
    beforeEach(async () => {
        // Reset the mock database before each test
        users = [];

        const hashedPassword = await bcrypt.hash("password123", 10);
        users.push({
            id: "123",
            email: "test@example.com",
            password: hashedPassword,
            role: "user",
        });
    });

    test("should authenticate a user and return a token", async () => {
        const loginData = {
            email: "test@example.com",
            password: "password123",
            role: "user",
        };

        const response = await request(app).post("/auth").send(loginData);

        expect(response.status).toBe(200);
        expect(response.body.message).toBe("success");
        expect(response.body.token).toBeDefined();
        expect(response.body.id).toBe("123");
    });

    test("should return 401 for invalid password", async () => {
        const loginData = {
            email: "test@example.com",
            password: "wrongpassword",
            role: "user",
        };

        const response = await request(app).post("/auth").send(loginData);

        expect(response.status).toBe(401);
        expect(response.body.message).toBe("Invalid password");
    });

    test("should return 401 for invalid role", async () => {
        const loginData = {
            email: "test@example.com",
            password: "password123",
            role: "admin",
        };

        const response = await request(app).post("/auth").send(loginData);

        expect(response.status).toBe(401);
        expect(response.body.message).toBe("Invalid role");
    });

    test("should return 401 for non-existent user", async () => {
        const loginData = {
            email: "nonexistent@example.com",
            password: "password123",
            role: "user",
        };

        const response = await request(app).post("/auth").send(loginData);

        expect(response.status).toBe(401);
        expect(response.body.message).toBe("User not found");
    });
});
