const request = require('supertest');
const express = require('express');
const bodyParser = require('body-parser');

// Mock database
const mockDb = {
    users: [
        { id: 'student1', role: 'student', name: 'Student One' },
        { id: 'student2', role: 'student', name: 'Student Two' },
        { id: 'student3', role: 'student', name: 'Student Three' },
        { id: 'student4', role: 'instructor', name: 'Instructor' },
    ],
    get(collection) {
        const data = this[collection];
        return {
            filter: (predicate) => ({
                value: () => data.filter(predicate),
            }),
            value: () => data,
        };
    },
};

// Mock Express app
const app = express();
app.use(bodyParser.json());

// Endpoint implementation
app.post('/get-student-peers', (req, res) => {
    const feedbacks = req.body;
    console.log("DJ KHALED LOGGING: ", feedbacks);
    const peer_ids = feedbacks.map(feedback => feedback.evaluator_id);
    console.log("DJ KHALED IDDD: ", peer_ids);

    try {
        const students = mockDb.get("users")
            .filter(user => user.role === 'student' && peer_ids.includes(user.id))
            .value();
        console.log('DJ KHALED FEEDBACK SENT??????: ', students);
        return res.status(200).json({ message: 'success', peers: students });

    } catch (error) {
        return res.status(401).json({ message: "Invalid token", error });
    }
});

// Tests
describe('POST /get-student-peers', () => {
    it('should return peers for valid evaluator IDs', async () => {
        const feedbacks = [
            { evaluator_id: 'student1' },
            { evaluator_id: 'student3' },
        ];

        const response = await request(app)
            .post('/get-student-peers')
            .send(feedbacks);

        expect(response.status).toBe(200);
        expect(response.body.message).toBe('success');
        expect(response.body.peers).toEqual([
            { id: 'student1', role: 'student', name: 'Student One' },
            { id: 'student3', role: 'student', name: 'Student Three' },
        ]);
    });

    it('should return an empty array if no valid evaluator IDs are provided', async () => {
        const feedbacks = [
            { evaluator_id: 'nonexistent_student' },
        ];

        const response = await request(app)
            .post('/get-student-peers')
            .send(feedbacks);

        expect(response.status).toBe(200);
        expect(response.body.message).toBe('success');
        expect(response.body.peers).toEqual([]);
    });


});
