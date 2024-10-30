import React from 'react';
import { Drawer, List, ListItem, ListItemText } from '@mui/material';
import ConfigForm from './ConfigForm';
import StoryPointsForm from './StoryPointsForm';

const Sidebar: React.FC = () => {
  return (
    <Drawer
      variant="permanent"
      anchor="left"
      sx={{
        width: 240,
        flexShrink: 0,
        [`& .MuiDrawer-paper`]: { width: 240, boxSizing: 'border-box' },
      }}
    >
      <List>
        <ListItem>
          <ListItemText primary="Configuration" />
        </ListItem>
        <ListItem>
          <ConfigForm />
        </ListItem>
        <ListItem>
          <ListItemText primary="Story Points Mapping" />
        </ListItem>
        <ListItem>
          <StoryPointsForm />
        </ListItem>
      </List>
    </Drawer>
  );
};

export default Sidebar;
