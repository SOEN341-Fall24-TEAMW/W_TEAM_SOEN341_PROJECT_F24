import React, { useState } from 'react';
//import './peerEvaluationForm.css'; // New CSS for styling

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
        <h2>Peer Evaluation Form</h2>

        {/* Cooperation */}
        <div className="form-group">
          <label>Cooperation</label>
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
