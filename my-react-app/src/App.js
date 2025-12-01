import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import './App.css';
import Overview from './components/Overview';
import DataPage from './components/DataPage';
import Forecasting from './components/Forecasting';

function App() {
  return (
    <Router>
      <div className="App">
        <div className="sidebar">
          <h3>DMV Dashboard</h3>
          <Link to="/">Overview</Link>
          <Link to="/data">Data Sources</Link>
          <Link to="/forecasting">Forecasting</Link>
        </div>

        <div className="content">
          <Routes>
            <Route path="/" element={<Overview />} />
            <Route path="/data" element={<DataPage />} />
            <Route path="/forecasting" element={<Forecasting />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
