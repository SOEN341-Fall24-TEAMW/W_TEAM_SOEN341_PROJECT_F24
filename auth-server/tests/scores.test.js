const express = require('express');
const request = require('supertest');
const { v4: uuidv4 } = require('uuid');

const app = express();
app.use(express.json());

const db = {
    scores: [],
    get(collection) {
        return {
            push(item) {
                db[collection].push(item);
                return this;
            },
            write() {
                // Simulate a write operation (no-op here since we're using an in-memory array)
                return this;
            }
        };
    }
};

app.post('/scores', (req, res) => {
    const { teamID, score } = req.body;

    if (!teamID) {
        return res.status(400).json({ message: "teamID is required" });
    }

    const newScore = {
        scoreID: uuidv4(),
        teamID,
        score,
        date: new Date().toISOString()
    };

    db.get('scores').push(newScore).write();
    res.status(201).send(newScore);
});

describe('POST /scores', () => {
    test('should create a new score when valid data is provided', async () => {
        const response = await request(app)
            .post('/scores')
            .send({
                teamID: 'team123',
                score: 85
            });

        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty('scoreID');
        expect(response.body.teamID).toBe('team123');
        expect(response.body.score).toBe(85);
        expect(response.body).toHaveProperty('date');
    });

    test('should return 400 when teamID is missing', async () => {
        const response = await request(app)
            .post('/scores')
            .send({
                score: 85
            });

        expect(response.status).toBe(400);
        expect(response.body.message).toBe('teamID is required');
    });
});
