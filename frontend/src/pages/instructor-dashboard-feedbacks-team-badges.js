import React, { useState, useEffect } from "react";
import { Tooltip, Text, Group } from '@mantine/core';
import PropTypes from 'prop-types';


const TeamFeedBackBadges = ({ feedbackBadgeTeam }) => {
    const [badges, setBadges] = useState([]);

    useEffect(() => {
        
        if (feedbackBadgeTeam) {
            console.log("feedbackBadgeTeam", feedbackBadgeTeam)
        }
    }, [feedbackBadgeTeam]);

    useEffect(() => {
        const badge_collections = [];

        if (feedbackBadgeTeam) {

            if (feedbackBadgeTeam.numberOfFeedbacks === (feedbackBadgeTeam.size * (feedbackBadgeTeam.size -1))) {
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
        <Group justify="center" style={{ gap: '5px' }}>
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

TeamFeedBackBadges.propTypes = {
    feedbackBadgeTeam: PropTypes.shape({
      numberOfFeedbacks: PropTypes.number.isRequired,
      size: PropTypes.number.isRequired,
    }).isRequired,
  };

  
export default TeamFeedBackBadges;