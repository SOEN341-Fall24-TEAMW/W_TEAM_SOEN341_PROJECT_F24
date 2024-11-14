const fs = require("fs");
const csvParser = require("csv-parser");

jest.mock("fs");
jest.mock("csv-parser");

describe("isCourseValid", () => {
    test("should return true for a valid course ID", async () => {
        const mockCsvData = [{ "Course ID": "COMP123" }, { "Course ID": "SOEN456" }];

        const mockStream = {
            pipe: jest.fn().mockReturnThis(),
            on: jest.fn((event, callback) => {
                if (event === "data") {
                    mockCsvData.forEach((row) => callback(row));
                } else if (event === "end") {
                    callback();
                }
                return mockStream;
            }),
        };

        fs.createReadStream.mockReturnValue(mockStream);
        csvParser.mockReturnValue(mockStream);

        const isCourseValid = async (courseId) => {
            const courses = [];
            return new Promise((resolve, reject) => {
                const stream = fs.createReadStream("../CU_SR_OPEN_DATA_CATALOG_utf8.csv");
                stream.on("error", (error) => reject(error));
                stream.pipe(csvParser())
                    .on("data", (row) => {
                        if (row["Course ID"]) {
                            courses.push(row["Course ID"].trim());
                        }
                    })
                    .on("end", () => resolve(courses.includes(courseId)));
            });
        };

        const result = await isCourseValid("COMP123");
        expect(result).toBe(true);
    });

    test("should return false for an invalid course ID", async () => {
        const mockCsvData = [{ "Course ID": "COMP123" }, { "Course ID": "SOEN456" }];

        const mockStream = {
            pipe: jest.fn().mockReturnThis(),
            on: jest.fn((event, callback) => {
                if (event === "data") {
                    mockCsvData.forEach((row) => callback(row));
                } else if (event === "end") {
                    callback();
                }
                return mockStream;
            }),
        };

        fs.createReadStream.mockReturnValue(mockStream);
        csvParser.mockReturnValue(mockStream);

        const isCourseValid = async (courseId) => {
            const courses = [];
            return new Promise((resolve, reject) => {
                const stream = fs.createReadStream("../CU_SR_OPEN_DATA_CATALOG_utf8.csv");
                stream.on("error", (error) => reject(error));
                stream.pipe(csvParser())
                    .on("data", (row) => {
                        if (row["Course ID"]) {
                            courses.push(row["Course ID"].trim());
                        }
                    })
                    .on("end", () => resolve(courses.includes(courseId)));
            });
        };

        const result = await isCourseValid("MATH999");
        expect(result).toBe(false);
    });
});
