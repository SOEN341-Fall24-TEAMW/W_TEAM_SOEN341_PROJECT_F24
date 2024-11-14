const express = require("express");
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt");
const request = require("supertest");
const { v4: uuidv4 } = require("uuid");

// In-memory mock database
const mockDb = {
    users: [],
    organizations: [],
};

const app = express();
app.use(bodyParser.json());

app.post("/create-student", async (req, res) => {
    const { student_id, student_email, first_name, last_name, organization_id, new_org_name } = req.body;

    try {
        // Create a new organization if needed
        let final_org_id = organization_id;
        if (new_org_name) {
            final_org_id = uuidv4();
            mockDb.organizations.push({ id: final_org_id, name: new_org_name });
        }

        // Hash the password
        const account_password = student_email;
        const hashed_password = await bcrypt.hash(account_password, 10);

        // Add the new student
        const new_student = {
            id: student_id,
            email: student_email,
            password: hashed_password,
            role: "student",
            name: `${first_name} ${last_name}`,
            organization_id: final_org_id,
        };
        mockDb.users.push(new_student);

        res.status(200).json({ message: "New student created successfully" });
    } catch (error) {
        console.error("Error creating new student:", error);
        res.status(500).json({ message: "Error creating new user" });
    }
});

describe("POST /create-student", () => {
    beforeEach(() => {
        // Reset mock database before each test
        mockDb.users = [];
        mockDb.organizations = [];
    });

    test("should create a new student successfully", async () => {
        const response = await request(app)
            .post("/create-student")
            .send({
                student_id: "s1",
                student_email: "student1@school.com",
                first_name: "John",
                last_name: "Doe",
                organization_id: "org1",
            });

        expect(response.status).toBe(200);
        expect(response.body.message).toBe("New student created successfully");
        expect(mockDb.users.length).toBe(1);
        expect(mockDb.users[0].email).toBe("student1@school.com");
        expect(await bcrypt.compare("student1@school.com", mockDb.users[0].password)).toBe(true);
    });

    test("should create a new organization if `new_org_name` is provided", async () => {
        const response = await request(app)
            .post("/create-student")
            .send({
                student_id: "s2",
                student_email: "student2@school.com",
                first_name: "Jane",
                last_name: "Smith",
                new_org_name: "New Organization",
            });

        expect(response.status).toBe(200);
        expect(response.body.message).toBe("New student created successfully");
        expect(mockDb.organizations.length).toBe(1);
        expect(mockDb.organizations[0].name).toBe("New Organization");
        expect(mockDb.users.length).toBe(1);
        expect(mockDb.users[0].organization_id).toBe(mockDb.organizations[0].id);
    });

    test("should return 500 if there is an error", async () => {
        jest.spyOn(bcrypt, "hash").mockImplementation(() => {
            throw new Error("Test Error");
        });

        const response = await request(app)
            .post("/create-student")
            .send({
                student_id: "s3",
                student_email: "student3@school.com",
                first_name: "Invalid",
                last_name: "Test",
                organization_id: "org1",
            });

        expect(response.status).toBe(500);
        expect(response.body.message).toBe("Error creating new user");

        bcrypt.hash.mockRestore();
    });
});
