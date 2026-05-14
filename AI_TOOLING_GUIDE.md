# AI Tooling Guide

## Introduction

This guide explains how AI tools were used to accelerate the DelDOT Revenue Forecasting System, how to extend the project with AI, and how others can learn to use these tools effectively.

## AI Tools Used

- **Gemini AI** via `@google/genai`
- **AI Studio / Gemini integration** for the frontend environment
- **AI-assisted documentation and development** via code generation

## How AI Accelerated the Project

### 1. Rapid Documentation

AI was used to generate structured markdown guides for end users, technical staff, and administrators.
This reduced the time needed to create project documentation and ensured consistent formatting.

### 2. Code Review and Refactoring

AI helped inspect repository structure, identify key files, and propose documentation and architecture diagrams.
This accelerated understanding of how the backend, frontend, and data layers are connected.

### 3. Feature Planning

AI can be used to brainstorm enhancements such as:
- real data API integration
- additional forecasting models
- improved visualization components
- role-based user access

## How We Deployed AI in the System

### Frontend

- `@google/genai` was installed in `frontend_deldot/package.json`
- The frontend is ready for AI-powered features such as in-app explanations, report summarization, or forecast commentary
- The current app includes an `AI Studio`-ready deployment path via environment variables and build tooling

### Development Experience

- AI was used in the development workflow to create documentation assets
- It helped translate repository metadata into user-facing guides and diagrams
- AI was also used to inspect code and identify relevant integration points

## Training Others to Use AI Tools

### Step 1: Introduce the Tool

Explain the purpose of the AI tool:
- Gemini AI for natural language and data interaction
- AI Studio for deploying web apps with AI support
- `@google/genai` for direct integration in JavaScript/TypeScript

### Step 2: Show the Setup

1. Add the API key to `.env.local`
2. Install npm dependencies
3. Use the SDK in the app code

### Step 3: Demonstrate Use Cases

- Generating summaries of forecast outputs
- Creating natural-language explanations for charts
- Drafting internal documentation
- Reviewing data transformation logic

### Step 4: Encourage Best Practices

- Keep prompts clear and specific
- Validate AI-generated output before using it in production
- Guard API keys and secrets carefully

## Example AI Workflow

```js
import { GenerativeModel } from '@google/genai'

const model = new GenerativeModel({ apiKey: process.env.GEMINI_API_KEY })

const response = await model.generate({
  prompt: 'Explain the revenue forecast trend in simple terms.',
  maxOutputTokens: 200,
})

console.log(response.outputText)
```

## Teaching Checklist for New Users

- [ ] Understand the project structure
- [ ] Know where the AI API key is stored
- [ ] Run the frontend and verify AI dependencies
- [ ] Use AI for documentation and code insight
- [ ] Review generated output for accuracy

## Common AI Integration Points

- Forecast narrative generation in `ReportView.tsx`
- Interactive question/answer dialogs in the dashboard
- Automated user guidance for scenario configuration
- Data validation and summary generation for `preprocessing/`

## Notes

- AI features should complement, not replace, domain expertise.
- Always review and test AI-assisted changes.
