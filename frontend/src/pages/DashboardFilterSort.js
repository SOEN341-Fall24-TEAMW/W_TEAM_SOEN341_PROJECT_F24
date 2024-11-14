import React, { useState, useEffect } from 'react';
import { Select, Group } from '@mantine/core';

const DashboardSort = ({ onChange }) => {
  const [sortBy, setSortBy] = useState('');
  const [sortOrder, setSortOrder] = useState('asc');

  useEffect(() => {
    onChange({
      sortBy,
      sortOrder,
    });
  }, [sortBy, sortOrder, onChange]);

  return (
    <Group spacing="md">
      {/* Sort By Column */}
      <Select
        label="Sort by"
        placeholder="Select column"
        data={[
          { value: 'name', label: 'Name' },
          { value: 'id', label: 'ID' },
          { value: 'email', label: 'Email' },
        ]}
        value={sortBy}
        onChange={setSortBy}
      />

      {/* Sort Order */}
      <Select
        label="Sort order"
        placeholder="Select order"
        data={[
          { value: 'asc', label: 'Ascending' },
          { value: 'desc', label: 'Descending' },
        ]}
        value={sortOrder}
        onChange={setSortOrder}
      />
    </Group>
  );
};

export default DashboardSort;