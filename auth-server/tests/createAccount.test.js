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

app.post("/create-account", (req, res) => {
    const { role, firstName, lastName, id, email, password, organizationId } = req.body;

    bcrypt.hash(password, 10, function (_err, hash) {
        users.push({
            id,
            email,
            password: hash,
            role,
            name: `${firstName} ${lastName}`,
            organization_id: organizationId,
        });

        const creationData = {
            id,
            email,
            role,
            name: `${firstName} ${lastName}`,
            creationTime: Date.now(),
        };

        const token = jwt.sign(creationData, jwtSecretKey);
        return res.status(200).json({ message: "success", token });
    });
});

// Test Suite
describe("POST /create-account", () => {
    beforeEach(() => {
        // Reset the mock database before each test
        users = [];
    });

    test("should create a new account successfully and return a token", async () => {
        const newUser = {
            id: "123",
            email: "test@example.com",
            password: "password123",
            role: "user",
            firstName: "John",
            lastName: "Doe",
            organizationId: "org1",
        };

        const response = await request(app).post("/create-account").send(newUser);

        expect(response.status).toBe(200);
        expect(response.body.message).toBe("success");
        expect(response.body.token).toBeDefined();

        // Verify user in mock database
        const createdUser = users.find((user) => user.email === newUser.email);
        expect(createdUser).toBeDefined();
        expect(createdUser.password).not.toBe(newUser.password); // Password should be hashed
    });

    test("should store the hashed password in the mock database", async () => {
        const newUser = {
            id: "456",
            email: "hashed@example.com",
            password: "hashedpassword",
            role: "admin",
            firstName: "Jane",
            lastName: "Smith",
            organizationId: "org2",
        };

        const response = await request(app).post("/create-account").send(newUser);

        expect(response.status).toBe(200);

        const createdUser = users.find((user) => user.email === newUser.email);
        expect(createdUser).toBeDefined();
        expect(createdUser.password).not.toBe(newUser.password); // Ensure password is hashed

        const isPasswordValid = await bcrypt.compare(newUser.password, createdUser.password);
        expect(isPasswordValid).toBe(true);
    });
});
