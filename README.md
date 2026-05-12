# DelDOT Revenue Forecasting System

A comprehensive revenue forecasting system for the Delaware Department of Transportation (DelDOT), combining machine learning models with an interactive web dashboard to predict transportation revenue based on vehicle registrations, economic indicators, and policy mechanisms.

## Table of Contents

- [Architecture Overview](#architecture-overview)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Running Locally](#running-locally)
- [Environment Variables](#environment-variables)
- [Project Structure](#project-structure)
- [Deployment](#deployment)
- [Known Issues and Limitations](#known-issues-and-limitations)
- [Future Work](#future-work)
- [Contributing](#contributing)

## Architecture Overview

The system consists of three main components:

### Backend (Python)
- **Preprocessing Pipeline**: Data cleaning and feature engineering using scikit-learn pipelines
- **Machine Learning Model**: Revenue forecasting models trained on historical data
- **Data Management**: Utilities for loading, processing, and saving datasets

### Frontend (React/TypeScript)
- **Dashboard**: Interactive web interface for visualizing forecasts and scenarios
- **Data Visualization**: Charts and maps showing revenue projections and trends
- **User Authentication**: Simple login system for accessing the portal

### Data Layer
- **External Data Sources**: Economic indicators, vehicle registration data, travel demand metrics
- **Mock Data Generation**: Simulated data for development and testing
- **Policy Integration**: Incorporation of transportation policies and regulations

## Prerequisites

- **Python 3.8+** with pip or uv package manager
- **Node.js 18+** with npm
- **Git** for version control

## Installation

### Backend Setup

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd deldot_revenue_forecast
   ```

2. Create a Python virtual environment:
   ```bash
   # Using uv (recommended)
   uv venv

   # Or using venv
   python -m venv .venv
   ```

3. Activate the virtual environment:
   ```bash
   # On Windows
   .venv\Scripts\activate

   # On macOS/Linux
   source .venv/bin/activate
   ```

4. Install Python dependencies:
   ```bash
   # Using uv
   uv pip install -e .

   # Or using pip
   pip install -e .
   ```

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend_deldot
   ```

2. Install Node.js dependencies:
   ```bash
   npm install
   ```

## Running Locally

### Backend

The backend preprocessing and model components can be run as Python scripts:

```bash
# Run data preprocessing
python -c "from preprocessing.preprocessor import DataPreprocessor; # ... your code"

# Run the model
python Model/DelDot1.py
```

### Frontend

1. Set up environment variables (see [Environment Variables](#environment-variables))

2. Start the development server:
   ```bash
   npm run dev
   ```

3. Open your browser to `http://localhost:3000`

### Full System

To run the complete system:

1. Ensure both backend and frontend are set up
2. Start the frontend development server
3. The frontend includes mock data generation for demonstration purposes

## Environment Variables

Create a `.env.local` file in the `frontend_deldot/` directory:

```env
# Required: Gemini AI API key for AI-powered features
GEMINI_API_KEY=your_gemini_api_key_here

# Optional: Application URL (automatically set in production)
APP_URL=http://localhost:3000
```

**Note**: Never commit actual API keys or secrets to version control. Use the `.env.example` file as a template.

## Project Structure

```
deldot_revenue_forecast/
├── pyproject.toml                 # Python project configuration
├── README.md                      # This file
├── External_Data/                 # External data sources
│   └── TOTALSA.csv               # Vehicle sales data
├── frontend_deldot/              # React frontend application
│   ├── src/
│   │   ├── components/           # React components
│   │   │   ├── Dashboard.tsx     # Main dashboard
│   │   │   ├── DelawareMap.tsx   # Geographic visualizations
│   │   │   ├── Login.tsx         # Authentication component
│   │   │   ├── ReportView.tsx    # Report generation
│   │   │   └── RevenueChart.tsx  # Revenue visualizations
│   │   ├── types/                # TypeScript type definitions
│   │   │   ├── data.ts          # Data interfaces
│   │   │   └── policy.ts        # Policy-related types
│   │   ├── utils/               # Utility functions
│   │   │   └── data.ts          # Data processing utilities
│   │   └── App.tsx              # Main application component
│   ├── package.json              # Node.js dependencies
│   ├── vite.config.ts           # Vite configuration
│   └── .env.example             # Environment variables template
├── Model/                        # Machine learning models
│   └── DelDot1.py               # Main forecasting model
├── preprocessing/                # Data preprocessing package
│   ├── __init__.py
│   ├── preprocessor.py          # Main preprocessing class
│   ├── readme.md                # Preprocessing documentation
│   ├── tests/                   # Unit tests
│   │   ├── __init__.py
│   │   ├── preprocessor_test.py
│   │   └── utils_test.py
│   └── utils/                   # Preprocessing utilities
│       ├── __init__.py
│       ├── exception.py         # Custom exceptions
│       ├── load_data.py         # Data loading functions
│       └── save_to_file.py      # Data export functions
└── my-react-app/                # Legacy React application (deprecated)
```

## Deployment

### Frontend Deployment

The frontend is configured for deployment to AI Studio or similar platforms:

1. Build the application:
   ```bash
   npm run build
   ```

2. The `dist/` directory contains the production build

3. Deploy the `dist/` contents to your hosting platform

### Backend Deployment

The Python components can be deployed as:

- **Docker Container**: Package the preprocessing pipeline and models
- **Cloud Function**: For serverless preprocessing tasks
- **API Service**: Expose models via REST API endpoints

### Environment-Specific Configuration

- **Development**: Uses local environment with mock data
- **Production**: Requires real API keys and data sources
- **AI Studio**: Automatically injects environment variables

## Known Issues and Limitations

### Current Limitations
- **Mock Data**: Currently uses simulated data instead of real DelDOT datasets
- **Single Model**: Only one forecasting model implemented (DelDot1.py)
- **No API Integration**: Frontend and backend are not fully integrated
- **Limited Validation**: Minimal input validation and error handling
- **Performance**: Not optimized for large datasets (>50GB)

### Known Bugs
- Data loading may fail with certain CSV formats
- Chart rendering issues in some browsers
- Authentication state not persisted across browser sessions reliably

### Data Quality Issues
- External data sources may have inconsistencies
- Missing data handling is basic (mean/mode imputation only)
- No outlier detection or anomaly handling

## Future Work

### High Priority
- **Real Data Integration**: Connect to actual DelDOT databases and APIs
- **API Development**: Build REST API for backend-frontend communication
- **Model Validation**: Implement cross-validation and performance metrics
- **User Authentication**: Upgrade to secure authentication system

### Medium Priority
- **Multiple Models**: Implement ensemble forecasting approaches
- **Real-time Updates**: Add streaming data capabilities
- **Advanced Visualizations**: Interactive maps and scenario comparisons
- **Policy Simulation**: Dynamic policy impact modeling

### Long-term Goals
- **Scalability**: Handle larger datasets with distributed processing
- **Machine Learning Ops**: Model versioning, monitoring, and retraining pipelines
- **Multi-modal Forecasting**: Incorporate additional data sources (traffic, weather, etc.)
- **Stakeholder Dashboards**: Role-based access and customized views

### Technical Improvements
- **Testing Coverage**: Expand unit and integration tests
- **Documentation**: API documentation and user guides
- **Performance Optimization**: Caching, lazy loading, and database indexing
- **Security**: Implement proper authentication, authorization, and data encryption

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature-name`
3. Make your changes with appropriate tests
4. Ensure all tests pass: `npm test` (frontend) and `pytest` (backend)
5. Commit your changes: `git commit -am 'Add some feature'`
6. Push to the branch: `git push origin feature/your-feature-name`
7. Submit a pull request

### Code Style
- **Python**: Follow PEP 8 guidelines
- **TypeScript/React**: Use ESLint and Prettier configurations
- **Documentation**: Update README and docstrings for any API changes

### Testing
- Write unit tests for new functionality
- Ensure existing tests still pass
- Test both frontend and backend components

