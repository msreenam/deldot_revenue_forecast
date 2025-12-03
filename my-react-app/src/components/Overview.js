import React from 'react';
import './Overview.css';

function Overview() {
  return (
    <div className="overview">
      <div>
        <h1 className="overview-title">DMV Revenue Dashboard</h1>
        <p className="overview-subtitle">
          Track historical revenue, analyze trends, and generate future forecasts based on current data sources.
        </p>
      </div>

      {/* Key Metrics */}
      <div className="metrics-container">
        <div className="metric-card">
          <div className="metric-value">$3.2M</div>
          <p className="metric-label">Latest Monthly Revenue</p>
        </div>

        <div className="metric-card">
          <div className="metric-value">94%</div>
          <p className="metric-label">Model Accuracy</p>
        </div>

        <div className="metric-card">
          <div className="metric-value">7</div>
          <p className="metric-label">Data Sources Loaded</p>
        </div>

        <div className="metric-card">
          <div className="metric-value">Dec 2025</div>
          <p className="metric-label">Last Updated</p>
        </div>
      </div>

      {/* What's in This Dashboard */}
      <div className="overview-description">
        <h3>📊 What's in This Dashboard</h3>
        <p>
          This comprehensive tool integrates internal DMV metrics with external macroeconomic factors to provide accurate revenue analysis and forecasting.
        </p>
        <ul>
          <li><strong>Data Sources:</strong> Explore internal DMV data and external economic indicators that drive revenue</li>
          <li><strong>Forecasting:</strong> View AI-powered revenue projections based on integrated data</li>
          <li><strong>Analysis:</strong> Understand key patterns and trends affecting DMV revenue</li>
        </ul>
      </div>

      {/* Key Insights */}
      <div className="insights-section">
        <h3>💡 Key Insights</h3>
        <ul>
          <li>Historical revenue shows seasonal patterns with peaks in Q1 and Q4</li>
          <li>External economic factors (unemployment, fuel costs) directly impact revenue streams</li>
          <li>Vehicle registration renewal cycles contribute 65% of total DMV revenue</li>
          <li>Driver's license fees account for 35% of annual revenue</li>
          <li>Public transportation ridership inversely correlates with vehicle registrations</li>
        </ul>
      </div>

      {/* About Section */}
      <div className="about-section">
        <h3>ℹ️ About This Project</h3>
        <p>
          Developed by DelDot Team 1, Computer Science Senior Design Project, UD (2025). This dashboard provides real-time insights into DMV revenue streams and forecasting models, enabling data-driven fiscal planning and resource allocation for state programs and infrastructure projects.
        </p>
      </div>
    </div>
  );
}

export default Overview;
