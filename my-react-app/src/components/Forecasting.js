// import React, { useEffect } from 'react';
// import { Chart, registerables } from 'chart.js';
// Chart.register(...registerables);

// function Forecasting() {
//   useEffect(() => {
//     // Keep references to charts
//     let forecastChart;

//     // Forecast Chart
//     const forecastCtx = document.getElementById('forecastChart')?.getContext('2d');
//     if (forecastCtx) {
//       forecastChart = new Chart(forecastCtx, {
//         type: 'line',
//         data: {
//           labels: ['2024','2025','2026','2027','2028'],
//           datasets: [{
//             label: 'Projected Revenue ($M)',
//             data: [200, 220, 240, 260, 280],
//             borderColor: '#007bff',
//             fill: false
//           }]
//         }
//       });
//     }

//     // Cleanup function to destroy charts on unmount
//     return () => {
//       forecastChart?.destroy();
//     };
//   }, []);

//   return (
//     <div>
//       <h2>Revenue Forecasting Tool</h2>
//       <p>This is the interactive tool where you can view and forecast DMV revenue.</p>

//       <h3 className="mt-5">Revenue Forecast</h3>
//       <canvas id="forecastChart"></canvas>
//     </div>
//   );
// }

// export default Forecasting;
import React, { useEffect } from 'react';
import { Chart, registerables } from 'chart.js';
import './Forecasting.css';   // 🔹 add this
Chart.register(...registerables);

function Forecasting() {
  useEffect(() => {
    let forecastChart;

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
            backgroundColor: 'rgba(0, 123, 255, 0.12)',
            fill: true,
            tension: 0.3,
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          interaction: {
            mode: 'index',
            intersect: false,
          },
          plugins: {
            legend: {
              position: 'bottom',
            },
            tooltip: {
              callbacks: {
                label: (context) => {
                  const value = context.parsed.y;
                  return `Projected Revenue: $${value.toLocaleString()}M`;
                },
              },
            },
          },
          scales: {
            y: {
              title: {
                display: true,
                text: 'Revenue ($ millions)',
              },
            },
            x: {
              title: {
                display: true,
                text: 'Year',
              },
            },
          },
        }
      });
    }

    return () => {
      forecastChart?.destroy();
    };
  }, []);

  return (
    <div className="forecast-page">
      <h2 className="forecast-title">Revenue Forecasting</h2>
      <p className="forecast-subtitle">
        This view shows projected DMV revenue over the next several years. It is intended to 
        support planning, budgeting, and “what if” conversations.
      </p>

      <div className="forecast-layout">
        {/* Chart card */}
        <div className="forecast-chart-card">
          <h3 className="chart-heading">Projected Revenue</h3>
          <div className="forecast-chart-body">
            <canvas id="forecastChart"></canvas>
          </div>
        </div>

        {/* Explanation card */}
        <div className="forecast-summary-card">
          <h3 className="summary-heading">How to interpret this chart</h3>
          <ul className="summary-list">
            <li>
              Each point represents the projected total DMV revenue for that year.
            </li>
            <li>
              The upward trend reflects expected growth based on historical patterns and 
              underlying assumptions.
            </li>
            <li>
              This prototype uses sample data. In the full system, these values will be 
              generated directly from the forecasting model.
            </li>
          </ul>
          <p className="disclaimer">
            Forecasts should be interpreted as directional guidance rather than exact values. 
            They are most useful when compared across multiple scenarios and time horizons.
          </p>
        </div>
      </div>
    </div>
  );
}

export default Forecasting;
