import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import TeammatesList from './TeamatesList.js'; 

function TeamList() {
  const navigate = useNavigate();
  const [teams, setTeams] = useState([]); // State to hold team data
  const [selectedTeam, setSelectedTeam] = useState(null); // State to hold the selected team

  useEffect(() => {
    // Fetch teams data (this could be from an API)
    const fetchTeams = async () => {
      // Replace with your actual data fetching logic
      const response = await fetch('/api/teams'); // Example API endpoint
      const data = await response.json();
      setTeams(data);
    };

    fetchTeams();
  }, []);

  const handleTeamClick = (team) => {
    setSelectedTeam(team);
  };

  return (
    <div>
      {/* Going back to teams page */}
      <button onClick={() => navigate("/Teams")} className="button3">Back</button>
      <h1 id="head1">Team List</h1>
      <div id="teamList">
        {teams.length > 0 ? (
          teams.map((team) => (
            <div key={team.id} onClick={() => handleTeamClick(team)}>
              <h2>{team.name}</h2>
            </div>
          ))
        ) : (
          <p>No teams available.</p>
        )}
        {selectedTeam && (
          <TeammatesList teammates={selectedTeam.members} />
        )}
      </div>
    </div>
  );
}

export default TeamList;


