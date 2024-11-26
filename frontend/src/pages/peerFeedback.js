import React, { useState, useEffect } from 'react';
import './peerFeedback.css'; // Add a new CSS file for styling
import PropTypes from 'prop-types';

function PeerFeedback({ feedbackData }) {
  const [feedback, setFeedback] = useState([]);

  // Simulate fetching feedback data (replace with actual API call)
  useEffect(() => {
    setFeedback(feedbackData || []);
  }, [feedbackData]);

  return (
    <div className="feedback-container">
      <h2 className="feedback-title">Peer Feedback</h2>
      {feedback.length > 0 ? (
        <div className="feedback-list">
          {feedback.map((item, index) => (
            <div key={index} className="feedback-item">
              <p className="feedback-comment">{item.comment}</p> {/* Only comment, no name */}
            </div>
          ))}
        </div>
      ) : (
        <p>Your feedback from other students will be displayed here.</p>
      )}
    </div>
  );
}

PeerFeedback.propTypes = {
  feedbackData: PropTypes.array.isRequired,  // Example type, adjust as necessary
};

export default PeerFeedback;
