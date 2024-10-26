import React from 'react';
import { NavLink } from '@mantine/core'; 
import { IconUsers, IconClipboardList, IconMessageCircle } from '@tabler/icons-react'; // Icons

// Define tabs available in the navigation bar
const tabs = [
  { label: 'Students', icon: IconUsers },
  { label: 'Evaluate Peers', icon: IconClipboardList },
  { label: 'Peer Feedback', icon: IconMessageCircle },
];

export function NavbarStudentDashboard({ active, setActive }) {
  return (
    <nav className="sidebar">
      <ul>
        {tabs.map((data) => (
          <li key={data.label}>
            <NavLink
              label={data.label}
              leftSection={<data.icon size={16} />}
              active={active === data.label}
              onClick={() => setActive(data.label)} 
            />
          </li>
        ))}
      </ul>
    </nav>
  );
}
