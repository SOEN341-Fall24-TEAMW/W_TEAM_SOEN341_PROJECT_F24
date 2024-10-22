import React, { useState } from 'react';
import './peerEvaluationForm.css'; // New CSS for styling

function PeerEvaluationForm() {
  const [evaluation, setEvaluation] = useState({
    cooperation: '',
    conceptualContribution: '',
    practicalContribution: '',
    workEthic: '',
    cooperationComment: '',
    conceptualComment: '',
    practicalComment: '',
    ethicComment: '',
  });

  const handleChange = (field, value) => {
    setEvaluation((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    alert('Evaluation submitted: ' + JSON.stringify(evaluation, null, 2));
  };

  return (
    <div className="form-container">
      <form className="evaluation-form" onSubmit={handleSubmit}>
        <div className='titleContainer'>Peer Evaluation Form</div>

        {/* Cooperation */}
        <div className="form-group">
          <label>Cooperation</label>
            <p>This measures how well your teammate worked with others, attended meetings, helped the team, and contributed to group tasks.</p>
          <div className="rating-container">
            {Array.from({ length: 7 }, (_, i) => (
              <label key={i} className="rating-label">
                <input
                  type="radio"
                  name="cooperation"
                  value={i + 1}
                  onChange={(e) => handleChange('cooperation', e.target.value)}
                  className="rating-input"
                />
                <span className="rating-icon">{i + 1}</span>
              </label>
            ))}
          </div>
          <textarea
            className="comment-box"
            placeholder="Add comments on Cooperation (optional)"
            value={evaluation.cooperationComment}
            onChange={(e) => handleChange('cooperationComment', e.target.value)}
          />
        </div>

        {/* Conceptual Contribution */}
        <div className="form-group">
          <label>Conceptual Contribution</label>
          <p>This evaluates the teammate’s ability to share useful ideas, gather information, and solve problems that helped guide the project.</p>
          <div className="rating-container">
            {Array.from({ length: 7 }, (_, i) => (
              <label key={i} className="rating-label">
                <input
                  type="radio"
                  name="conceptualContribution"
                  value={i + 1}
                  onChange={(e) => handleChange('conceptualContribution', e.target.value)}
                  className="rating-input"
                />
                <span className="rating-icon">{i + 1}</span>
              </label>
            ))}
          </div>
          <textarea
            className="comment-box"
            placeholder="Add comments on Conceptual Contribution (optional)"
            value={evaluation.conceptualComment}
            onChange={(e) => handleChange('conceptualComment', e.target.value)}
          />
        </div>

        {/* Practical Contribution */}
        <div className="form-group">
          <label>Practical Contribution</label>
          <p>This looks at how well the teammate handled tasks like writing reports, reviewing work, and keeping things organized for the team.</p>
          <div className="rating-container">
            {Array.from({ length: 7 }, (_, i) => (
              <label key={i} className="rating-label">
                <input
                  type="radio"
                  name="practicalContribution"
                  value={i + 1}
                  onChange={(e) => handleChange('practicalContribution', e.target.value)}
                  className="rating-input"
                />
                <span className="rating-icon">{i + 1}</span>
              </label>
            ))}
          </div>
          <textarea
            className="comment-box"
            placeholder="Add comments on Practical Contribution (optional)"
            value={evaluation.practicalComment}
            onChange={(e) => handleChange('practicalComment', e.target.value)}
          />
        </div>

        {/* Work Ethic */}
        <div className="form-group">
          <label>Work Ethic</label>
          <p>This checks your teammate's attitude, respect for deadlines, and overall responsibility toward their work and the team.</p>
          <div className="rating-container">
            {Array.from({ length: 7 }, (_, i) => (
              <label key={i} className="rating-label">
                <input
                  type="radio"
                  name="workEthic"
                  value={i + 1}
                  onChange={(e) => handleChange('workEthic', e.target.value)}
                  className="rating-input"
                />
                <span className="rating-icon">{i + 1}</span>
              </label>
            ))}
          </div>
          <textarea
            className="comment-box"
            placeholder="Add comments on Work Ethic (optional)"
            value={evaluation.ethicComment}
            onChange={(e) => handleChange('ethicComment', e.target.value)}
          />
        </div>

        <button type="submit" className="submit-button">Submit Evaluation</button>
      </form>
    </div>
  );
}

export default PeerEvaluationForm;
