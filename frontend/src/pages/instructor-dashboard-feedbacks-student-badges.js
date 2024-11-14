import React, { useState, useEffect } from "react";
import { Tooltip, Text, Group } from '@mantine/core';

const StudentFeedbackBadges = ({ averageCooperation, averageConceptualContribution, averagePracticalContribution, averageWorkEthic, averageOverall, studentFeedbacks }) => {
    const [badges, setBadges] = useState([]);

    useEffect(() => {
        let badge_collections = [];

        if (averageCooperation && studentFeedbacks.length > 1) {
            if (averageCooperation === 5) {
                badge_collections.push(
                    <Tooltip label="Team Player: Score of 5 in Cooperation" withArrow>
                        <Text size="xl" role="img" aria-label="Team Player">🤝</Text>
                    </Tooltip>
                );
            } else if (averageCooperation === 6) {
                badge_collections.push(
                    <Tooltip label="Collaborator: Score of 6 in Cooperation" withArrow>
                        <Text size="xl" role="img" aria-label="Collaborator">👥</Text>
                    </Tooltip>
                );
            } else if (averageCooperation === 7) {
                badge_collections.push(
                    <Tooltip label="Leader: Perfect score in Cooperation" withArrow>
                        <Text size="xl" role="img" aria-label="Leader">🏆</Text>
                    </Tooltip>
                );
            }
        }

        if (averageConceptualContribution && studentFeedbacks.length > 1) {
            if (averageConceptualContribution === 5) {
                badge_collections.push(
                    <Tooltip label="Innovator: Score of 5 in Conceptual Contribution" withArrow>
                        <Text size="xl" role="img" aria-label="Innovator">💡</Text>
                    </Tooltip>
                );
            } else if (averageConceptualContribution === 6) {
                badge_collections.push(
                    <Tooltip label="Creative Thinker: Score of 6 in Conceptual Contribution" withArrow>
                        <Text size="xl" role="img" aria-label="Creative Thinker">🧠</Text>
                    </Tooltip>
                );
            } else if (averageConceptualContribution === 7) {
                badge_collections.push(
                    <Tooltip label="Visionary: Perfect score in Conceptual Contribution" withArrow>
                        <Text size="xl" role="img" aria-label="Visionary">🌟</Text>
                    </Tooltip>
                );
            }
        }

        if (averagePracticalContribution && studentFeedbacks.length > 1) {
            if (averagePracticalContribution === 5) {
                badge_collections.push(
                    <Tooltip label="Doer: Score of 5 in Practical Contribution" withArrow>
                        <Text size="xl" role="img" aria-label="Doer">🔨</Text>
                    </Tooltip>
                );
            } else if (averagePracticalContribution === 6) {
                badge_collections.push(
                    <Tooltip label="Hands-On Expert: Score of 6 in Practical Contribution" withArrow>
                        <Text size="xl" role="img" aria-label="Hands-On Expert">🛠️</Text>
                    </Tooltip>
                );
            } else if (averagePracticalContribution === 7) {
                badge_collections.push(
                    <Tooltip label="Master Builder: Perfect score in Practical Contribution" withArrow>
                        <Text size="xl" role="img" aria-label="Master Builder">🏗️</Text>
                    </Tooltip>
                );
            }
        }

        if (averageWorkEthic && studentFeedbacks.length > 1) {
            if (averageWorkEthic === 5) {
                badge_collections.push(
                    <Tooltip label="Diligent: Score of 5 in Work Ethic" withArrow>
                        <Text size="xl" role="img" aria-label="Diligent">🔄</Text>
                    </Tooltip>
                );
            } else if (averageWorkEthic === 6) {
                badge_collections.push(
                    <Tooltip label="Consistent Performer: Score of 6 in Work Ethic" withArrow>
                        <Text size="xl" role="img" aria-label="Consistent Performer">⏱️</Text>
                    </Tooltip>
                );
            } else if (averageWorkEthic === 7) {
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
        <Group style={{ gap : '5px' }}>
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

export default StudentFeedbackBadges;