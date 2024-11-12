const request = require('supertest');
const { app, db } = require('../app'); // Import the app and db

jest.mock('../app', () => {
    const originalModule = jest.requireActual('../app'); 
    return {
        ...originalModule,
        db: {
            get: jest.fn(),
        },
    };
});

describe('GET /peer-evaluations/feedback', () => {
    it('should return 400 if teamId is not provided', async () => {
        const response = await request(app).get('/peer-evaluations/feedback');
        expect(response.status).toBe(400);
        expect(response.body.message).toBe('Team ID is required');
    });

    it('should return 404 if no peer feedback is found', async () => {
        db.get.mockReturnValueOnce({
            filter: jest.fn().mockReturnValue({
                value: jest.fn().mockReturnValue([]), // No feedback found
            }),
        });

        const response = await request(app).get('/peer-evaluations/feedback?teamId=123');
        expect(response.status).toBe(404);
        expect(response.body.message).toBe('No peer feedback found');
    });

    it('should return 200 with peer feedback data', async () => {
        const mockFeedbackData = [{ id: 1, feedback: 'Great teamwork!' }];
        db.get.mockReturnValueOnce({
            filter: jest.fn().mockReturnValue({
                value: jest.fn().mockReturnValue(mockFeedbackData), // Mocked feedback data
            }),
        });

        const response = await request(app).get('/peer-evaluations/feedback?teamId=123');
        expect(response.status).toBe(200);
        expect(response.body.message).toBe('success');
        expect(response.body.data).toEqual(mockFeedbackData);
    });
});
