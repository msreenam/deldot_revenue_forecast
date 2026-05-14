# DelDOT Revenue Forecast User Guide

## Overview

This guide helps end users navigate the DelDOT Revenue Forecasting System.
The application combines a web dashboard, data visualizations, and forecasting logic to help stakeholders explore revenue projections and policy scenarios.

## Who Should Use This

- Transportation planners
- Revenue analysts
- Policy makers
- Project managers

## What You Can Do

- View revenue forecasts by year and category
- Explore vehicle registration trends and economic indicators
- Compare historical data and predicted outcomes
- Access interactive charts, map views, and report summaries

## Getting Started

### 1. Launch the Application

1. Open a terminal in `deldot_revenue_forecast/frontend_deldot`
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up environment variables by creating `.env.local`
   ```env
   GEMINI_API_KEY=your_gemini_api_key_here
   APP_URL=http://localhost:3000
   ```
4. Start the app:
   ```bash
   npm run dev
   ```
5. Open your browser to `http://localhost:3000`

### 2. Log In

- Use the login form on the homepage.
- The frontend includes a simple authentication flow for accessing dashboard features.

### 3. Navigate the Dashboard

- **Dashboard**: Main screen with revenue charts and key metrics.
- **DelawareMap**: Geographic revenue visualization by region.
- **ReportView**: View or export summarized forecast findings.
- **RevenueChart**: Trend charts for revenue, registrations, and policy impact.

### 4. Interpret Forecasts

- Forecast numbers are generated from the model in `Model/DelDot1.py`.
- Charts may include mock or simulated data for demonstration.
- Use the report view to compare current forecasts with historical baselines.

### 5. Manage Forecast Scenarios

- Input variables such as registration counts, policy changes, or economic indicators are used to test different revenue scenarios.
- The dashboard is designed for interactive analysis.

## Common Tasks

### Refresh Data

- Reload the app in the browser after backend updates.
- Re-run preprocessing or model training if raw data changes.

### Export Results

- Use `ReportView` to generate printable summaries.
- Copy chart values manually if export features are not yet available.

### Troubleshooting

- If charts do not render, verify the browser console for JavaScript errors.
- If data is missing, confirm the frontend is using the correct mock or live dataset.
- If login fails, ensure the app URL in `.env.local` is correct.

## Best Practices

- Use the latest supported browser: Chrome, Edge, or Firefox.
- Keep your Gemini AI API key private.
- Save changes to scenario inputs before switching screens.
- Review both historical and forecast views together.

## Notes

- The current implementation is primarily a demo and prototype.
- Real-time production use requires integration with live data sources and a backend API.
- `my-react-app/` is a legacy frontend and should not be used for the main deployment.

## Contact

For help, reach out to the project team or repository owner and include the page you were using and the issue details.
