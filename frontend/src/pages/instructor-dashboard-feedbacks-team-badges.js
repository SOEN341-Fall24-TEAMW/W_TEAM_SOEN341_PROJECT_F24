import React, { useState, useEffect } from "react";
import { Tooltip, Text, Group } from '@mantine/core';

const TeamFeedBackBadges = ({ feedbackBadgeTeam }) => {
    const [badges, setBadges] = useState([]);

    useEffect(() => {
        const badge_collections = [];
        if (feedbackBadgeTeam) {

            if (feedbackBadgeTeam.numberOfFeedbacks === feedbackBadgeTeam.size) {
                badge_collections.push(
                    <Tooltip label={"Full House: All members submitted feedback"} withArrow>
                        <Text size="xl" role="img" aria-label="Full House">✅</Text>
                    </Tooltip>
                );
            }

        }
        setBadges(badge_collections);
    }, [feedbackBadgeTeam]);

    return (
        <Group style={{ gap: '5px' }}>
            {badges.length > 0 ? (
                badges.map((badge, index) => (
                    <span key={index}>{badge}</span>
                ))
            ) : (
                <Tooltip label={`Awaiting Feedback`} withArrow>
                    <Text size="xl" role="img" aria-label="Waiting for Feedback">⏳</Text>
                </Tooltip>
            )}
        </Group>
    );
}

export default TeamFeedBackBadges;