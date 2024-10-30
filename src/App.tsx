import React from 'react';
import { CssBaseline, Container, Grid } from '@mui/material';
import Sidebar from './components/Sidebar';
import ResourceForm from './components/ResourceForm';
import './styles.css';

const App: React.FC = () => {
  return (
    <div className="App">
      <CssBaseline />
      <Grid container>
        <Grid item className="sidebar">
          <Sidebar />
        </Grid>
        <Grid item xs className="content">
          <Container>
            <h1>Sprint Planner</h1>
            <ResourceForm />
          </Container>
        </Grid>
      </Grid>
    </div>
  );
};

export default App;
