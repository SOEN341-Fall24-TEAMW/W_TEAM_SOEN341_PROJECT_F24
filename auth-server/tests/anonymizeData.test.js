const anonymizeData = (data) => {
    if (!data) return data;
    return data.replace(/./g, '*'); // Replace all characters with asterisks
};

describe("anonymizeData", () => {
    test("should replace all characters in a string with asterisks", () => {
        expect(anonymizeData("testData")).toBe("********");
    });

    test("should return null if input is null", () => {
        expect(anonymizeData(null)).toBeNull();
    });

    test("should return an empty string if input is an empty string", () => {
        expect(anonymizeData("")).toBe("");
    });

    test("should handle a single-character string", () => {
        expect(anonymizeData("a")).toBe("*");
    });
});
