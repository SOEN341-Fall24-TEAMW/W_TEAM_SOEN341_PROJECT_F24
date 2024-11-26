const express = require('express');
const request = require('supertest');
const { Parser } = require('json2csv');

// Mock fetchStudentDataToExport and isInstructor middleware
const fetchStudentDataToExport = jest.fn();
const isInstructor = jest.fn((req, res, next) => next());

// Mock Express app
const app = express();

app.get('/export', isInstructor, (req, res) => {
    const organizationId = req.query.organizationId;
    if (!organizationId) {
        return res.status(400).json({ message: "Organization ID is required" });
    }

    // Fetch the student data filtered by organization ID
    const studentData = fetchStudentDataToExport(organizationId);

    if (studentData.length === 0) {
        return res.status(404).json({ message: "No students found for this organization" });
    }

    const fields = ['name', 'studentId', 'email', 'team', 'course', 'organization'];
    const json2csvParser = new Parser({ fields });
    const csvData = json2csvParser.parse(studentData);

    // Send the CSV data as a downloadable file
    res.header('Content-Type', 'text/csv');
    res.attachment(`students_${organizationId}.csv`);
    res.send(csvData);
});

// Test suite
describe("GET /export", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });


    test("should return 400 if organizationId is missing", async () => {
        const response = await request(app).get('/export');

        expect(response.status).toBe(400);
        expect(response.body.message).toBe("Organization ID is required");
    });

    test("should return 404 if no students are found for the organization", async () => {
        fetchStudentDataToExport.mockReturnValue([]);

        const response = await request(app).get('/export').query({ organizationId: "org1" });

        expect(response.status).toBe(404);
        expect(response.body.message).toBe("No students found for this organization");
    });

    test("should call the isInstructor middleware", async () => {
        await request(app).get('/export').query({ organizationId: "org1" });
        expect(isInstructor).toHaveBeenCalled();
    });
});
