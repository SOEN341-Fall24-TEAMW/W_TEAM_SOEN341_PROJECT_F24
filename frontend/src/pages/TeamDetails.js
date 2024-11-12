import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button, Table, Modal, Loader } from '@mantine/core';

function TeamDetails() {
  const { teamId } = useParams(); // Get team ID from URL
  const navigate = useNavigate();
  const [team, setTeam] = useState(null); // Team data
  const [members, setMembers] = useState([]); // Team members
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state
  const [isAddingStudent, setIsAddingStudent] = useState(false); // Modal state for adding a student
  const [addStudentError, setAddStudentError] = useState(null); // Error message for adding student

  // Fetch team details and members
  useEffect(() => {
    const fetchTeamDetails = async () => {
      try {
        // Fetch team details
        const teamResponse = await fetch(`/api/teams/${teamId}`);
        if (!teamResponse.ok) throw new Error('Failed to fetch team details');
        const teamData = await teamResponse.json();
        setTeam(teamData);

        // Fetch team memberships
        const membershipsResponse = await fetch(`/api/teams/${teamId}/memberships`);
        if (!membershipsResponse.ok) throw new Error('Failed to fetch memberships');
        const membershipsData = await membershipsResponse.json();

        // Fetch students details
        const studentIds = membershipsData.map(m => m.student_id);
        const studentsResponse = await fetch(`/api/students?ids=${studentIds.join(',')}`);
        if (!studentsResponse.ok) throw new Error('Failed to fetch student details');
        const studentsData = await studentsResponse.json();
        setMembers(studentsData);

      } catch (err) {
        setError(err.message); // Set error message if something goes wrong
      } finally {
        setLoading(false); // Disable loading once fetch is done
      }
    };

    fetchTeamDetails();
  }, [teamId]); // Dependency on teamId to refetch if it changes

  // Add a new student to the team
  const handleAddStudent = async (event) => {
    event.preventDefault();
    const studentId = event.target.studentId.value;
    const studentName = event.target.studentName.value;
    const studentEmail = event.target.studentEmail.value;

    try {
      const response = await fetch(`/api/teams/${teamId}/students`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "jwt-token": localStorage.getItem("token"),
        },
        body: JSON.stringify({ studentId, name: studentName, email: studentEmail }),
      });

      if (response.ok) {
        setIsAddingStudent(false); // Close modal on success
        setMembers(prev => [...prev, { id: studentId, name: studentName, email: studentEmail }]); // Add new student to members list
      } else {
        const result = await response.json();
        setAddStudentError(result.message || "Failed to add student");
      }
    } catch (error) {
      setAddStudentError("An error occurred while adding the student.");
    }
  };

  // Loading state
  if (loading) return <Loader size="lg" />;
  
  // Error state
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h1>{team?.name}</h1>
      <Button style={{ float: 'right' }} onClick={() => setIsAddingStudent(true)}>
        Add Student
      </Button>

      <h2>Members:</h2>
      {members.length > 0 ? (
        <Table>
          <thead>
            <tr>
              <th>Student Name</th>
              <th>Student ID</th>
              <th>Email</th>
            </tr>
          </thead>
          <tbody>
            {members.map(member => (
              <tr key={member.id}>
                <td>{member.name}</td>
                <td>{member.id}</td>
                <td>{member.email}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      ) : (
        <p>No members in this team.</p>
      )}

      <Button onClick={() => navigate(-1)}>Go Back</Button>

      {/* Modal for adding a student */}
      <Modal opened={isAddingStudent} onClose={() => setIsAddingStudent(false)} title="Add New Student">
        <form onSubmit={handleAddStudent}>
          <div>
            <label>Student ID:</label>
            <input type="text" name="studentId" required />
          </div>
          <div>
            <label>Student Name:</label>
            <input type="text" name="studentName" required />
          </div>
          <div>
            <label>Student Email:</label>
            <input type="email" name="studentEmail" required />
          </div>
          {addStudentError && <p style={{ color: 'red' }}>{addStudentError}</p>}
          <Button type="submit">Submit</Button>
        </form>
      </Modal>
    </div>
  );
}

export default TeamDetails;

