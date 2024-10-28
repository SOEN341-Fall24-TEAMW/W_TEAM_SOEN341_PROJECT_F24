import React, { useState } from 'react';
import { AppShell, Space } from '@mantine/core'; 
import { NavbarStudentDashboard } from './NavbarStudentDashboard.js';
import './peerEvaluationForm.css'; 

function PeerEvaluationForm() {
  const [active, setActive] = useState(false);

  const evaluatorId = 'your-evaluator-id';  // Replace with actual logic
  const evaluateeId = 'your-evaluatee-id';  // Replace with actual logic
  const teamId = 'your-team-id';              // Replace with actual logic

 
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

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await fetch('http://localhost:3080/submit-evaluation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          evaluator_id: evaluatorId,
          evaluatee_id: evaluateeId,
          team_id: teamId,
          ...evaluation,
        }),
      });

      const result = await response.json();
      if (result.message === 'success') {
        alert('Evaluation submitted successfully');
      } else {
        alert('Failed to submit evaluation');
      }
    } catch (error) {
      console.error('Error submitting evaluation:', error);
      alert('An error occurred while submitting the evaluation');
    }
  };

  return (
    <AppShell
      navbar={<NavbarStudentDashboard active={active} setActive={setActive} />} // Include the navbar
    >
      <Space h="md" />
    <div className="form-container">
      <form className="evaluation-form" onSubmit={handleSubmit}>
      <div className='titleContainer'>Peer Evaluation Form</div>
      <div className="form-group">
      <label>1. Cooperation</label>
        <div class="table-container">
          <table>
            <thead>
              <tr>
                <th>Criteria</th>
                <th>Bad</th>
                <th>Quite Good</th>
                <th>Good</th>
                <th>Very Good</th>
                <th>Excellent</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={{ fontWeight: 'bold' , fontSize: '15px'}}>Contribution to group goals</td>
                <td><input type="radio" name="contributionGroupGoals" value="Bad" /> Rarely contributes to group goals; only works when directly instructed.</td>
                <td><input type="radio" name="contributionGroupGoals" value="Quite Good" /> Contributes to group goals but requires frequent reminders and occasional guidance.</td>
                <td><input type="radio" name="contributionGroupGoals" value="Good" /> Contributes to group goals without prompting; reliably fulfills individual responsibilities within the group.</td>
                <td><input type="radio" name="contributionGroupGoals" value="Very Good" /> Actively works toward group goals; takes initiative and fulfills individual responsibilities effectively.</td>
                <td><input type="radio" name="contributionGroupGoals" value="Excellent" /> Consistently and proactively contributes to group goals; takes ownership and leadership in group activities, fully committed.</td>
              </tr>
              <tr>
                <td style={{ fontWeight: 'bold' , fontSize: '15px'}}>Consideration of others</td>
                <td><input type="radio" name="considerationOfOthers" value="Bad" /> Shows little to no consideration for the ideas or feelings of others in the group.</td>
                <td><input type="radio" name="considerationOfOthers" value="Quite Good" /> Occasionally shows awareness of others' feelings, but requires regular reminders to show sensitivity or consideration.</td>
                <td><input type="radio" name="considerationOfOthers" value="Good" /> Often shows sensitivity and consideration for others; contributes positively to group morale and engagement.</td>
                <td><input type="radio" name="considerationOfOthers" value="Very Good" /> Consistently shows respect for others' ideas and feelings; encourages active participation and cooperation within the group.</td>
                <td><input type="radio" name="considerationOfOthers" value="Excellent" /> Demonstrates exceptional sensitivity to others' needs and feelings; fosters a collaborative and inclusive environment for all group members.</td>
              </tr>
              <tr>
                <td style={{ fontWeight: 'bold' , fontSize: '15px'}}>Contribution of knowledge</td>
                <td><input type="radio" name="contributionOfKnowledge" value="Bad" /> Shares ideas only when prompted, provides minimal effort toward intellectual contribution to the group.</td>
                <td><input type="radio" name="contributionOfKnowledge" value="Quite Good" /> Occasionally shares ideas and insights, but contributions may require prompting or lack depth.</td>
                <td><input type="radio" name="contributionOfKnowledge" value="Good" /> Regularly contributes valuable ideas, knowledge, and insights to the group discussions and problem-solving efforts.</td>
                <td><input type="radio" name="contributionOfKnowledge" value="Very Good" /> Consistently provides high-quality ideas and knowledge; encourages knowledge-sharing and learning among group members.</td>
                <td><input type="radio" name="contributionOfKnowledge" value="Excellent" /> Contributes highly innovative and insightful knowledge; often leads discussions and elevates the group's problem-solving capabilities.</td>
              </tr>
              <tr>
                <td style={{ fontWeight: 'bold' , fontSize: '15px'}} >Working and sharing with others</td>
                <td><input type="radio" name="workingWithOthers" value="Bad" /> Avoids teamwork; relies heavily on others to carry the workload.</td>
                <td><input type="radio" name="workingWithOthers" value="Quite Good" /> Participates in teamwork but often needs encouragement and guidance to complete tasks effectively.</td>
                <td><input type="radio" name="workingWithOthers" value="Good" /> Works well with others; completes assigned tasks and occasionally assists with additional work when needed.</td>
                <td><input type="radio" name="workingWithOthers" value="Very Good" /> Collaborates effectively with others, often taking initiative to support group activities and sharing responsibilities.</td>
                <td><input type="radio" name="workingWithOthers" value="Excellent" /> Exemplifies teamwork; takes proactive steps to ensure all members succeed, consistently offering support and leadership when necessary.</td>
              </tr>
            </tbody>
          </table>
        </div>
        <br></br>
        <div className="rating-container">
        <p className="overall-mark-label">Overall Mark: </p>
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
            placeholder="Add comments on cooperation (optional)"
            value={evaluation.cooperationComment}
            onChange={(e) => handleChange('cooperationComment', e.target.value)}
          />
        </div>

        {/* Conceptual Contribution */}
        <div className="form-group">
          <label>2. Conceptual Contribution</label>
          <div class="table-container">
            <table>
              <thead>
                <tr>
                  <th>Criteria</th>
                  <th>Bad</th>
                  <th>Quite Good</th>
                  <th>Good</th>
                  <th>Very Good</th>
                  <th>Excellent</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style={{ fontWeight: 'bold', fontSize: '15px' }}>Research and Gathering Information</td>
                  <td><input type="radio" name="researchInfo" value="Bad" /> Rarely contributes to research or gathering information; only participates when directly instructed.</td>
                  <td><input type="radio" name="researchInfo" value="Quite Good" /> Contributes to research occasionally, but needs reminders or guidance.</td>
                  <td><input type="radio" name="researchInfo" value="Good" /> Consistently contributes to research without needing prompting; provides useful information.</td>
                  <td><input type="radio" name="researchInfo" value="Very Good" /> Actively researches and gathers valuable information; often contributes key insights.</td>
                  <td><input type="radio" name="researchInfo" value="Excellent" /> Takes the lead in research and gathering information; provides in-depth, high-quality insights crucial to the project.</td>
                </tr>
                <tr>
                  <td style={{ fontWeight: 'bold', fontSize: '15px' }}>Idea Generation</td>
                  <td><input type="radio" name="ideaGeneration" value="Bad" /> Rarely contributes new ideas; often relies on others to generate ideas.</td>
                  <td><input type="radio" name="ideaGeneration" value="Quite Good" /> Occasionally suggests ideas, but contributions are not frequent or need prompting.</td>
                  <td><input type="radio" name="ideaGeneration" value="Good" /> Regularly provides meaningful ideas that help drive the project forward.</td>
                  <td><input type="radio" name="ideaGeneration" value="Very Good" /> Consistently contributes well-thought-out ideas that improve the project.</td>
                  <td><input type="radio" name="ideaGeneration" value="Excellent" /> Provides highly creative and original ideas that significantly shape and enhance the direction of the project.</td>
                </tr>
                <tr>
                  <td style={{ fontWeight: 'bold', fontSize: '15px' }}>Problem Identification</td>
                  <td><input type="radio" name="problemIdentification" value="Bad" /> Struggles to identify or articulate problems; relies on others to highlight issues.</td>
                  <td><input type="radio" name="problemIdentification" value="Quite Good" /> Occasionally identifies problems but may need help in articulating them or suggesting solutions.</td>
                  <td><input type="radio" name="problemIdentification" value="Good" /> Frequently identifies key problems and contributes to developing solutions.</td>
                  <td><input type="radio" name="problemIdentification" value="Very Good" /> Regularly identifies potential problems early and suggests effective solutions.</td>
                  <td><input type="radio" name="problemIdentification" value="Excellent" /> Quickly identifies complex problems and consistently proposes innovative solutions that lead to project improvements.</td>
                </tr>
                <tr>
                  <td style={{ fontWeight: 'bold', fontSize: '15px' }}>Connecting Ideas</td>
                  <td><input type="radio" name="connectingIdeas" value="Bad" /> Does not effectively tie together ideas; contributes minimally to discussions about connecting concepts.</td>
                  <td><input type="radio" name="connectingIdeas" value="Quite Good" /> Sometimes connects ideas, but contributions are inconsistent or unclear.</td>
                  <td><input type="radio" name="connectingIdeas" value="Good" /> Regularly ties ideas together effectively, helping the team understand complex concepts.</td>
                  <td><input type="radio" name="connectingIdeas" value="Very Good" /> Consistently ties ideas and concepts together in a clear and cohesive way, improving the overall understanding of the team.</td>
                  <td><input type="radio" name="connectingIdeas" value="Excellent" /> Demonstrates exceptional ability to connect complex ideas in a way that enhances the team's problem-solving and project development.</td>
                </tr>
              </tbody>
            </table>
          </div>

          <br></br>
          <div className="rating-container">
            <p className="overall-mark-label">Overall Mark: </p>
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
            value={evaluation.conceptualContributionComment}
            onChange={(e) => handleChange('conceptualContributionComment', e.target.value)}
          />
        </div>

        {/* Practical Contribution */}
        <div className="form-group">
          <label>3. Practical Contribution</label>
          <div class="table-container">
            <table>
              <thead>
                <tr>
                  <th>Criteria</th>
                  <th>Bad</th>
                  <th>Quite Good</th>
                  <th>Good</th>
                  <th>Very Good</th>
                  <th>Excellent</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style={{ fontWeight: 'bold', fontSize: '15px' }}>Writing Reports or Documents</td>
                  <td><input type="radio" name="writingReports" value="Bad" /> Offers very little or no help with writing; only contributes when instructed.</td>
                  <td><input type="radio" name="writingReports" value="Quite Good" /> Helps with writing occasionally, but needs reminders or offers limited input.</td>
                  <td><input type="radio" name="writingReports" value="Good" /> Regularly helps with writing; contributions are reliable and helpful.</td>
                  <td><input type="radio" name="writingReports" value="Very Good" /> Frequently contributes to writing; ensures clarity and organization in the content.</td>
                  <td><input type="radio" name="writingReports" value="Excellent" /> Takes the lead in writing key sections; ensures clarity, completeness, and overall quality.</td>
                </tr>

                <tr>
                  <td style={{ fontWeight: 'bold', fontSize: '15px' }}>Reviewing Reports or Sections</td>
                  <td><input type="radio" name="reviewingReports" value="Bad" /> Rarely reviews or checks others' work; needs frequent reminders.</td>
                  <td><input type="radio" name="reviewingReports" value="Quite Good" /> Occasionally reviews others' work, but needs prompting.</td>
                  <td><input type="radio" name="reviewingReports" value="Good" /> Consistently reviews others' work and provides useful feedback.</td>
                  <td><input type="radio" name="reviewingReports" value="Very Good" /> Regularly reviews others' work; feedback is detailed and helps improve the final result.</td>
                  <td><input type="radio" name="reviewingReports" value="Excellent" /> Consistently reviews and enhances others' work; ensures high quality and completeness in all sections.</td>
                </tr>

                <tr>
                  <td style={{ fontWeight: 'bold', fontSize: '15px' }}>Organizing Work</td>
                  <td><input type="radio" name="organizingWork" value="Bad" /> Provides minimal support in organizing tasks or planning the project.</td>
                  <td><input type="radio" name="organizingWork" value="Quite Good" /> Helps organize tasks occasionally, but often needs reminders.</td>
                  <td><input type="radio" name="organizingWork" value="Good" /> Contributes to organizing the project; keeps track of tasks and deadlines effectively.</td>
                  <td><input type="radio" name="organizingWork" value="Very Good" /> Frequently helps organize work; keeps the project running smoothly and on time.</td>
                  <td><input type="radio" name="organizingWork" value="Excellent" /> Takes charge in organizing the project; ensures all tasks are well-planned and completed on schedule.</td>
                </tr>

                <tr>
                  <td style={{ fontWeight: 'bold', fontSize: '15px' }}>Preparing Presentations (if needed)</td>
                  <td><input type="radio" name="preparingPresentations" value="Bad" /> Offers little to no assistance with presentations; participates only when asked.</td>
                  <td><input type="radio" name="preparingPresentations" value="Quite Good" /> Occasionally helps with presentations, but needs guidance or reminders.</td>
                  <td><input type="radio" name="preparingPresentations" value="Good" /> Regularly contributes to presentations; fulfills assigned parts well.</td>
                  <td><input type="radio" name="preparingPresentations" value="Very Good" /> Actively participates in preparing engaging and clear presentations.</td>
                  <td><input type="radio" name="preparingPresentations" value="Excellent" /> Leads the preparation of presentations; ensures everything is ready and presented in an excellent manner.</td>
                </tr>
              </tbody>
            </table>
          </div>

          <br></br>
          <div className="rating-container">
            <p className="overall-mark-label">Overall Mark: </p>
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
            placeholder="Add comments on practical contribution (optional)"
            value={evaluation.practicalContributionComment}
            onChange={(e) => handleChange('practicalContributionComment', e.target.value)}
          />
        </div>


        {/* Work Ethic */}
        <div className="form-group">
          <label>4. Work Ethic</label>
          <div class="table-container">
            <table>
              <thead>
                <tr>
                  <th>Criteria</th>
                  <th>Bad</th>
                  <th>Quite Good</th>
                  <th>Good</th>
                  <th>Very Good</th>
                  <th>Excellent</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style={{ fontWeight: 'bold', fontSize: '15px' }}>Attitude and Commitment</td>
                  <td><input type="radio" name="attitudeCommitment" value="Bad" /> Shows little commitment; rarely demonstrates a positive attitude toward the work.</td>
                  <td><input type="radio" name="attitudeCommitment" value="Quite Good" /> Occasionally shows commitment, but needs reminders or encouragement.</td>
                  <td><input type="radio" name="attitudeCommitment" value="Good" /> Regularly shows commitment and a positive attitude; contributes reliably to the group.</td>
                  <td><input type="radio" name="attitudeCommitment" value="Very Good" /> Consistently demonstrates commitment and a positive attitude, helping to motivate the team.</td>
                  <td><input type="radio" name="attitudeCommitment" value="Excellent" /> Exemplifies strong commitment and a positive attitude throughout the project; often boosts team morale.</td>
                </tr>

                <tr>
                  <td style={{ fontWeight: 'bold', fontSize: '15px' }}>Respect for Teammates</td>
                  <td><input type="radio" name="respectTeammates" value="Bad" /> Rarely respects others' ideas, contributions, or deadlines.</td>
                  <td><input type="radio" name="respectTeammates" value="Quite Good" /> Occasionally respects teammates, but sometimes misses deadlines or dismisses others' ideas.</td>
                  <td><input type="radio" name="respectTeammates" value="Good" /> Regularly respects others' ideas and meets deadlines; works well with the team.</td>
                  <td><input type="radio" name="respectTeammates" value="Very Good" /> Consistently respects others' ideas, opinions, and deadlines; supports a positive team environment.</td>
                  <td><input type="radio" name="respectTeammates" value="Excellent" /> Always shows the highest level of respect for others' ideas and deadlines; fosters a respectful and collaborative atmosphere.</td>
                </tr>

                <tr>
                  <td style={{ fontWeight: 'bold', fontSize: '15px' }}>Punctuality and Reliability</td>
                  <td><input type="radio" name="punctualityReliability" value="Bad" /> Often arrives late or misses deadlines; unreliable in completing assigned tasks.</td>
                  <td><input type="radio" name="punctualityReliability" value="Quite Good" /> Occasionally late or misses deadlines; needs reminders to stay on track.</td>
                  <td><input type="radio" name="punctualityReliability" value="Good" /> Regularly on time and reliable; completes tasks as expected.</td>
                  <td><input type="radio" name="punctualityReliability" value="Very Good" /> Consistently punctual and reliable; completes tasks on time and often helps others stay on track.</td>
                  <td><input type="radio" name="punctualityReliability" value="Excellent" /> Always punctual and highly reliable; takes extra steps to ensure all tasks are completed on time and helps others stay organized.</td>
                </tr>

                <tr>
                  <td style={{ fontWeight: 'bold', fontSize: '15px' }}>Adherence to Responsibilities</td>
                  <td><input type="radio" name="adherenceResponsibilities" value="Bad" /> Frequently fails to meet responsibilities or follow through on commitments.</td>
                  <td><input type="radio" name="adherenceResponsibilities" value="Quite Good" /> Sometimes struggles to meet responsibilities without reminders or support.</td>
                  <td><input type="radio" name="adherenceResponsibilities" value="Good" /> Regularly meets responsibilities and fulfills commitments without needing to be reminded.</td>
                  <td><input type="radio" name="adherenceResponsibilities" value="Very Good" /> Consistently meets all responsibilities and commitments; takes responsibility for team success.</td>
                  <td><input type="radio" name="adherenceResponsibilities" value="Excellent" /> Takes full ownership of responsibilities; goes above and beyond to ensure the success of the team and the project.</td>
                </tr>
              </tbody>
            </table>
          </div>

          <br></br>
          <div className="rating-container">
            <p className="overall-mark-label">Overall Mark: </p>
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
            placeholder="Add comments on work ethic (optional)"
            value={evaluation.workEthicComment}
            onChange={(e) => handleChange('workEthicComment', e.target.value)}
          />
        </div>

        <button type="submit" className="submit-button">Submit Evaluation</button>
      </form>
    </div>
    </AppShell>
  );
}

export default PeerEvaluationForm;