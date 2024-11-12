// Import the function from app.js
const { assignStudentsToTeams } = require('../app');

describe('assignStudentsToTeams', () => {
  it('should evenly distribute students across teams', () => {
    const students = ['Alice', 'Bob', 'Charlie', 'Dave'];
    const teams = ['Team1', 'Team2'];

    const result = assignStudentsToTeams(students, teams);

    expect(result).toEqual({
      Team1: ['Alice', 'Charlie'],
      Team2: ['Bob', 'Dave'],
    });
  });

  it('should handle more teams than students', () => {
    const students = ['Alice', 'Bob'];
    const teams = ['Team1', 'Team2', 'Team3'];

    const result = assignStudentsToTeams(students, teams);

    expect(result).toEqual({
      Team1: ['Alice'],
      Team2: ['Bob'],
      Team3: [],
    });
  });

  it('should handle more students than teams', () => {
    const students = ['Alice', 'Bob', 'Charlie', 'Dave', 'Eve'];
    const teams = ['Team1', 'Team2'];

    const result = assignStudentsToTeams(students, teams);

    expect(result).toEqual({
      Team1: ['Alice', 'Charlie', 'Eve'],
      Team2: ['Bob', 'Dave'],
    });
  });

  it('should handle empty students array', () => {
    const students = [];
    const teams = ['Team1', 'Team2'];

    const result = assignStudentsToTeams(students, teams);

    expect(result).toEqual({
      Team1: [],
      Team2: [],
    });
  });

  it('should handle empty teams array', () => {
    const students = ['Alice', 'Bob'];
    const teams = [];

    const result = assignStudentsToTeams(students, teams);

    expect(result).toEqual({});
  });

  it('should handle both students and teams being empty', () => {
    const students = [];
    const teams = [];

    const result = assignStudentsToTeams(students, teams);

    expect(result).toEqual({});
  });
});
