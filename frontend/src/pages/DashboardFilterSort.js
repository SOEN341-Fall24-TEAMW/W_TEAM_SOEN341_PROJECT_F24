import React, { useState } from 'react';
import { Select, TextInput, Button, Group } from '@mantine/core';

const DashboardFilterSort = ({ onApply }) => {
  const [filterBy, setFilterBy] = useState('');       // Column to filter by
  const [filterValue, setFilterValue] = useState(''); // Value to filter by
  const [sortBy, setSortBy] = useState('');           // Column to sort by
  const [sortOrder, setSortOrder] = useState('asc');  // Sort order

  const handleApply = () => {
    onApply({
      filterBy,
      filterValue,
      sortBy,
      sortOrder,
    });
  };

  return (
    <Group spacing="md">
      {/* Filter By Column */}
      <Select
        label="Filter by"
        placeholder="Select column"
        data={[
          { value: 'name', label: 'Name' },
          { value: 'id', label: 'ID' },
          { value: 'email', label: 'Email' },
        ]}
        value={filterBy}
        onChange={setFilterBy}
      />

      {/* Filter Value */}
      <TextInput
        label="Filter value"
        placeholder="Enter value"
        value={filterValue}
        onChange={(event) => setFilterValue(event.currentTarget.value)}
      />

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

      {/* Apply Button */}
      <Button onClick={handleApply}>Apply</Button>
    </Group>
  );
};

export default DashboardFilterSort;
