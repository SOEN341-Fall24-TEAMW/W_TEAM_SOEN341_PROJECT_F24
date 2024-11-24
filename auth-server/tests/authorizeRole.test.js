const authorizeRole = (role) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        if (req.user.role !== role) {
            return res.status(403).json({ message: 'Forbidden: Insufficient role' });
        }

        next();
    };
};

describe('authorizeRole Middleware', () => {
    let req, res, next;

    beforeEach(() => {
        req = {}; // Mock request object
        res = {
            status: jest.fn(() => res), // Mock response object
            json: jest.fn(),
        };
        next = jest.fn(); // Mock next function
    });

    it('should call next if user has the correct role', () => {
        req.user = { role: 'admin' }; // Simulate an admin user

        const middleware = authorizeRole('admin');
        middleware(req, res, next);

        expect(next).toHaveBeenCalled(); // Ensure next() is called
        expect(res.status).not.toHaveBeenCalled(); // Ensure no error status is set
    });

    it('should return 403 if user has an incorrect role', () => {
        req.user = { role: 'user' }; // Simulate a user with the wrong role

        const middleware = authorizeRole('admin');
        middleware(req, res, next);

        expect(res.status).toHaveBeenCalledWith(403); // Ensure 403 is set
        expect(res.json).toHaveBeenCalledWith({ message: 'Forbidden: Insufficient role' }); // Ensure correct error message
        expect(next).not.toHaveBeenCalled(); // Ensure next() is not called
    });

    it('should return 401 if no user is set', () => {
        req.user = null; // Simulate no user

        const middleware = authorizeRole('admin');
        middleware(req, res, next);

        expect(res.status).toHaveBeenCalledWith(401); // Ensure 401 is set
        expect(res.json).toHaveBeenCalledWith({ message: 'Unauthorized' }); // Ensure correct error message
        expect(next).not.toHaveBeenCalled(); // Ensure next() is not called
    });
});
