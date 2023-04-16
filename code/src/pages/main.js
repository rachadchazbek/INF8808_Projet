import * as React from 'react';
import { useEffect } from 'react';
import Box from '@mui/material/Box';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import LifeHabitsPage from './LifeHabits/life-habits-tab';
import PhysicalHabitsPage from './PhysicalHabits/physical-habits-tab';
import MetabolismPage from './Metabolism/metabolism-tab';

export default function CenteredTabs() {
  const [value, setValue] = React.useState(1);

  const handleChange = (_event, newValue) => {
    setValue(newValue);
    window.history.pushState(newValue, null);
  };

  useEffect(() => {
    const valueFromUrl = window.history.state;
    if (valueFromUrl) {
      setValue(valueFromUrl);
    } else {
      setValue(1);
    }
    }, [])

  const itemsTab = [
    { label: 'Habitudes de vies', value: 1},
    { label: 'Métabolisme', value: 3 },
    { label: 'Caractéristiques physiques', value: 2 },
  ];

  const itemsContent = [
    {value : 1, component: <LifeHabitsPage /> },
    {value : 2, component: <PhysicalHabitsPage /> },
    {value : 3, component: <MetabolismPage /> },
  ]

  return (
    <Box sx={{ width: '100%', bgcolor: 'background.paper' }}>
      <Tabs value={value} onChange={handleChange} centered>
        {itemsTab.map((item) => (
            <Tab label={item.label} value={item.value} key={item.value} ></Tab>
        ))}
      </Tabs>
      
      {itemsContent.map((item) => (
        value === item.value && item.component
      ))}
    </Box>
  );
}