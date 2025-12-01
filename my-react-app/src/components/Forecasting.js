import React, { useEffect } from 'react';
import { Chart, registerables } from 'chart.js';
Chart.register(...registerables);

function Forecasting() {
  useEffect(() => {
    // Keep references to charts
    let forecastChart;

    // Forecast Chart
    const forecastCtx = document.getElementById('forecastChart')?.getContext('2d');
    if (forecastCtx) {
      forecastChart = new Chart(forecastCtx, {
        type: 'line',
        data: {
          labels: ['2024','2025','2026','2027','2028'],
          datasets: [{
            label: 'Projected Revenue ($M)',
            data: [200, 220, 240, 260, 280],
            borderColor: '#007bff',
            fill: false
          }]
        }
      });
    }

    // Cleanup function to destroy charts on unmount
    return () => {
      forecastChart?.destroy();
    };
  }, []);

  return (
    <div>
      <h2>Revenue Forecasting Tool</h2>
      <p>This is the interactive tool where you can view and forecast DMV revenue.</p>

      <h3 className="mt-5">Revenue Forecast</h3>
      <canvas id="forecastChart"></canvas>
    </div>
  );
}

export default Forecasting;
