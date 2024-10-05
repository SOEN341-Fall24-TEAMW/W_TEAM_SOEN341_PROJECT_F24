import React, { useState } from "react";
import { NavLink } from '@mantine/core';
import { IconGauge, IconFingerprint, IconNotes } from '@tabler/icons-react';
import './styles.css';

const InstructorDashboard = ({ course }) => {

    const [navBarTabSelected, setNavBarTabSelected] = useState('');

    const tabs = {
        IconGauge: { label: 'Students', icon: IconGauge },
        IconFingerprint: { label: 'Teams', icon: IconFingerprint },
        IconNotes: { label: 'Admin', icon: IconNotes },
    };

    const handleClick = (tabKey) => {
        setNavBarTabSelected(tabKey);
    };

    return (
        <div className='mainContainer'>
            <div className='navBar'>
                {Object.entries(tabs).map(([iconKey, tabData]) => (
                    <NavLink
                        key={iconKey}
                        leftSection={React.createElement(tabData.icon, { size: '1rem', stroke: 1.5 })}
                        id={navBarTabSelected === iconKey ? 'navBarTabSelected' : 'navBarTab'}
                        childrenOffset={28}
                        label={tabData.label}
                        onClick={() => handleClick(iconKey)}
                    />
                ))}
            </div>
            <div>
                <h1>Selected Course: {course}</h1>
            </div>
        </div>
    );
};

export default InstructorDashboard;
