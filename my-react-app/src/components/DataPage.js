import React, { useEffect } from 'react';
import { Chart, registerables } from 'chart.js';
Chart.register(...registerables);

function DataPage() {
  useEffect(() => {
    // Keep references to charts
    let vehicleChart, licenseChart, economyChart, fuelChart;

    // Vehicle Revenue Chart
    const vehicleCtx = document.getElementById('vehicleChart')?.getContext('2d');
    if (vehicleCtx) {
      vehicleChart = new Chart(vehicleCtx, {
        type: 'bar',
        data: {
          labels: ['Passenger Cars', 'Trucks', 'Motorcycles'],
          datasets: [{
            label: 'Revenue ($M)',
            data: [120, 80, 30],
            backgroundColor: ['#007bff','#28a745','#ffc107']
          }]
        }
      });
    }

    // Driver License Chart
    const licenseCtx = document.getElementById('licenseChart')?.getContext('2d');
    if (licenseCtx) {
      licenseChart = new Chart(licenseCtx, {
        type: 'line',
        data: {
          labels: ['2019','2020','2021','2022','2023'],
          datasets: [{
            label: 'Driver License Revenue ($M)',
            data: [50, 55, 53, 60, 65],
            borderColor: '#17a2b8',
            fill: false
          }]
        }
      });
    }

    // Economy Chart
    const economyCtx = document.getElementById('economyChart')?.getContext('2d');
    if (economyCtx) {
      economyChart = new Chart(economyCtx, {
        type: 'line',
        data: {
          labels: ['2019','2020','2021','2022','2023'],
          datasets: [{
            label: 'Unemployment Rate (%)',
            data: [4, 7, 6, 5, 4.5],
            borderColor: '#dc3545',
            fill: false
          }]
        }
      });
    }

    // Fuel Chart
    const fuelCtx = document.getElementById('fuelChart')?.getContext('2d');
    if (fuelCtx) {
      fuelChart = new Chart(fuelCtx, {
        type: 'bar',
        data: {
          labels: ['Gasoline', 'Diesel', 'Electric'],
          datasets: [{
            label: 'Average Fuel Cost ($)',
            data: [3.5, 3.2, 0.12],
            backgroundColor: ['#6f42c1','#20c997','#fd7e14']
          }]
        }
      });
    }

    // Cleanup function to destroy charts on unmount
    return () => {
      vehicleChart?.destroy();
      licenseChart?.destroy();
      economyChart?.destroy();
      fuelChart?.destroy();
    };
  }, []);

  return (
    <div>
      <h2>Internal DMV Data</h2>
      <p>This page explains the internal data used by the tool:</p>
      <ul>
        <li>Number of Vehicles and Driver's Licenses</li>
        <li>Vehicle Type breakdown</li>
        <li>Typical Ownership Duration</li>
        <li>Renewal Periods and Fee Costs</li>
        <li>Collection Methods</li>
      </ul>

      <h3 className="mt-5">Internal Data Charts</h3>
      <canvas id="vehicleChart"></canvas>
      <canvas id="licenseChart"></canvas>

      <h2 className="mt-5">External Factors</h2>
      <p>We also consider external factors affecting DMV revenue:</p>
      <ul>
        <li>Macroeconomic Trends (inflation, unemployment, etc.)</li>
        <li>Fuel and Energy Costs</li>
        <li>Public Transportation Ridership</li>
        <li>Toll Amounts and Traffic Patterns</li>
      </ul>

      <h3 className="mt-5">External Factors Charts</h3>
      <canvas id="economyChart"></canvas>
      <canvas id="fuelChart"></canvas>
    </div>
  );
}

export default DataPage;
