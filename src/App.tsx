import React from 'react';
import { CssBaseline, Container, Grid } from '@mui/material';
import Sidebar from './components/Sidebar';
import ResourceForm from './components/ResourceForm';
import './styles.css';

const App: React.FC = () => {
    return (
        <div className="App">
            <h1>Sprint Planner</h1>
            <ResourceForm />
        </div>
    );
};

export default App;
