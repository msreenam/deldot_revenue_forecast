// import React from 'react';

// function Overview() {
//   return (
//     <div>
//       <h2>Overview</h2>
//       <p>Welcome to the DMV Revenue Analysis and Forecasting Tool.</p>
//       <p>This tool helps analyze past DMV revenue and forecast future trends using both internal DMV data and external economic factors.</p>
//     </div>
//   );
// }

// export default Overview;
import React from 'react';
import './Overview.css';

function Overview() {
  return (
    <div className="overview">
      <h2 className="overview-title">Overview</h2>
      <p className="overview-subtitle">
        Welcome to the DelDOT Revenue Analysis and Forecasting Dashboard.
      </p>

      {/* Metric Cards */}
      <div className="metrics-container">
        <div className="metric-card">
          <h3 className="metric-value">$3.2M</h3>
          <p className="metric-label">Latest Monthly Revenue</p>
        </div>

        <div className="metric-card">
          <h3 className="metric-value">94%</h3>
          <p className="metric-label">Model Accuracy</p>
        </div>

        <div className="metric-card">
          <h3 className="metric-value">7</h3>
          <p className="metric-label">Data Sources Loaded</p>
        </div>

        <div className="metric-card">
          <h3 className="metric-value">Nov 2025</h3>
          <p className="metric-label">Last Updated</p>
        </div>
      </div>

      {/* Description */}
      <div className="overview-description">
        <p>
          This dashboard provides insights into historical DMV revenue trends and 
          generates revenue forecasts. You can explore:
        </p>
        <ul>
          <li>Historical revenue patterns</li>
          <li>External economic influences</li>
          <li>Forecasted future revenue</li>
          <li>Downloadable datasets and visual reports</li>
        </ul>
      </div>
    </div>
  );
}

export default Overview;
