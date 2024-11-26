const express = require('express');
const request = require('supertest');
const bodyParser = require('body-parser');

// Mock database
const mockDb = {
    peer_evaluations: [
        { id: 1, evaluatee_id: "student1", feedback: "Great work!" },
        { id: 2, evaluatee_id: "student2", feedback: "Needs improvement." },
        { id: 3, evaluatee_id: "student1", feedback: "Excellent teamwork." }
    ],
    get: function (collection) {
        return {
            value: () => this[collection]
        };
    }
};

// Initialize Express app
const app = express();
app.use(bodyParser.json());

// Mock endpoint
app.post('/get-student-feedback', (req, res) => {
    const selected_student_id = req.body.student.id;
    try {
        const feedbacks = mockDb.get("peer_evaluations").value();
        const student_feedbacks = feedbacks.filter(feedback => feedback.evaluatee_id === selected_student_id);
        return res.status(200).json({ message: 'success', feedbacks: student_feedbacks });
    } catch (error) {
        return res.status(401).json({ message: "Invalid token", error });
    }
});

// Test Suite
describe('POST /get-student-feedback', () => {
    it('should return feedbacks for a valid student ID', async () => {
        const response = await request(app)
            .post('/get-student-feedback')
            .send({ student: { id: "student1" } });

        expect(response.status).toBe(200);
        expect(response.body.message).toBe("success");
        expect(response.body.feedbacks).toEqual([
            { id: 1, evaluatee_id: "student1", feedback: "Great work!" },
            { id: 3, evaluatee_id: "student1", feedback: "Excellent teamwork." }
        ]);
    });

    it('should return an empty array for a student ID with no feedback', async () => {
        const response = await request(app)
            .post('/get-student-feedback')
            .send({ student: { id: "student3" } });

        expect(response.status).toBe(200);
        expect(response.body.message).toBe("success");
        expect(response.body.feedbacks).toEqual([]);
    });

});
