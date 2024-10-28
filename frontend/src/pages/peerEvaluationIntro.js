import React from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate for redirection

const PeerEvaluationIntro = () => {
  const navigate = useNavigate(); // Initialize the navigation

  // Function to redirect to the Peer Evaluation Form page
  const handleGoToEvaluation = () => {
    navigate('/peer-evaluation');  // Redirect to the correct path for the evaluation form
  };

  return (
    <div style={{ padding: '20px', border: '1px solid #ccc', borderRadius: '8px', marginTop: '20px' }}>
      <h2 style={{ fontSize: '24px', fontWeight: 'bold' }}>Peer Evaluation Form</h2>
      <p>
        The peer evaluation form in your project is designed to allow students to rate and provide feedback on their teammates' performance in group projects. The form asks students to evaluate each teammate across four key areas:
      </p>
      <ul>
        <li><strong>Cooperation</strong>: How well the teammate worked with others and contributed to group goals.</li>
        <li><strong>Conceptual Contribution</strong>: How much the teammate contributed ideas and knowledge to the project.</li>
        <li><strong>Practical Contribution</strong>: How much the teammate helped with practical tasks like writing reports or organizing work.</li>
        <li><strong>Work Ethic</strong>: The teammate's attitude, respect for others, and commitment to deadlines.</li>
      </ul>
      <p>
        Each student will rate their teammates anonymously on these areas, using a scale (e.g., 1 to 7), and can also leave comments. The form helps ensure accountability and provides feedback to improve future team performance.
      </p>

      {/* Button to redirect to the Peer Evaluation Form */}
      <button
        onClick={handleGoToEvaluation} // Handle redirection on click
        style={{
          padding: '10px 20px',
          fontSize: '16px',
          backgroundColor: '#2563eb',
          color: 'white',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer',
          marginTop: '20px',
        }}
      >
        Go to Peer Evaluation Form
      </button>
    </div>
  );
};

export default PeerEvaluationIntro;