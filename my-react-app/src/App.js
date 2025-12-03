import React from 'react';
import { BrowserRouter as Router, Routes, Route, NavLink } from 'react-router-dom';
import './App.css';
import Overview from './components/Overview';
import DataPage from './components/DataPage';
import Forecasting from './components/Forecasting';

function App() {
  const handleLogin = () => {
    window.alert("Warning: Login is not yet implemented.");
  };

  return (
    <Router>
      <div className="App">
        <div className="sidebar">
          <div className="sidebar-header">
            <h2 className="sidebar-title">DelDOT Dashboard</h2>
          </div>
          <nav className="sidebar-nav">
            <NavLink 
              to="/" 
              end
              className={({ isActive }) => isActive ? "nav-link active-link" : "nav-link"}
            >
              <span className="nav-text">Overview</span>
            </NavLink>

            <NavLink 
              to="/data"
              className={({ isActive }) => isActive ? "nav-link active-link" : "nav-link"}
            >
              <span className="nav-text">Data Sources</span>
            </NavLink>

            <NavLink 
              to="/forecasting"
              className={({ isActive }) => isActive ? "nav-link active-link" : "nav-link"}
            >
              <span className="nav-text">Forecasting</span>
            </NavLink>
          </nav>
        </div>

        <div className="main-wrapper">
          <div className="top-bar">
            <button className="login-btn" onClick={handleLogin}>
              Log In
            </button>
          </div>

          <div className="content">
            <Routes>
              <Route path="/" element={<Overview />} />
              <Route path="/data" element={<DataPage />} />
              <Route path="/forecasting" element={<Forecasting />} />
            </Routes>
          </div>
          <footer className="app-footer">
            <p>© 2025 Delaware Department of Transportation · Data Analytics Division</p>
          </footer>
        </div>
      </div>
    </Router>
  );
}

export default App;