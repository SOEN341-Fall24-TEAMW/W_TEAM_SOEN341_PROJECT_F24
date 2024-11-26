const jwt = require("jsonwebtoken");

// Mock secret key for testing
const jwtSecretKey = "mockSecretKey";

// Function to be tested
function isValidToken(token) {
    try {
        const decoded = jwt.verify(token, jwtSecretKey);
        return decoded && decoded.role === "instructor"; // Adjust if you need to check a specific role
    } catch (error) {
        console.error("Error during token verification:", error.message);
        return false;
    }
}

describe("isValidToken", () => {
    let validToken;
    let invalidToken;

    beforeAll(() => {
        // Create a valid token for an instructor
        validToken = jwt.sign({ role: "instructor" }, jwtSecretKey, { expiresIn: "1h" });

        // Create an invalid token (e.g., invalid signature)
        invalidToken = jwt.sign({ role: "instructor" }, "wrongSecretKey");
    });

    it("should return true for a valid token with the 'instructor' role", () => {
        const result = isValidToken(validToken);
        expect(result).toBe(true);
    });

    it("should return false for a valid token with an incorrect role", () => {
        const studentToken = jwt.sign({ role: "student" }, jwtSecretKey, { expiresIn: "1h" });
        const result = isValidToken(studentToken);
        expect(result).toBe(false);
    });

    it("should return false for an invalid token", () => {
        const result = isValidToken(invalidToken);
        expect(result).toBe(false);
    });

    it("should return false for a missing token", () => {
        const result = isValidToken(null);
        expect(result).toBe(false);
    });

    it("should return false for a malformed token", () => {
        const malformedToken = "this.is.not.a.token";
        const result = isValidToken(malformedToken);
        expect(result).toBe(false);
    });

    it("should return false for an expired token", () => {
        const expiredToken = jwt.sign({ role: "instructor" }, jwtSecretKey, { expiresIn: "-1h" });
        const result = isValidToken(expiredToken);
        expect(result).toBe(false);
    });
});
