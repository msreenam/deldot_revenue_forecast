import React from 'react';
import { BrowserRouter as Router, Routes, Route, NavLink } from 'react-router-dom';
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
          <NavLink 
  to="/" 
  end
  className={({ isActive }) => isActive ? "active-link" : "sidebar-link"}
>
  Overview
</NavLink>

<NavLink 
  to="/data"
  className={({ isActive }) => isActive ? "active-link" : "sidebar-link"}
>
  Data Sources
</NavLink>

<NavLink 
  to="/forecasting"
  className={({ isActive }) => isActive ? "active-link" : "sidebar-link"}
>
  Forecasting
</NavLink>

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
