import React, { useState, useEffect } from "react";
import { Tooltip, Text, Group } from '@mantine/core';
import PropTypes from 'prop-types';


const StudentFeedbackBadges = ({ averageCooperation, averageConceptualContribution, averagePracticalContribution, averageWorkEthic, averageOverall, studentFeedbacks }) => {
    const [badges, setBadges] = useState([]);

    useEffect(() => {
        let badge_collections = [];

        if (averageCooperation && studentFeedbacks.length > 1) {
            if (averageCooperation === 7) {
                badge_collections.push(
                    <Tooltip label="Leader: Perfect score in Cooperation" withArrow>
                        <Text size="xl" role="img" aria-label="Leader">🏆</Text>
                    </Tooltip>
                );
            }
        }

        if (averageConceptualContribution && studentFeedbacks.length > 1) {
            if (averageConceptualContribution === 7) {
                badge_collections.push(
                    <Tooltip label="Visionary: Perfect score in Conceptual Contribution" withArrow>
                        <Text size="xl" role="img" aria-label="Visionary">🌟</Text>
                    </Tooltip>
                );
            }
        }

        if (averagePracticalContribution && studentFeedbacks.length > 1) {
            if (averagePracticalContribution === 7) {
                badge_collections.push(
                    <Tooltip label="Master Builder: Perfect score in Practical Contribution" withArrow>
                        <Text size="xl" role="img" aria-label="Master Builder">🏗️</Text>
                    </Tooltip>
                );
            }
        }

        if (averageWorkEthic && studentFeedbacks.length > 1) {
            if (averageWorkEthic === 7) {
                badge_collections.push(
                    <Tooltip label="Role Model: Perfect score in Work Ethic" withArrow>
                        <Text size="xl" role="img" aria-label="Role Model">👔</Text>
                    </Tooltip>
                );
            }
        }

        if (averageOverall && studentFeedbacks.length > 1) {
            if (averageOverall === 7) {
                badge_collections.push(
                    <Tooltip label="Star Performer: Perfect average score" withArrow>
                        <Text size="xl" role="img" aria-label="Star Performer">👑</Text>
                    </Tooltip>
                );
            }
        }

        setBadges(badge_collections);
    }, [averageCooperation, averageConceptualContribution, averagePracticalContribution, averageWorkEthic, averageOverall, studentFeedbacks]);

    return (
        <Group justify="center" style={{ gap : '5px' }}>
            {badges.length > 0 ? (
                badges.map((badge, index) => (
                    <span key={index}>{badge}</span>
                ))
            ) : (
                <Tooltip label="Keep working to earn badges!" withArrow>
                    <Text size="xl" role="img" aria-label="Hourglass">⏳</Text>
                </Tooltip>
            )}
        </Group>
    );
}

StudentFeedbackBadges.propTypes = {
    averageCooperation: PropTypes.number.isRequired,
    averageConceptualContribution: PropTypes.number.isRequired,
    averagePracticalContribution: PropTypes.number.isRequired,
    averageWorkEthic: PropTypes.number.isRequired,
    averageOverall: PropTypes.number.isRequired,
    studentFeedbacks: PropTypes.arrayOf(PropTypes.object).isRequired,  // assuming feedbacks are objects
  };

export default StudentFeedbackBadges;